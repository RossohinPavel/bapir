import { objectHandler } from "./_object"
import { arrayHandler } from "./_array";
import { batchHandler } from "./_batch";


export namespace DealHandler {
    export const object = objectHandler;
    export const array = arrayHandler;
    export const batch = batchHandler;
}
