import { Call } from "../request";
import { UserHandler } from "../../response/user/handler";


export type GetParams = {
    sort?: string,
    order?: string,
    [key: string]: string | string[] | number | number[] | boolean
}


export namespace UserScope {

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
    export async function get(params: GetParams = {}) {
        params.ACTIVE === undefined && (params.ACTIVE = true);
        return await Call.listMethod('user.get', params, UserHandler.array);
    }

    /**
     * Получает сотрудников указанного отделения.
     * 
     * @async
     * @param department - ид подразделения.
     * @param params - Дополнительные параметры выборки. Заполнять по правилам UserRequest.get.
     * @returns Массив с результатами ответа. 
     */
    export async function fromDepartment(department: number | string, params: GetParams = {}) {
        params.UF_DEPARTMENT = department;
        return await get(params);
    }
}