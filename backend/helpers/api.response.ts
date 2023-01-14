import { APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const apiResponse = (status: number, body: Record<string, any>): APIGatewayProxyResult => {
    return {
        body: JSON.stringify(body),
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Content-control": "no-store",
            Pragma: "no-cache",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Access-Control-Allow-Credentials": true
        }
    };
};

export const fromDynamoItem = (item: any) => {

    return unmarshall(item);
}
