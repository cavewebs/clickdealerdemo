import { BadRequestError } from "../libs/errors";

export const parsePayload = (body: string | null): any => {
    if (!body) {
        throw new BadRequestError("Request body is empty");
    }

    try {
        return JSON.parse(body);
    } catch {
        throw new BadRequestError("Request body could not be parsed as JSON");
    }
};
