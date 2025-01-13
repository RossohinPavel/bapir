import { BasicRespose } from "../responses/basic";
import { BX24W } from "./wrapper";


export interface Request {
    method: string;
    responseClass: typeof BasicRespose;
    params?: object;
    call(params: {}): Promise<BasicRespose>;
};


export const Call = {
    listMethod: async () => {},
    longBatch: async () => {},
    method: requestClosure(BX24W.callMethod),
};


function requestClosure(func: any) {
    return async function (request: Request, params: object): Promise<BasicRespose> {
        const result = await func(request.method, params);
        const response = new request.responseClass();
        const className = response.constructor.name;
        request.responseClass._cache[className] = request;
        return Object.assign(response, result);
    }
}