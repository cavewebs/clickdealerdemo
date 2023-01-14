import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { NotFoundError } from "../../libs/errors";
import { Dependencies } from "./dependencies";
import { HttpMethods } from "../../libs/constants";

export class VehicleRouter {
    constructor(private deps: Dependencies) { }

    async route(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const { httpMethod, resource } = event;

        let response;

        switch (resource) {
            case "/vehicles":
                if (httpMethod === HttpMethods.GET) {
                    response = await this.deps.listVehiclesUseCase.execute();
                } else if (httpMethod === HttpMethods.POST) {
                    response = await this.deps.createVehicleUseCase.execute(event);
                }
                break;

            case "/vehicles/{code}":
                if (httpMethod === HttpMethods.GET) {
                    response = await this.deps.fetchVehicleUseCase.execute(event);
                } else if (httpMethod === HttpMethods.PATCH) {
                    response = await this.deps.updateVehicleUseCase.execute(event);
                } else if (httpMethod === HttpMethods.DELETE) {
                    response = await this.deps.deleteVehicleUseCase.execute(event);
                }
                break;
        }

        if (!response) {
            throw new NotFoundError(
                "The requested resource does not exist.",
                "The collection or resource does not exist at that location.",
            );
        }

        return response;
    }
}
