import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";


export class VehicleRepository {
    private tableName = "vehicleData";
    private partitionKey = "type";
    private sortKey = "id";
    constructor(protected dynamo: DynamoDBClient) { }

    /**
     * Checking that the vehicle exists
     *
     * @param {string} code Vehicle code
     * @returns {boolean} Whether the vehicle exists
     */
    async exists(code: string): Promise<boolean> {
        const vehicle = await this.retrieve(code);

        return !!vehicle;
    }

    /**
     * Retrieve the vehicle from the DynamoDB table if one exists with the provided <name>name</name>.
     * If such vehicle doesn't exist return <name>undefined</name>.
     *
     * @param {string} code the code for the vehicle which should be retrieved
     * @returns {Promise<Vehicle|undefined>} if the vehicle  with the provided name exists
     * then return the promise with the vehicle, otherwise returns <name>undefined</name>
     */
    async retrieve(code: string): Promise<Vehicle | undefined> {
        return await this.sendGetCommand(Vehicle, {
            code,
            pk: KEY_VEHICLE_ENTITY,
            sk: SK_VEHICLE_ENTITY,
        });
    }

    /**
     * Lists the vehicles available in the DynamoDB.
     *
     * @returns {Promise<Vehicle[]>} a list of vehicles
     */
    async list(): Promise<Vehicle[]> {
        return await this.sendScanCommand(Vehicle, { key: KEY_VEHICLE_ENTITY });
    }

    /**
     * Creates an vehicle entity in the DynamoDB table.
     *
     * @param {CreateVehicleData} payload vehicle data required to create an Vehicle entity in the DynamoDB table
     * @returns {Promise<Vehicle>} the created Vehicle
     */
    async create(payload: Record<string, any>): Promise<PutItemCommandOutput> {
        const putItem: any = {};
        for (const key in payload) {
            putItem[key] = {
                S: payload[key]
            };
        }

        const input: PutItemCommandInput = {
            TableName: this.tableName,
            Item: putItem
        };
        const command = new PutItemCommand(input);
        return await this.dynamo.send(command);
    }

}
