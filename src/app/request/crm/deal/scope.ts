import { Call } from "../../request";
import { DealResponse } from "../../../response/crm/deal/response";

import { UserfieldScope } from "./userfield/scope";



type commonParam = string | number | boolean;

type ListParams = {
    select?: string[],
    filter?: {[key: string]: commonParam},
    order?: {[key: string]: string}
};


/**
 * Запросы для crm.deal
 */
export namespace DealScope {
    export const userfiled = UserfieldScope;
    
    /**
     * Получает список сделок по фильтрам.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/deals/crm-deal-list.html
     * 
     * @async
     * @param params Параметры запроса
     * @param params.select Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter Перечисление полей для фильтрации
     * @param params.order Перечисление полей для Сортировки
     * @returns
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('crm.deal.list', params, DealResponse.arrayHandler);
    }
}