import { Request, Call } from "./base";
import { BasicRespose } from "../responses/basic";


export const UserRequests: Request = {
    method: 'test',
    responseClass: BasicRespose,
    
    /**
     * docs
     */
    call: async function (params: {}) {
        return Call.method(this, params);
    }

}
