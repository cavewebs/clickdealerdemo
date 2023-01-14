import { DeleteItemCommand, DeleteItemCommandInput, DeleteItemCommandOutput, DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput, QueryCommand, QueryCommandInput, QueryCommandOutput, UpdateItemCommand, UpdateItemCommandInput, UpdateItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { VEHICLE_PK } from "../models/vehicle-model";

export class VehicleRepository {
    private tableName = "vehicleData";
    private partitionKey = "type";
    private sortKey = "id";
    constructor(protected dynamo: DynamoDBClient) { }


    /**
     * Lists the vehicles available in the DynamoDB.
     *
     * @returns {Promise<Vehicle[]>} a list of vehicles
     */
    async list(): Promise<QueryCommandOutput> {
        const input: QueryCommandInput = {
            TableName: this.tableName,
            ExpressionAttributeNames: {
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":queryType": { S: VEHICLE_PK }
            },
            KeyConditionExpression: "#type = :queryType"
        };
        const command = new QueryCommand(input);
        const response = await this.dynamo.send(command);
        return response;
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

    async fetch(id: string): Promise<QueryCommandOutput> {

        const input: QueryCommandInput = {
            TableName: this.tableName,
            ExpressionAttributeNames: {
                "#type": "type",
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":queryType": { S: VEHICLE_PK },
                ":queryId": { S: id }
            },
            KeyConditionExpression: "#type = :queryType AND #id = :queryId"
        };
        const command = new QueryCommand(input);
        const response = await this.dynamo.send(command);

        return response;
    }

    async updateTodo(payload: Record<string, any>, id: string): Promise<UpdateItemCommandOutput> {

        const input: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: {
                [this.partitionKey]: { S: VEHICLE_PK },
                [this.sortKey]: { S: id }
            },
            UpdateExpression: "SET #status = :updatedStatus",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":updatedStatus": { S: payload.status }
            }
        };
        const command = new UpdateItemCommand(input);
        const response = await this.dynamo.send(command);
        return response;
    }

    async deleteTodo(id: string): Promise<DeleteItemCommandOutput> {

        const input: DeleteItemCommandInput = {
            TableName: this.tableName,
            Key: {
                [this.partitionKey]: { S: VEHICLE_PK },
                [this.sortKey]: { S: id }
            }
        };
        const command = new DeleteItemCommand(input);
        const response = await this.dynamo.send(command);

        return response;
    }

}
