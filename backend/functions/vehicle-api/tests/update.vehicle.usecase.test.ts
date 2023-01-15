import { IVehicle, Status, VEHICLE_PK } from "../../../models/vehicle-model";
import { HttpStatusCodes } from "../../../libs/constants";
import { APIGatewayProxyEvent } from "aws-lambda";
import { VehicleRepository } from "../../../repositories/vehicle-repository";
import { UpdateVehicleUseCase } from "../update.vehicle.usecase";
import { v4 as uuid } from 'uuid';

describe("Update Vehicle Use Case", () => {
    it("updates a vehicle", async () => {
        const { useCase, baseEvent, vehicle, repo, vehicleID } = makeTestFixture();

        const rawEvent = {
            make: vehicle.make,
            model: vehicle.model,
            regDate: vehicle.regDate,
            regNo: vehicle.regNo,
        };

        const event = {
            ...baseEvent,
            pathParameters: { id: vehicleID },
            body: JSON.stringify(rawEvent),
        } as unknown as APIGatewayProxyEvent;

        const response = await useCase.execute(event);

        expect(response.statusCode).toEqual(HttpStatusCodes.OK);
        expect(JSON.parse(response.body)).toMatchObject({
            make: vehicle.make,
            model: vehicle.model,
            regDate: vehicle.regDate,
            regNo: vehicle.regNo,
        });

        expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it("fails to update a vehicle when no request body is provided", async () => {
        const { useCase, baseEvent, vehicleID } = makeTestFixture();
        const event = {
            ...baseEvent,
            pathParameters: { id: vehicleID },
        } as unknown as APIGatewayProxyEvent;

        const response = await useCase.execute(event);
        expect(response.statusCode).toEqual(HttpStatusCodes.BadRequest);
        expect(JSON.parse(response.body)).toMatchObject({
            msg: "Missing request body"
        });
    });

    it("fails to update a vehicle when no vehice ID is provided as path parameter", async () => {
        const { useCase, baseEvent, vehicle } = makeTestFixture();
        const event = {
            ...baseEvent,
            body: JSON.stringify(vehicle),
        } as unknown as APIGatewayProxyEvent;

        // await expect(async () => await useCase.execute(event)).rejects.toThrow(
        //     expect.stringContaining("Request body could not be parsed as JSON"),
        // );
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
    const vehicle = {
        "make": "Innoson Motors",
        "regNo": "FCT 12BX",
        "regDate": "12-12-2022",
        "model": "IVM3i",
    } as IVehicle;

    const repo = {
        update: jest.fn().mockResolvedValue(vehicle),
    } as unknown as VehicleRepository;



    const useCase = new UpdateVehicleUseCase(repo);

    const baseEvent = {
        requestContext: {
            stage: "prod",
        },
        headers: {
            Host: "test.clickdealer-demo.test",
        },
    };

    return {
        vehicle,
        baseEvent,
        repo,
        vehicleID,
        useCase,
    };
}
