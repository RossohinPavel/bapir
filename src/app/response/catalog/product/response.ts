import { ResponseHandler } from "../../handlers";


export namespace ProductResponse {
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