/**
 * Готовый набор функций и классов, где записаны самые распространенные запросы к битриксу и их обработка.
 * Подключать скрипт к странице нужно после подключения bx24-wrapper - обертки над запросами.
 * 
 * По планам - класс будет представлять из себя реализацию запросов к скоупу или группе скоупов.
 * Каждый класс будет содержать "сырые" методы, реализующие прямые запросы. Такие методы будут названы также как и в АПИ битрикса. 
 * Помимо этого, будут шорткаты, которые будут формировать соответствующие фильтры для сырых методов.
 * Каждый вызов сырого метода сохраняет результат вызова в атрибуте result 
 *
 * @author    dfx-17
 * @link
 *
 * @version 0.0.2
 *
 * v0.0.2 (04.12.2024) Изменена логика функций, которые организуют связи.
 * v0.0.1 (26.11.2024) Начато написание 
 */

const BX24W = new BX24Wrapper();




/**
 * Итератор по result. 
 * Если result объект, то вернет его.
 * Если result массив, то вернет его значения.
 * Если result вложенный массив, как получается при результате батч запросов, то будет возвращать каждый его елемент.
 */
function *flatIterator(obj) {
    if ( Array.isArray(obj) ) {
        for ( const value of obj ) {
            const iterator = flatIterator(value);
            for ( const itValues of iterator ) {
                yield itValues;
            };
        };
        return;
    };
    yield obj;
}


/**
 * Реализует асинхронную статичную функцию для класса.
 * @param {*} cls - ссылка на класс
 * @param {*} func - название функции
 * @returns 
 */
function getStaticFunction(cls, func) {
    return async function (...args) {
        const obj = new cls();
        await obj[func](...args);
        return obj;
    }
}




/**
 * Базовый класс для всех запросов
 */
class BaseRequests {

    /**
     * Конструктор.
     * Инициализирует атрибуты, которые должен иметь каждый объект
     */
    constructor() {
        this.result = null;     // Результат последнего запроса к этому скоупу.
    }

    /**
     * Возвращает представление result в виде объекта, где ключи - ID (или id) объекта, а значения - сам объект.
     * Внимание! Повторяющиеся сущности, у которых один id будут объеденены.
     * @returns {object}
     */
    byID() {
        const obj = {};
        flatIterator(this.result).forEach((item, index) => {
            const id = item.ID || item.id || index;
            obj[id] = item;
        });
        return obj;
    }

    /**
     * Общая реализация списочного метода для API-запросов.
     * По факту, вызывает callListMethod объекта BX24Wrapper для переданного endpoint.
     * @async
     * 
     * @param {string} endpoint - Эндпоинт апи, к которому будет произведен запрос
     * @param {object} params - Параметры запроса.
     * 
     * @returns {Array<object>}
     */
    async _callListMethod(endpoint, params) {
        return this.result = await BX24W.callListMethod(endpoint, params);
    }

    /**
     * Формирует батч запрос и шлет его на endpoint и возвращает ответ.
     * @async
     * 
     * @param {string} endpoint - Эндпоинт запроса
     * @param {Array<object>} requests - Массив запросов.
     * 
     * @returns {Promise<Array<Array<object>>>} Результат запроса.
     */
    async _callLongBatch(endpoint, requests) {
        if ( requests.length === 0 ) {
            return [];
        };
        const calls = BX24Wrapper.createCalls(endpoint, requests);
        return await BX24W.callLongBatch(calls, false);
    };

    /**
     * Общая реализация единичного запроса для API.
     * По факту, вызывает callMethod объекта BX24Wrapper для переданного endpoint.
     * @async
     * 
     * @param {string} endpoint - Эндпоинт апи, к которому будет произведен запрос
     * @param {object} params - Параметры запроса.
     * 
     * @returns {Array<object>}
     */
    async _callMethod(endpoint, params) {
        return this.result = await BX24W.callMethod(endpoint, params);
    }
}




/**
 * Запросы для catalog.product
 */
class CatalogProductRequests extends BaseRequests {
    // Статичные методы текущего скоупа
    static list = getStaticFunction(CatalogProductRequests, 'list');

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
    async list({select, filter, order}) {
        const params = {};
        select != undefined && (params.select = select);
        filter != undefined && (params.filter = filter);
        order != undefined && (params.order = order);
        return this._callListMethod('catalog.product.list', params);
    }
}


/**
 * Запросы для crm.category
 */
class CRMCategoryRequests extends BaseRequests {
    // Статичные методы текущего скоупа
    static list = getStaticFunction(CRMCategoryRequests, 'list');

    /**
     * Получает список воронок
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     * @returns {Promise<object>}
     */
    async funnels() {
        await this.list(2);     // Сущности воронок
        return this.result = this.result.categories;
    }

