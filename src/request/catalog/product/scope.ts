import { Call } from "../../request";
import { OfferScope } from "./offer/scope";

import { ProductHandler } from "../../../response/catalog/product/handler";



type commonParam = string | number | boolean;

type ListParams = {
    select?: string[],
    filter?: {[key: string]: commonParam},
    order?: {[key: string]: string}
};


/**
 * Запросы для catalog.product
 */
export namespace ProductScope {
    export const offer = OfferScope;
    
    /**
     * Получает список товаров по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/catalog/product/catalog-product-list.html
     * 
     * @async
     * @param params - Параметры запроса
     * @param params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter - Объект полей для фильтрации
     * @param params.order - Объект полей для Сортировки
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('catalog.product.list', params, ProductHandler.array);
    }
}