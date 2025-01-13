import { Request, Call } from "./base";
import { BasicRespose } from "../responses/basic";


export const UserRequests: Request = {
    method: 'test',
    responseClass: BasicRespose,
    
    /**
     * docs
     * @param params 
     * @returns 
     */
    call(params: {}) {
        return Call.method(this, params);
    }

};