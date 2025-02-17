import { Call } from "../../request";
import { ProductPropertyEnumsHandler } from "../../../response/catalog/productPropertyEnums/handler";


type commonParam = string | number | boolean;

type ListParams = {
    select?: string[],
    filter?: {[key: string]: commonParam},
    order?: {[key: string]: string}
};



export namespace ProductPropertyEnumScope {

    /**
     * Получить список значений списочных свойств продуктов
     * @see https://apidocs.bitrix24.ru/api-reference/catalog/product-property-enum/catalog-product-property-enum-list.html
     * Из-за особенностей метода, вернется массив, который будет содрежать объекты
     * productPropertyEnums - значение которого в свою очередь тоже является массивом)
     * 
     * @async
     * @param params Параметры запроса
     * @param params.select Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter Объект полей для фильтрации
     * @param params.order Объект полей для Сортировки
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('catalog.productPropertyEnum.list', params, ProductPropertyEnumsHandler.array);
    }

    /**
     * Получает группы продуктов
     * 
     * @async
     * @param params - Параметры запроса
     * @param params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter - Объект полей для фильтрации
     * @param params.order - Объект полей для Сортировки
     */
    export async function productGroups(params: ListParams = {}) {
        !params.order && (params.order = {});
        !params.order.value && (params.order.value = 'ASC');
        !params.select && (params.select = []);
        !params.select.push('id', 'value');
        !params.filter && (params.filter = {});
        !params.filter.propertyId && (params.filter.propertyId = 175);
        return await list(params);
    }
}