/**
 * Готовый набор функций и классов, где записаны самые распространенные запросы к битриксу и их обработка.
 * Подключать скрипт к странице нужно после подключения bx24-wrapper - обертки над запросами.
 * 
 * По планам - класс будет представлять из себя реализацию запросов к скоупу или группе скоупов.
 * Каждый класс будет содержать "сырые" методы, реализующие прямые запросы. Такие методы будут названы также как и в АПИ битрикса. 
 * Помимо этого, будут шорткаты, которые будут формировать соответствующие фильтры для сырых методов.
 * Каждый вызов сырого метода сохраняет результат вызова в атрибуте lastResult.
 *
 * @author    dfx-17
 * @link
 *
 * @version 0.0.2
 *
 * v0.0.2 (26.11.2024) Начато написание 
 */

const BX24W = new BX24Wrapper();


/**
 * Итератор по lastResult. 
 * Если lastResult объект, то вернет его.
 * Если lastResult массив, то вернет его значения.
 * Если lastResult вложенный массив, как получается при результате батч запросов, то будет возвращать каждый его елемент.
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
};




/**
 * Базовый класс для всех запросов
 */
class BaseRequests {

    /**
     * Конструктор.
     * Инициализирует атрибуты, которые должен иметь каждый объект
     */
    constructor() {
        this.lastResult = null;     // Результат последнего запроса к этому скоупу.
    }

    /**
     * Проверяет переданное значение на соответствие объекту. 
     * Возвращает объект. Если переданное значение соответствует типу объекта, то возвращает его или создает новый. 
     * @param {*} obj - Объект для проверки
     * 
     * @returns {object} Результат проверки
     */
    _checkObject(obj) {
        return typeof obj === 'object' && !Array.isArray(obj) && obj !== null ? obj : {};
    }

    /**
     * Формирует батч запрос и шлет его на endpoint и возвращает ответ.
     * @async
     * @param {string} endpoint - Эндпоинт запроса
     * @param {Array<object>} requests - Массив запросов.
     * 
     * @returns {Array<Array>} Результат запроса.
     */
    async _callLongBatch(endpoint, requests) {
        if ( requests.length === 0 ) {
            return [];
        };
        const calls = BX24Wrapper.createCalls(endpoint, requests);
        return await BX24W.callLongBatch(calls, false);
    };

    /**
     * Общая реализация списочного метода для API-запросов.
     * @param {string} endpoint - Эндпоинт апи, к которому будет произведен запрос
     * @param {Array<string>} select - Поля, которые должны присутствовать в ответе для элемента
     * @param {object} filter - Поля по которым будет производиться фильтрация
     * @param {object} order - Поля, по которым будет произведена сортировка
     */
    async list(endpoint, select, filter, order) {
        const params = {};
        select && (params.select = select);
        order && (params.order = order);
        filter && (params.filter = filter);
        return this.lastResult = await BX24W.callListMethod(endpoint, params);
    }
}




/**
 * Запросы для catalog.product
 */
class CatalogProductRequests extends BaseRequests {

    /**
     * Получает список товаров по фильтру.
     * 
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Объект полей для фильтрации
     * @param {object} params.order - Объект полей для Сортировки
     * 
     * @see https://apidocs.bitrix24.ru/api-reference/crm/deals/crm-deal-list.html
     * 
     * @returns {Promise<Array>} Массив с результатами ответа. 
     */
    async list({select, filter, order}) {
        return super.list('catalog.product.list', select, filter, order);
    }
}




/**
 * Запросы для crm.deal.productrows
 */
class CRMDealProductrowsRequests extends BaseRequests {

    /**
     * Получает продукты из сделок. Вызывает метод callLongBatch
     * 
     * @param {Array<object>} deals - Массив с объектами сделок. В объекте сделки обязательно должен присутствовать ключ ID.
     * 
     * @returns {Promise<Array<Array>>} Массив с результатами ответа.
     */
    async fromDeals(deals) {
        const requests = [];
        for ( const deal of deals ) {
            requests.push({'id': deal.ID});
        };
        return this.lastResult = await this._callLongBatch('crm.deal.productrows.get', requests);
    }

