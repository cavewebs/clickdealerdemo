import { CreateVehicleUseCase } from "./create.vehicle.usecase";
import { getDynamoDbClient } from "../../libs/ddb.client";
import { VehicleRepository } from "../../repositories/vehicle-repository";
import { FetchVehicleUseCase } from "./fetch.vehicle.usecase";
import { ListVehiclesUseCase } from "./list.vehicle.usecase";
import { DeleteVehicleUseCase } from "./delete.vehicle.usecase";
import { UpdateVehicleUseCase } from "./update.vehicle.usecase";

export interface Dependencies {
  createVehicleUseCase: CreateVehicleUseCase;
  fetchVehicleUseCase: FetchVehicleUseCase;
  listVehiclesUseCase: ListVehiclesUseCase;
  updateVehicleUseCase: UpdateVehicleUseCase;
  deleteVehicleUseCase: DeleteVehicleUseCase;
}



/**
 * Build dependencies for Lambda
 *
 * @param {ExtraDependencies} root0 Dependencies all ready available
 * @param {Pino.Logger} root0.logger Logging object
 * @returns {Promise<Dependencies>} Dependencies for Lambda
 */
export async function makeDependencies(): Promise<Dependencies> {
  const dynamoClient = getDynamoDbClient();

  const vehiclesRepo = new VehicleRepository(dynamoClient);

  const createVehicleUseCase = new CreateVehicleUseCase(vehiclesRepo);
  const updateVehicleUseCase = new UpdateVehicleUseCase(vehiclesRepo);
  const fetchVehicleUseCase = new FetchVehicleUseCase(vehiclesRepo);
  const listVehiclesUseCase = new ListVehiclesUseCase(vehiclesRepo);
  const deleteVehicleUseCase = new DeleteVehicleUseCase(vehiclesRepo);

  return {
    createVehicleUseCase,
    fetchVehicleUseCase,
    listVehiclesUseCase,
    updateVehicleUseCase,
    deleteVehicleUseCase,
  };
}
