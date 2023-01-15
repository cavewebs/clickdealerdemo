import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { handleErrors } from "../../libs/errors";
import { Contracts } from "../../contracts/vehicle.contracts";
import { parsePayload } from "../../helpers/validators";


export class UpdateVehicleUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const { body } = event;
        if (!body || body === null) return apiResponse(HttpStatusCodes.BadRequest, { msg: "Missing request body" });
        const payload: Contracts.UpdateVehicle = parsePayload(event.body);
        const id = event.pathParameters?.id;
        if (!id) return apiResponse(HttpStatusCodes.BadRequest, { msg: "'id' must be provided as a URL path parameter" });
        try {
            const vehicle = await this.vehicleRepo.update({
                ...payload,
            }, id);
            if (vehicle === null) {
                return apiResponse(HttpStatusCodes.NotFound, { msg: `Vehicle with ID ${id} does not exist` });
            }
            return apiResponse(HttpStatusCodes.OK, vehicle);
        } catch (err: any) {
            return handleErrors(err);

        }
    }
}
