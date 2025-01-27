import { Request, Call } from "../_request";
import { ResponseArray } from "../../response/response";


export const UserGetRequest: Request  = {
    method: 'user.get',
    responseClass: ResponseArray,



    shortcuts: {
        /**
         * Получает сотрудников указанного отделения.
         * 
         * @async
         * @param department - ид подразделения.
         * @param params - Дополнительные параметры выборки. Заполнять по правилам UserRequest.get.
         * @returns Массив с результатами ответа. 
         */
        async fromDepartment(department: number | string, params={}) {
            params.UF_DEPARTMENT = department;
            return await UserGetRequest.call(params);
        }
    }      
}