import { Response } from "../../response";


export namespace ContactResponse {
    export const handler = {
        ...Response.handler,
    }

    export const arrayHandler = {
        ...Response.arrayHandler,
    }

    export const batchHandler = {
        ...Response.batchHandler,
    }
}