import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const getDynamoDbClient = () => {
    return new DocumentClient({ region: process.env.AWS_REGION });
}
