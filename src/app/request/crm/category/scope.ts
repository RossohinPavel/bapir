import { Call } from "../../_request";
import { CategoryArray } from "../../../response/crm/category/response";


type ListParams = {
    entityTypeId: string | number
};


/**
 * Запросы для crm.category
 */
export namespace CategoryScope {

    /**
     * Получает список crm сущностей.
     * Список будет под ключом "categories"
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     * @param params Параметры запроса
     * @param params.entityTypeId - ИД црм сущности
     */
    export async function list(params: ListParams = {entityTypeId: 2}) {
        return await Call.listMethod('crm.category.list', params, CategoryArray);
    }

    /**
     * Получает список воронок
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     */
    export async function funnels() {
        return await list({entityTypeId: 2});
    }
}