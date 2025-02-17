import { ResponseHandler } from "../../handlers";


export namespace ProductPropertyEnumsResponse {
    export const handler = {
        ...ResponseHandler.object,
    }

    export const arrayHandler = {
        ...ResponseHandler.array,
    }

    export const batchHandler = {
        ...ResponseHandler.batch,
    }
}