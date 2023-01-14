import { Status } from "../../models/vehicle-model";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parsePayload } from "../../helpers/validators";
import { apiResponse, fromDynamoItem } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { Contracts } from "../../contracts/vehicle.contracts";
import { BadRequestError } from "../../libs/errors";


export class FetchVehicleUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const id = event.pathParameters?.id;
        if (!id) throw new BadRequestError("'id' must be provided as a URL path parameter");
        const vehicle = await this.vehicleRepo.fetch(id);
        console.log("response in FetchVehicleUseCase", vehicle);
        const response = fromDynamoItem(vehicle.Items)
        return apiResponse(HttpStatusCodes.Created, response);

    }
}