    /**
     * Получает список crm сущностей.
     * Список будет под ключом "categories"
     * @see https://apidocs.bitrix24.ru/api-reference/crm/universal/category/crm-category-list.html
     * 
     * @async
     * @param {number} entityTypeId - ИД црм сущности
     * @returns {Promise<object>}
     */
    async list(entityTypeId=2) {
        return this._callMethod('crm.category.list', {entityTypeId: entityTypeId});
    }
}




class CRMCompanyRequests extends BaseRequests {
    // Статичные методы текущего скоупа
    static list = getStaticFunction(CRMCompanyRequests, 'list');

    /**
     * Получает список команий по фильтру.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/companies/crm-company-list.html
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     * @returns {Promise<Array<object>>}
     */
    async list({select, filter, order}) {
        const params = {};
        select != undefined && (params.select = select);
        filter != undefined && (params.filter = filter);
        order != undefined && (params.order = order);
        return this._callListMethod('crm.company.list', params);
    }
}




/**
 * Запросы для crm.deal.productrows
 */
class CRMDealProductrowsRequests extends BaseRequests {

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
        for (const product of flatIterator(this.result) ) {
            if ( !variationByProduct[product.PRODUCT_ID] ) {
                variationByProduct[product.PRODUCT_ID] = null;
                variationsRequests.push({'id': product.PRODUCT_ID});
            };
        };
        const variations = await this._callLongBatch('catalog.product.get', variationsRequests);
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
        const meta = await this._callLongBatch('catalog.product.get', metaRequests);
        meta.forEach((product, index) => {
            metaByProduct[metaComp[index]] = product.product;
        });
        for ( const product of flatIterator(this.result) ) {
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
        for ( const product of flatIterator(this.result) ) {
            const request = {
                filter: {'parentId': product._meta.id, iblockId: 26},
                select: select,
            };
            requests.push(request);
        };
        const variations = await this._callLongBatch('catalog.product.list', requests);
        flatIterator(this.result).forEach((product, index) => {
            product._meta._variations = variations[index].products;
        });
    }
}




/**
 * Запросы для crm.deal
 */
class CRMDealRequest extends BaseRequests {
    // Ссылки на дочерние скоупы
    static productrows = CRMDealProductrowsRequests;
    // Статичные методы текущего скоупа
    static list = getStaticFunction(CRMDealRequest, 'list');

    /**
     * Метод для получения Компаний из сделок.
     * В объектах ответа this.result должен присутствовать ключ COMPANY_ID.
     * Вызывает метод get у объекта CRMCompanyRequests.
     * 
     * @async
     * @param {object} params - Дополнительные параметры для запроса. Заполнять по правилам CRMCompanyRequests.list
     * @returns {Promise<CRMCompanyRequests>} Объект UserRequests
     */
    async companies(params={}) {
        const preRequests = new Set();
        const companies = new CRMCompanyRequests();
        for ( const deal of flatIterator(this.result) ) {
            deal.COMPANY_ID && preRequests.add(deal.COMPANY_ID);
        };
        const ids = Array.from(preRequests);
        if ( preRequests.length === 0 ) {
            companies.result = ids;
        } else {
            if ( 'filter' in params ) {
                params.filter['@ID'] = ids;
            } else {
                params.filter = {"@ID": ids};
            }
            await companies.list(params);
        }
        return companies;
    }

    /**
     * Получает список сделок по фильтрам.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/deals/crm-deal-list.html
     * 
     * @async
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Перечисление полей для фильтрации
     * @param {object} params.order - Перечисление полей для Сортировки
     * @returns {Promise<Array<object>>}
     */
    async list({select, filter, order}) {
        const params = {};
        select != undefined && (params.select = select);
        filter != undefined && (params.filter = filter);
        order != undefined && (params.order = order);
        return this._callListMethod('crm.deal.list', params)
    }

    /**
     * Метод для получения менеджеров из сделок.
     * В объектах ответа this.result должен присутствовать ключ ASSIGNED_BY_ID.
     * Вызывает метод get у объекта UserRequests.
     * 
     * @async
     * @param {object} params - Дополнительные параметры запроса. Заполнять по правилам UserRequests.get
     * @returns {Promise<UserRequests>} Объект UserRequests
     */
    async managers(params={}) {
        const preRequests = new Set();
        const users = new UserRequests();
        for ( const deal of flatIterator(this.result) ) {
            deal.ASSIGNED_BY_ID && preRequests.add(deal.ASSIGNED_BY_ID);
        };
        const ids = Array.from(preRequests);
        if ( preRequests.length === 0 ) {
            users.result = ids;
        } else {
            params['@id'] = ids;
            await users.get(params);
        }
        return users;
    }

