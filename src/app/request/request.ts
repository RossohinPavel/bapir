// Проверка на присутствие класса-обертки BX24Wrapper
if ( !("BX24Wrapper" in window) && (typeof BX24Wrapper === 'undefined') ) {
    throw "Can't find BX24Wrapper! See https://github.com/andrey-tech/bx24-wrapper-js";
};

declare global {
    interface Window {
        BX24W: BX24Wrapper
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.BX24W = new BX24Wrapper();
});


type ParamsType = {[key: string]: any};
type BX24WResponse = ParamsType;


/**
 * Основные методы запросов.
 */
export namespace Call {

    /**
     * Вызов BX24W.callMethod.
     */
    export async function method<T extends BX24WResponse>(
        endpoint: string, 
        params: ParamsType = {}, 
        handler: object = null
    ): Promise<T | ProxyHandler<T>> {
        let result = await window.BX24W.callMethod(endpoint, params);
        return handler === null ? result : new Proxy(result, handler);
    }

    /**
     * Вызов BX24W.callListMethod.
     */
    export async function listMethod<T extends BX24WResponse[]>(
        endpoint: string, 
        params: ParamsType = {}, 
        handler: object = null
    ): Promise<T | ProxyHandler<T>> {
        let result = await window.BX24W.callListMethod(endpoint, params) as BX24WResponse;
        return handler === null ? result : new Proxy(result, handler);
    }

    /**
     * Асинхронная функция для работы с батчами.
     * @param endpoint Эндпоинт запроса
     * @param requests Массив запросов. Должны быть сформированы по правилам битрикса
     * @returns Результат батч-запроса.
     */
    export async function longBatch(
        endpoint: string, 
        requests: any[], 
        handler: object = null
    ): Promise<any[] | ProxyHandler<any[]>> {
        if ( !requests.length ) {
            return [];
        }
        const calls = BX24Wrapper.createCalls(endpoint, requests);
        const result = await window.BX24W.callLongBatch(calls, false);
        return handler === null ? result : new Proxy(result, handler);
    }
}
