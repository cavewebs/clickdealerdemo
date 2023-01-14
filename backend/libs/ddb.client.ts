import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const getDynamoDbClient = () => {
    return new DynamoDBClient({ region: process.env.AWS_REGION });
}
