import { Call } from "../../../request";


type commonParam = string | number | boolean;

type ListParams = {
    order?: {[key: string]: string},
    filter?: {[key: string]: string}
}

/**
 * Запросы для скоупа crm.deal.userfield
 */
export namespace UserfieldScope {

     /**
     * Метод возвращает список пользовательских полей сделок по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/deals/user-defined-fields/crm-deal-userfield-list.html
     *
     * @async
     * @param params Параметры запросы
     * @param params.order Поля сортировки. { "SORT": "ASC" }
     * @param params.filter Поля фильтрации { "MANDATORY": "N" }
     * @returns
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod("crm.deal.userfield.list", params)
    }
}