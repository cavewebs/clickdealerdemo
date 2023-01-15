import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";

export class DeleteVehicleUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const id = event.pathParameters?.id;
        if (!id) return apiResponse(HttpStatusCodes.BadRequest, { msg: "'id' must be provided as a URL path parameter" });
        const resp = await this.vehicleRepo.delete(id);
        if (resp === null) {
            return apiResponse(HttpStatusCodes.NotFound, { msg: `Vehicle with ID ${id} does not exist` });
        }
        return apiResponse(HttpStatusCodes.OK, { msg: "Successfully deleted the vehicle record with ID " + id });

    }
}
