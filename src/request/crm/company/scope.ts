import { Call } from "../../request";
import { CompanyHandler } from "../../../response/crm/company/handler";


type commonParam = string | string[] | number | number[] | boolean;

export type ListParams = {
    select?: string[],
    filter?: {[key: string]: commonParam},
    order?: {[key: string]: string}
};

export namespace CompanyScope {

    /**
     * Получает список команий по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/companies/crm-company-list.html
     * 
     * @async
     * @param params Параметры запроса
     * @param params.select Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter Объект полей для фильтрации
     * @param params.order Объект полей для Сортировки
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('crm.company.list', params, CompanyHandler.array);
    }
}