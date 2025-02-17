import { Response, ResponseArray, ResponseBatch } from "../response/response";


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

type ResponseClass = typeof Response | typeof ResponseArray | typeof ResponseBatch | null;


/**
 * Основные методы запросов.
 */
export namespace Call {

    /**
     * Вызов BX24W.callMethod.
     */
    export async function method(
        endpoint: string, 
        params: ParamsType = {}, 
        responseClass: ResponseClass = null
    ): Promise<Response | ResponseArray> {
        let result = await window.BX24W.callMethod(endpoint, params);
        if ( responseClass !== null ) {
            return new responseClass(result as any);
        }
        return result;
    }

    /**
     * Вызов BX24W.callListMethod.
     */
    export async function listMethod(
        endpoint: string, 
        params: ParamsType = {}, 
        responseClass: ResponseClass = null
    ): Promise<Response | ResponseArray> {
        let result = await window.BX24W.callListMethod(endpoint, params);
        if ( responseClass !== null ) {
            return new responseClass(result as any);
        }
        return result;
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
        responseClass: typeof ResponseBatch = null
    ): Promise<ResponseBatch | any[]> {
        if ( !requests.length ) {
            return [];
        }
        const calls = BX24Wrapper.createCalls(endpoint, requests);
        const response = await window.BX24W.callLongBatch(calls, false);
        if ( responseClass !== null ) {
            return new responseClass(response) as ResponseBatch;
        }
        return response;
    }
}
