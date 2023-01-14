import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { Contracts } from "../../contracts/vehicle.contracts";


export class ListVehiclesUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

        const payload: Contracts.CreateVehicle = parsePayload(event.body);
        const nowISO = new Date().toISOString();
        const vehicle = await this.vehicleRepo.create({
            ...payload,
            type: "Vehicle",
            id: uuid(),
            status: Status.AVAILABLE,
            createdAt: nowISO,
            updatedAt: nowISO,
        });

        return apiResponse(HttpStatusCodes.Created, vehicle);

    }
}
