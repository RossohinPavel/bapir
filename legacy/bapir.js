
const BX24W = new BX24Wrapper();




/**
 * Базовый класс для всех ответов
 */
class Response {
    result = null;

    /**
     * Возвращает представление result в виде объекта, где ключи - ID (или id) объекта, а значения - сам объект.
     * Внимание! Повторяющиеся сущности, у которых один id будут объеденены.
     * @returns {object}
     */
    byID() {
        const obj = {};
        this.flatIterator().forEach((item, index) => {
            const id = item.ID || item.id || index;
            obj[id] = item;
        });
        return obj;
    }

    /**
     * Итератор по result. 
     * Если result объект, то вернет его.
     * Если result массив, то вернет его значения.
     * Если result вложенный массив, как получается при результате батч запросов, то будет возвращать каждый его елемент.
     */
    *flatIterator(obj) {
        obj = obj === undefined ? this.result : obj;
        if ( Array.isArray(obj) ) {
            for ( const value of obj ) {
                const iterator = this.flatIterator(value);
                for ( const inner of iterator ) {
                    yield inner;
                }
            }
            return;
        }
        yield obj;
    }
}



class CRMDealResponse extends Response {

    /**
     * Метод для получения Компаний из сделок.
     * В объектах сделок должен присутствовать ключ COMPANY_ID.
     * 
     * @async
     * @param {object} params - Дополнительные параметры для запроса. Заполнять по правилам CRMCompanyRequest.list
     * @returns {Promise<Array<object>>}
     */
    async companies(params={}) {
        const preRequests = new Set();
        for ( const deal of this.flatIterator() ) {
            deal.COMPANY_ID && preRequests.add(deal.COMPANY_ID);
        }
        const ids = Array.from(preRequests);
        let companies;
        if ( preRequests.length === 0 ) {
            companies = new CRMCompanyRequest.responseClass();
            companies.result = ids;
        } else {
            if ( 'filter' in params ) {
                params.filter['@ID'] = ids;
            } else {
                params.filter = {"@ID": ids};
            }
            companies = await CRMCompanyRequest.list(params);
        }
        return companies;
    }

    /**
     * Метод для получения Контактов из сделок.
     * В объектах сделок должен присутствовать ключ COMPANY_ID.
     *
     * @async
     * @param {object} params - Дополнительные параметры для запроса. Заполнять по правилам CRMCompanyRequest.list
     * @returns {Promise<Array<object>>}
     */
    async contacts(params={}) {
        const preRequests = new Set();
        for ( const deal of this.flatIterator() ) {
            deal.CONTACT_ID && preRequests.add(deal.CONTACT_ID);
        }
        const ids = Array.from(preRequests);
        let companies;
        if ( preRequests.length === 0 ) {
            companies = new CRMContactRequest.responseClass();
            companies.result = ids;
        } else {
            if ( 'filter' in params ) {
                params.filter['@ID'] = ids;
            } else {
                params.filter = {"@ID": ids};
            }
            companies = await CRMContactRequest.list(params);
        }
        return companies;
    }

    /**
     * Метод для получения менеджеров из сделок.
     * В объектах сделок должен присутствовать ключ ASSIGNED_BY_ID.
     * 
     * @async
     * @param {object} params - Дополнительные параметры запроса. Заполнять по правилам UserResponse.get
     * @returns {Promise<Array<object>>}
     */
    async managers(params={}) {
        const preRequests = new Set();
        for ( const deal of this.flatIterator() ) {
            deal.ASSIGNED_BY_ID && preRequests.add(deal.ASSIGNED_BY_ID);
        };
        const ids = Array.from(preRequests);
        let users;
        if ( preRequests.length === 0 ) {
            users = new UserRequest.responseClass();
            users.result = ids;
        } else {
            params['@id'] = ids;
            users = await UserRequest.get(params);
        }
        return users;
    }

    /**
     * Получает продукты из сделок. 
     * В объектах ответа this.result должен присутствовать ключ ID.
     * Вызывает метод callLongBatch
     * 
     * @async
     * @returns {Promise<CRMDealProductrowsResponse>}
     */
    async products() {
        const requests = [];
        for ( const deal of this.flatIterator() ) {
            deal.ID && requests.push({'id': deal.ID});
        };
        const products = new CRMDealProductrowsResponse();
        products.result = await Request.callLongBatch('crm.deal.productrows.get', requests);
        return products;
    }
}




/**
 * Запросы для crm.deal.productrows
 */
class CRMDealProductrowsResponse extends Response {

    /**
     * Обновляет продукты, наделяет их метаинформацией по группам продуктов
     * Чтобы метод отработал корректно, нужен результат предыдущего запроса. 
     * В result должен лежать объект или массив с продуктами.
     * 
     * @async
     */
    async updateProductsGroupsInfo() {
        const variationByProduct = {};
        const variationsRequests = [];
        for (const product of this.flatIterator() ) {
            if ( !variationByProduct[product.PRODUCT_ID] ) {
                variationByProduct[product.PRODUCT_ID] = null;
                variationsRequests.push({'id': product.PRODUCT_ID});
            };
        };
        const variations = await Request.callLongBatch('catalog.product.get', variationsRequests);
        // разбираем вариации
        const metaByProduct  = {};
        const metaRequests = [];
        const metaComp = [];
        variations.forEach((variation, index) => {
            const productID = variationsRequests[index].id;
            const type = variation.product.type;
            metaByProduct[productID] = null;
            if ( type == 1 || type == 4 || type == 7 ) {
                variationByProduct[productID] = variation.product;
            };
            if ( type == 1 || type == 7 ) {
                metaByProduct[productID] = variation.product;
            };
            if ( type == 4 ) {
                metaRequests.push({'id': variation.product.parentId.value});
                metaComp.push(productID);
            };
        });
        const meta = await Request.callLongBatch('catalog.product.get', metaRequests);
        meta.forEach((product, index) => {
            metaByProduct[metaComp[index]] = product.product;
        });
        for ( const product of this.flatIterator() ) {
            product._variation = variationByProduct[product.PRODUCT_ID];
            product._meta = metaByProduct[product.PRODUCT_ID];
        }
    }