    /**
     * Обновляет продукты, наделяет их метаинформацией по группам продуктов
     * Чтобы метод отработал корректно, нужен результат предыдущего запроса. 
     * В lastResult должен лежать объект или массив с продуктами.
     */
    async updateProductsGroupsInfo() {
        const variationByProduct = {};
        const variationsRequests = [];
        for (const product of flatIterator(this.lastResult) ) {
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
        for ( const product of flatIterator(this.lastResult) ) {
            product._variation = variationByProduct[product.PRODUCT_ID];
            product._meta = metaByProduct[product.PRODUCT_ID];
        }
    }

    /**
     * Обновляет атрибут _meta у товара, наделяет его массивом всех возможных вариаций для этого продукта.
     * Вызвать этот метод можно только после updateProductsGroupsInfo.
     * 
     * @param {string} select - Поля, которые нужно вернуть для вариаций.
     */
    async updateProductMetaWithAllVariatons(...select) {
        select.push('id', 'iblockId');
        const requests = [];
        for ( const product of flatIterator(this.lastResult) ) {
            const request = {
                filter: {'parentId': product._meta.id, iblockId: 26},
                select: select,
            };
            requests.push(request);
        };
        const variations = await this._callLongBatch('catalog.product.list', requests);
        flatIterator(this.lastResult).forEach((product, index) => {
            product._meta._variations = variations[index].products;
        });
    }
}




/**
 * Запросы для crm.deal
 */
class CRMDealRequest extends BaseRequests {

    static productrows = CRMDealProductrowsRequests;

    /**
     * Получает список сделок по фильтрам.
     * 
     * @param {object} params - Параметры запроса
     * @param {Array<string>} params.select - Список полей, которые должны присутствовать в ответе от сервера.
     * @param {object} params.filter - Перечисление полей для фильтрации
     * @param {object} params.order - Перечисление полей для Сортировки
     * 
     * @see https://apidocs.bitrix24.ru/api-reference/crm/deals/crm-deal-list.html
     * 
     * @returns {Promise<Array>} Массив с результатами ответа. 
     */
    async list({select, filter, order}) {
        return super.list('crm.deal.list', select, filter, order)
    }
}




/**
 * Подкласс для crm.status - запросов к справочникам crm
 */
class CRMStatusRequests extends BaseRequests {

    /**
     * Получает все возможные статусы (стадии сделок) для указанной воронки
     * 
     * @param {number | string} funnelID - ид воронки
     * @param {object} options - Дополнительные параметры выборки. Заполнять по правилам this.get.
     * 
     * @returns {Promise<Array>} Массив с результатами ответа. 
     */
    async getFunnelStages(funnelID, options) {
        const params = this._checkObject(options);
        params.ENTITY_ID = 'DEAL_STAGE' + (funnelID != 0 ? `_${funnelID}` : '');
        return await this.list({filter: params});
    }

    /**
     * Метод возвращает список элементов справочника по фильтру.
     * Фильтры в этом методе работают только в режиме полного совпаденя. Использование префиксов ни к чему не приведет.
     * @param {object} params - Параметры для запроса. 
     * @param {object} params.filter - Фильтрация, например { "ENTITY_ID": "STATUS" }
     * @param {object} params.order - Сортировка, например { "SORT": "ASC" }
     * 
     * @see https://apidocs.bitrix24.ru/api-reference/crm/status/crm-status-list.html
     * 
     * @returns {Promise<Array>} Массив с результатами ответа. 
     */
    async list({filter, order}) {
        return super.list('crm.status.list', null, filter, order);
    }
}




/**
 * Класс описывающий различные шорткаты для запросов к скоупу user
 */
class UserRequests extends BaseRequests {

    /**
     * Получает сотрудников указанного отделения.
     * 
     * @param {number | string} department - ид подразделения.
     * @param {object} options - Дополнительные параметры выборки. Заполнять по правилам this.get.
     * 
     * @returns {Promise<Array>} - Массив с результатами вызова get. 
     */
    async fromDepartment(department, options) {
        options = this._checkObject(options);
        options.UF_DEPARTMENT = department;
        return await this.get(options);
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
     * @param {object} params - Объект с параметрами запроса
     * @param {string} params.sort - Ключ сортировки. Если не указан, то сортировка по id.
     * @param {string} params.order - Направление сортировки. По умолчанию: ASC
     * @param {object} params.filters - Дополнительные параметры для фильтрации.
     * 
     * @returns {Promise<Array>} Массив с результатами ответа. 
     */
    async get({sort, order, ...filter}) {
        filter.SORT = sort !== undefined ? sort : 'ID';
        filter.ORDER = order !== undefined ? order : 'ASC';
        filter.ACTIVE = filter.ACTIVE === undefined || Boolean(filter.ACTIVE);
        return this.lastResult = await BX24W.callListMethod('user.get', filter);
    }
}




/**
 * Сборный класс для запросов к дочерним скоупам crm
 */
class CatalogCollection {
    static product = CatalogProductRequests;
}




/**
 * Сборный класс для запросов к дочерним скоупам crm
 */
class CRMCollection {
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
