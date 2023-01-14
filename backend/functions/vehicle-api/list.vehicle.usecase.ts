import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { Contracts } from "../../contracts/vehicle.contracts";
import { BadRequestError, errorResponse } from "../../libs/errors";


export class ListVehiclesUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(): Promise<APIGatewayProxyResult> {

        try {
            const vehicles = await this.vehicleRepo.list();
            return apiResponse(200, vehicles);
        } catch (err: any) {
            throw new BadRequestError(err,);
        }
    }

}
