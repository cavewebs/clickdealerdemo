import { HttpStatusCodes } from "../../../libs/constants";
import { APIGatewayProxyEvent } from "aws-lambda";
import { VehicleRepository } from "../../../repositories/vehicle-repository";
import { v4 as uuid } from 'uuid'
import { DeleteVehicleUseCase } from "../delete.vehicle.usecase";


describe("Delete Vehicle Use Case", () => {
    it("deletes a vehicle from database", async () => {
        const { useCase, baseEvent, repo, vehicleID } = makeTestFixture();

        const event = {
            ...baseEvent,

            pathParameters: {
                id: vehicleID,
            },
        } as unknown as APIGatewayProxyEvent;

        const response = await useCase.execute(event);

        expect(repo.delete).toHaveBeenCalledWith(vehicleID);
        expect(response.statusCode).toEqual(HttpStatusCodes.OK);
    });

    it("fails to delete a vehicle when no code is provided", async () => {
        const { useCase, baseEvent } = makeTestFixture();

        const event = {
            ...baseEvent,

            pathParameters: {},
        } as unknown as APIGatewayProxyEvent;

        const response = await useCase.execute(event);
        expect(response.statusCode).toEqual(HttpStatusCodes.BadRequest);
        expect(JSON.parse(response.body)).toMatchObject({
            msg: "'id' must be provided as a URL path parameter"
        });
    });
});

/**
 * Test fixture for setting up and use in tests
 *
 * @returns {{vehicle, baseEvent, repo, usecase}} as a new object
 */
function makeTestFixture() {
    const vehicleID = uuid()
    const repo = {
        delete: jest.fn().mockResolvedValue(uuid),
    } as unknown as VehicleRepository;



    const useCase = new DeleteVehicleUseCase(repo);

    const baseEvent = {
        requestContext: {
            stage: "prod",
        },
        headers: {
            Host: "test.clickdealer-demo.test",
        },
    };

    return {
        vehicleID,
        baseEvent,
        repo,
        useCase,
    };
}
