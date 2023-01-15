import { VehicleRepository } from "../../repositories/vehicle-repository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiResponse, } from "../../helpers/api.response";
import { HttpStatusCodes } from "../../libs/constants";
import { handleErrors, } from "../../libs/errors";


export class FetchVehicleUseCase {
    constructor(private vehicleRepo: VehicleRepository) { }

    async execute(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const id = event.pathParameters?.id;
        if (!id) return apiResponse(HttpStatusCodes.BadRequest, { msg: "'id' must be provided as a URL path parameter" });
        try {
            const vehicle = await this.vehicleRepo.fetch(id);
            if (!vehicle.Item) {
                return apiResponse(HttpStatusCodes.NotFound, { msg: "No Vehicle Found with ID " + id })
            }
            return apiResponse(HttpStatusCodes.OK, vehicle)
        } catch (err: any) {

            return handleErrors(err);
        }

    }
}
