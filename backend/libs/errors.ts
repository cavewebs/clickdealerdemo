import { APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCodes } from "./constants";

export const errorResponse = (
    requestId: string,
    statusCode: number,
    type: string,
    title: string,
    extra?: Record<string, unknown>,
): APIGatewayProxyResult => {
    return {
        body: JSON.stringify({
            ...extra,
            requestId,
            status: statusCode,
            title,
        }),
        headers: {
            "Content-Type": "application/problem+json",
        },
        statusCode,
    };
};

export interface APIError {
    name: string;
    message: string;

    response(requestId: string): APIGatewayProxyResult;
}

/**
 * Raise this API error when the access to a particular resource/operation is not permitted. Results in the <code>HTTP 403 Forbidden</code>
 */
export class AccessDeniedError extends Error implements APIError {
    title: string;
    detail: string;

    constructor(message: string, title: string, detail: string) {
        super(message);
        this.name = "access_denied";
        this.title = title;
        this.detail = detail;
    }

    response(requestId: string): APIGatewayProxyResult {
        return errorResponse(requestId, HttpStatusCodes.Forbidden, "forbidden", this.title, { detail: this.detail });
    }
}

/**
 * Raise this API error when the request URI contains an invalid path, or the provided resource identifier doesn't correspond to any of the resources.
 * Results in the <code>HTTP 404 Not Found</code>
 */
export class NotFoundError extends Error implements APIError {
    detail: string;

    constructor(message: string, detail: string) {
        super(message);
        this.name = "not_found";
        this.detail = detail;
    }

    response(requestId: string): APIGatewayProxyResult {
        return errorResponse(requestId, HttpStatusCodes.NotFound, "not-found", this.message, { detail: this.detail });
    }
}

/**
 * Raise this API error when the request body is invalid structurally (e.g. invalid JSON), or the provided data in the request body is invalid
 * (e.g. identifiers to other resources are invalid - point to non-existent resources). Results in the <code>HTTP 400 Bad Request</code>
 */
export class BadRequestError extends Error implements APIError {
    detail: string;

    constructor(detail: string, message?: string) {
        super(message ?? "Bad request");
        this.name = "bad_request";
        this.detail = detail;
    }

    response(requestId: string): APIGatewayProxyResult {
        return errorResponse(requestId, HttpStatusCodes.BadRequest, "bad-request", this.message, { detail: this.detail });
    }
}


export const handleErrors = (err: Error): APIGatewayProxyResult => {
    console.log("Exception", err);
    let errorMessage = "";
    if (err instanceof Error) {
        errorMessage = err.message;
    } else {
        errorMessage = JSON.stringify(err);
    }
    const result: APIGatewayProxyResult = {
        statusCode: HttpStatusCodes.InternalServerError,
        body: `Internal server error: ${errorMessage}`
    };

    return result;
};