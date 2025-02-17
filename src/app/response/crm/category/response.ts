import { ResponseHandler } from "../../handlers"


export namespace CategoryResponse {
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