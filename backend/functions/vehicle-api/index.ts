import { APIGatewayProxyEvent } from "aws-lambda";
import { makeDependencies } from "./dependencies";
import { VehicleRouter } from "./vehicle.router";

export const handler = async (event: APIGatewayProxyEvent) => {

    const deps = await makeDependencies();

    return await new VehicleRouter(deps).route(event);
}
