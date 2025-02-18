import { Call } from "../../../request";
import { OfferHandler } from "../../../../response/catalog/product/offer/handler";


type ListParams = {
    select?: string[],
    filter?: {[key: string]: string | number | boolean},
    order?: {[key: string]: string}
};


/**
 * Запросы для catalog.product.offer
 */
export namespace OfferScope {
    
    /**
     * Получает список Вариаций по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/catalog/product/offer/catalog-product-offer-list.html
     * 
     * @async
     * @param params - Параметры запроса
     * @param params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter - Объект полей для фильтрации
     * @param params.order - Объект полей для Сортировки
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('catalog.product.offer.list', params, OfferHandler.array);
    }
}