    /**
     * Получает продукты из сделок. 
     * В объектах ответа this.result должен присутствовать ключ ID.
     * Вызывает метод callLongBatch у объекта CRMDealProductrowsRequests
     * 
     * @async
     * @returns {Promise<CRMDealProductrowsRequests>}
     */
    async products() {
        const requests = [];
        for ( const deal of flatIterator(this.result) ) {
            deal.ID && requests.push({'id': deal.ID});
        };
        const products = new CRMDealProductrowsRequests();
        products.result = await products._callLongBatch('crm.deal.productrows.get', requests);
        return products;
    }
}




/**
 * Подкласс для crm.status - запросов к справочникам crm
 */
class CRMStatusRequests extends BaseRequests {

    static list = getStaticFunction(CRMCompanyRequests, 'list');

    /**
     * Получает все возможные статусы (стадии сделок) для указанной воронки
     * 
     * @async
     * @param {number | string} funnelID - ид воронки
     * @param {object} options - Дополнительные параметры выборки. Заполнять по правилам this.get.
     * @returns {Promise<Array<object>>} Массив с результатами ответа. 
     */
    async funnelStages(funnelID, params={}) {
        const entityId = 'DEAL_STAGE' + (funnelID != 0 ? `_${funnelID}` : '');
        if ( 'filter' in params ) {
            params.filter.ENTITY_ID = entityId;
        } else {
            params.filter = {ENTITY_ID: entityId};
        }
        return this.list(params);
    }

    /**
     * Метод возвращает список элементов справочника по фильтру.
     * Фильтры в этом методе работают только в режиме полного совпаденя.
     * @see https://apidocs.bitrix24.ru/api-reference/crm/status/crm-status-list.html
     * 
     * @async
     * @param {object} params - Параметры для запроса. 
     * @param {object} params.filter - Фильтрация, например { "ENTITY_ID": "STATUS" }
     * @param {object} params.order - Сортировка, например { "SORT": "ASC" }
     * @returns {Promise<Array<object>>}
     */
    async list({filter, order}) {
        const params = {};
        filter != undefined && (params.filter = filter);
        order != undefined && (params.order = order);
        return this._callListMethod('crm.status.list', params);
    }
}




/**
 * Класс описывающий различные шорткаты для запросов к скоупу user
 */
class UserRequests extends BaseRequests {

    /**
     * Получает сотрудников указанного отделения.
     * 
     * @async
     * @param {number | string} department - ид подразделения.
     * @param {object} params - Дополнительные параметры выборки. Заполнять по правилам this.get.
     * @returns {Promise<Array<object>>}
     */
    async fromDepartment(department, params={}) {
        params.UF_DEPARTMENT = department;
        return this.get(params);
    }

    /**
     * Получения списка пользователей. Не смотрите на название метода, это скам от битрикса.
     * Выполняет запрос user.get используя callListMethod.
     * Фильтры для запроса нужно формировать по правилам битрикса. Смотри прикрепленную ссылку.
     * По умолчанию, сортируются по возрастанию id пользователя и применяется фильтр, что пользователь активен (не уволен)
     * 
     * Чтобы указать дополнительную фильтрацию, занесите в объект filters ключ - имя поля фильтрации с соответствующим значением.
     * @see https://apidocs.bitrix24.ru/api-reference/user/user-get.html
     * 
     * @async
     * @param {object} params - Объект с параметрами запроса
     * @param {string} params.sort - Ключ сортировки. Если не указан, то сортировка по id.
     * @param {string} params.order - Направление сортировки. По умолчанию: ASC
     * @param {object} params.filter - Дополнительные параметры для фильтрации.
     * @returns {Promise<Array<object>>} Массив с результатами ответа. 
     */
    async get({sort, order, ...filter}) {
        filter.SORT = sort !== undefined ? sort : 'ID';
        filter.ORDER = order !== undefined ? order : 'ASC';
        filter.ACTIVE = filter.ACTIVE === undefined || Boolean(filter.ACTIVE);
        return this._callListMethod('user.get', filter);
    }
}




/**
 * Сборный класс для запросов к дочерним скоупам Catalog
 */
class CatalogCollection {
    static product = CatalogProductRequests;
}




/**
 * Сборный класс для запросов к дочерним скоупам crm
 */
class CRMCollection {
    static category = CRMCategoryRequests;
    static deal = CRMDealRequest;
    static status = CRMStatusRequests;
}




/**
 * Базовый класс для доступа к запросам. Bitrix 24 API Requests
 */
class BAPIR {
    static crm = CRMCollection;
    static user = UserRequests;
}