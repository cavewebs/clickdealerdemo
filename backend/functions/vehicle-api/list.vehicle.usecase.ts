import { IVehicle, Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse, fromDynamoItem } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { Contracts } from "../../contracts/vehicle.contracts";
import { BadRequestError, errorResponse, handleErrors } from "../../libs/errors";

export interface VehicleResponse {
    id: string;
    make: string;
    model: string;
    regNo: string;
    regDate: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
export class ListVehiclesUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(): Promise<APIGatewayProxyResult> {
        try {
            const vehicles = await this.vehicleRepo.list();
            return apiResponse(200, vehicles);
        } catch (err: any) {
            return handleErrors(err);
        }
    }

}
