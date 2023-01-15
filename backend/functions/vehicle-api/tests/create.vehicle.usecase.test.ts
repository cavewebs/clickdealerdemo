import { IVehicle, Status, VEHICLE_PK } from "../../../models/vehicle-model";
import { HttpStatusCodes } from "../../../libs/constants";
import { APIGatewayProxyEvent } from "aws-lambda";
import { VehicleRepository } from "../../../repositories/vehicle-repository";
import { CreateVehicleUseCase } from "../create.vehicle.usecase";

describe("Create Vehicle Use Case", () => {
    it("creates a vehicle", async () => {
        const { useCase, baseEvent, vehicle, repo } = makeTestFixture();

        const rawEvent = {
            make: vehicle.make,
            model: vehicle.model,
            regDate: vehicle.regDate,
            regNo: vehicle.regNo,
        };

        const event = {
            ...baseEvent,
            body: JSON.stringify(rawEvent),
        } as unknown as APIGatewayProxyEvent;

        const response = await useCase.execute(event);

        expect(response.statusCode).toEqual(HttpStatusCodes.Created);
        expect(JSON.parse(response.body)).toMatchObject({
            msg: expect.any(String)
        });

        expect(repo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                ...rawEvent,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                status: Status.AVAILABLE,
            }),
        );
    });
});

/**
 * Test fixture for setting up and use in tests
 *
 * @returns {{vehicle, baseEvent, repo, usecase}} as a new object
 */
function makeTestFixture() {

    const vehicle = {
        "make": "Toyota",
        "regNo": "FCT 12BX",
        "regDate": "12-12-2015",
        "model": "Camry",
    } as IVehicle;

    const repo = {
        create: jest.fn().mockResolvedValue(vehicle),
    } as unknown as VehicleRepository;



    const useCase = new CreateVehicleUseCase(repo);

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
        useCase,
    };
}
