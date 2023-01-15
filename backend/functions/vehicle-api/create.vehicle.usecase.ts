import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { Contracts } from "../../contracts/vehicle.contracts";
import { handleErrors } from "../../libs/errors";


export class CreateVehicleUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const { body } = event;
        if (body === null) return apiResponse(HttpStatusCodes.BadRequest, { msg: "Missing request body, it appears no data was submitted" });
        const payload: Contracts.CreateVehicle = parsePayload(event.body);
        try {
            const nowISO = new Date().toISOString();
            const vehicle = await this.vehicleRepo.create({
                ...payload,
                PK: "Vehicle",
                id: uuid(),
                status: Status.AVAILABLE,
                createdAt: nowISO,
                updatedAt: nowISO,
            });
            return apiResponse(HttpStatusCodes.Created, { msg: "Successfully created a vehicle record" });
        } catch (err: any) {
            return handleErrors(err);
        }

    }
}
