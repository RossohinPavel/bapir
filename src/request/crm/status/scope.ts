import { Call } from "../../request";
import { StatusHandler } from "../../../response/crm/status/handler";


type commonParam = string | number | boolean;

type ListParams = {
    filter?: {[key: string]: commonParam },
    order?: {[key: string]: string },
}


/**
 * Запросы к справочникам crm
 */
export namespace StatusScope {
    /**
     * Метод возвращает список элементов справочника по фильтру.
     * Фильтры в этом методе работают только в режиме полного совпаденя.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/status/crm-status-list.html
     * 
     * @async
     * @param {object} params - Параметры для запроса. 
     * @param {object} params.filter - Фильтрация, например { "ENTITY_ID": "STATUS" }
     * @param {object} params.order - Сортировка, например { "SORT": "ASC" }
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('crm.status.list', params, StatusHandler.array);
    }

    /**
     * Получает все возможные статусы (стадии сделок) для указанной воронки
     * 
     * @async
     * @param funnelID Ид воронки
     * @param params Дополнительные параметры выборки. Заполнять по правилам CRMStatusResponse.list.
     * @returns Массив с результатами запроса. 
     */
    export async function funnelStages(funnelID: number | string, params: ListParams = {}) {
        const filter = params.filter ??= {};
        filter.ENTITY_ID = 'DEAL_STAGE' + (funnelID != 0 ? `_${funnelID}` : '');
        return await list(params);
    }
}