    /**
     * Обновляет атрибут _meta у товара, наделяет его массивом всех возможных вариаций для этого продукта.
     * Вызвать этот метод можно только после updateProductsGroupsInfo.
     * 
     * @async
     * @param {string} select - Поля, которые нужно вернуть для вариаций.
     */
    async updateProductMetaWithAllVariatons(...select) {
        select.push('id', 'iblockId');
        const requests = [];
        for ( const product of this.flatIterator() ) {
            const request = {
                filter: {'parentId': product._meta.id, iblockId: 26},
                select: select,
            };
            requests.push(request);
        };
        const variations = await Request.callLongBatch('catalog.product.list', requests);
        this.flatIterator().forEach((product, index) => {
            product._meta._variations = variations[index].products;
        });
    }
}


// ------------------------------------------------------------------------------------ Запросики ----------------------------------------------------------------------------------------------
/**
 * Базовый класс для всех запросов
 */
class Request {
    static responseClass = Response;

    /**
     * Формирует батч запрос и шлет его на endpoint и возвращает ответ.
     * 
     * @async
     * @param {string} endpoint - Эндпоинт запроса
     * @param {Array<object>} requests - Массив запросов.
     * @returns {Promise<Array<Array<object>>>} Результат запроса.
     */
    static async callLongBatch(endpoint, requests) {
        if ( requests.length === 0 ) {
            return [];
        }
        const calls = BX24Wrapper.createCalls(endpoint, requests);
        return await BX24W.callLongBatch(calls, false);
    }

    static async callMethod(cls, endpoint, params) {
        const obj = new cls();
        obj.result = await BX24W.callMethod(endpoint, params);
        return obj;
    }

    static async callListMethod(cls, endpoint, params) {
        const obj = new cls();
        obj.result = await BX24W.callListMethod(endpoint, params);
        return obj
    }
}



/**
 * Запросы для catalog.product
 */
class CatalogProductRequest extends Request {

    /**
     * Получает список товаров по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/catalog/product/catalog-product-list.html
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     * @returns {Promise<Array<object>>}
     */
    static async list(params={}) {
        return await Request.callListMethod(CatalogProductRequest.responseClass, 'catalog.product.list', params);
    }
}




class CatalogProductPropertyEnumRequst extends Request {

    /**
     * Получить список значений списочных свойств продуктов
     * @see https://apidocs.bitrix24.ru/api-reference/catalog/product-property-enum/catalog-product-property-enum-list.html
     * Из-за особенностей метода, вернется массив, который будет содрежать объекты
     * productPropertyEnums - значение которого в свою очередь тоже является массивом)
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     */
    static async list(params={}) {
        return await Request.callListMethod(CatalogProductPropertyEnumRequst.responseClass, 'catalog.productPropertyEnum.list', params);
    }

    /**
     * Получает группы продуктов
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     */
    static async productGroups(params={}) {
        !params.order && (params.order = {});
        !params.order.value && (params.order.value = 'ASC');
        !params.select && (params.select = []);
        !params.select.push('id', 'value');
        !params.filter && (params.filter = {});
        !params.filter.propertyId && (params.filter.propertyId = 175);
        return await CatalogProductPropertyEnumRequst.list(params);
    }
}




/**
 * Запросы для crm.category
 */
class CRMCategoryRequest extends Request {

    /**
     * Получает список crm сущностей.
     * Список будет под ключом "categories"
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     * @param {number} entityTypeId - ИД црм сущности
     * @returns {Promise<CRMCategoryResponse<object>>}
     */
    static async list(entityTypeId=2) {
        return await Request.callMethod(CRMCategoryRequest.responseClass, 'crm.category.list', {entityTypeId: entityTypeId});
    }

    /**
     * Получает список воронок
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     * @returns {Promise<object>}
     */
    static async funnels() {
        return await CRMCategoryRequest.list(2);
    }
}




class CRMCompanyRequest extends Request {

    /**
     * Получает список команий по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/companies/crm-company-list.html
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     * @returns {Promise<CatalogProductResponse<Array<object>>>}
     */
    static async list(params={}) {
        return await Request.callListMethod(CRMCompanyRequest.responseClass, 'crm.company.list', params);
    }
}


class CRMContactRequest extends Request {
    /**
     * Получает список контактов по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/companies/crm-company-list.html
     *
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     * @returns {Promise<CatalogProductResponse<Array<object>>>}
     */
    static async list(params={}) {
        return await Request.callListMethod(CRMContactRequest.responseClass, 'crm.contact.list', params);
    }
}
