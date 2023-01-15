import { DeleteItemOutput, PutItemOutput, QueryOutput, UpdateItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { VEHICLE_PK } from "../models/vehicle-model";

export class VehicleRepository {
    private tableName = "vehicleData";
    constructor(protected dynamo: DocumentClient) { }


    /**
     * Lists the vehicles available in the DynamoDB.
     *
     */
    async list(): Promise<DocumentClient.ItemList> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :vType',
            ExpressionAttributeValues: {
                ':vType': VEHICLE_PK,
            }
        }
        const response = await this.dynamo.query(params).promise();
        if (response.Items) {
            return response.Items;
        }
        throw new Error('Unable to list all vehicles');
    }

    /**
     * Creates an vehicle entity in the DynamoDB table.
     *
     * @param {CreateVehicleData} payload vehicle data required to create an Vehicle entity in the DynamoDB table
     * @returns {Promise<Vehicle>} the created Vehicle
     */
    async create(payload: Record<string, any>): Promise<PutItemOutput> {
        const params = {
            TableName: this.tableName,
            Item: payload
        };

        return await this.dynamo.put(params).promise();

    }

    async fetch(id: string): Promise<DocumentClient.GetItemOutput> {
        const params = {
            TableName: this.tableName,
            Key: {
                ["PK"]: VEHICLE_PK,
                ["id"]: id
            }
        }

        return await this.dynamo.get(params).promise();
    }

    async update(payload: Record<string, any>, id: string): Promise<UpdateItemOutput | null> {
        const exists = await this.fetch(id);
        if (!exists.Item) {
            return null;
        }
        const params: any = {
            TableName: this.tableName,
            Key: {
                ["PK"]: VEHICLE_PK,
                ["id"]: id,
            },
            ExpressionAttributeValues: {
                ':make': payload.make,
                ':model': payload.model,
                ':regNo': payload.regNo,
                ':regDate': payload.regDate
            },
            UpdateExpression: 'SET make = :make, ' +
                'model = :model, regNo = :regNo, regDate = :regDate',
            ReturnValues: 'UPDATED_NEW',
        }
        return await this.dynamo.update(params).promise();
    }

    async delete(id: string): Promise<DeleteItemOutput | null> {
        const exists = await this.fetch(id);
        if (!exists.Item) {
            return null;
        }
        const params = {
            TableName: this.tableName,
            Key: {
                id,
                PK: VEHICLE_PK
            }
        }

        return await this.dynamo.delete(params).promise();

    }

}
