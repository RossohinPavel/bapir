import { Request, Call } from "../request";
import { ResponseArray } from "../../response/response";


export const UserGetRequest: Request  = {
    method: 'user.get',
    responseClass: ResponseArray,

    /**
     * Получения списка пользователей. Не смотрите на название метода, это скам от битрикса.
     * Выполняет запрос используя списочный метод callListMethod.
     * Фильтры для запроса нужно формировать по правилам битрикса. Смотри прикрепленную ссылку.
     * По умолчанию применяется фильтр, что пользователь активен (не уволен).
     * @see https://apidocs.bitrix24.ru/api-reference/user/user-get.html
     * 
     * @async
     * @param params - Объект с параметрами запроса.
     * @param params.sort - Ключ сортировки.
     * @param params.order - Направление сортировки.
     * @returns Массив с результатами ответа. 
     */
    async call(params={}) {
        params.ACTIVE === undefined && (params.ACTIVE = true);
        return await Call.listMethod(this, params);
    },

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