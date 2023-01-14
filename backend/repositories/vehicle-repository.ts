import { DeleteItemCommand, DeleteItemCommandInput, DeleteItemCommandOutput, DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput, QueryCommand, QueryCommandInput, QueryCommandOutput, UpdateItemCommand, UpdateItemCommandInput, UpdateItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { fromDynamoItem } from "../helpers/api.response";
import { IVehicle, VEHICLE_PK } from "../models/vehicle-model";

export class VehicleRepository {
    private tableName = "vehicleData";
    private partitionKey = "type";
    private sortKey = "id";
    constructor(protected dynamo: DocumentClient) { }


    /**
     * Lists the vehicles available in the DynamoDB.
     *
     * @returns {Promise<Vehicle[]>} a list of vehicles
     */
    async list(): Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                type: VEHICLE_PK,
            }
        }
        const response = await this.dynamo.get(params).promise();

        return response;
    }

    /**
     * Creates an vehicle entity in the DynamoDB table.
     *
     * @param {CreateVehicleData} payload vehicle data required to create an Vehicle entity in the DynamoDB table
     * @returns {Promise<Vehicle>} the created Vehicle
     */
    async create(payload: Record<string, any>): Promise<any> {
        const putItem: any = {};
        for (const key in payload) {
            putItem[key] = {
                S: payload[key]
            };
        }
        const params = {
            TableName: this.tableName,
            Item: payload
        };

        const input: PutItemCommandInput = {
            TableName: this.tableName,
            Item: putItem
        };
        const command = new PutItemCommand(input);
        return await this.dynamo.put(params).promise();

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

    async update(payload: Record<string, any>, id: string): Promise<UpdateItemCommandOutput> {

        const input: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: {
                [this.partitionKey]: { S: VEHICLE_PK },
                [this.sortKey]: { S: id }
            },
            ExpressionAttributeValues: {
                ':make': payload.make,
                ':model': payload.model,
                ':regNo': payload.regNo,
                ':regDate': payload.regDate,
                ':status': payload.status,
            },
            UpdateExpression: 'SET make = :make, ' +
                'model = :model, regNo = :regNo, regDate = :regDate, status = :status',
            ReturnValues: 'UPDATED_NEW',
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
