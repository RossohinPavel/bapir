import { Response, ResponseArray, ResponseBatch } from "../response/response";


// Проверка на присутствие класса-обертки BX24Wrapper
if ( !("BX24Wrapper" in window) && (typeof BX24Wrapper === 'undefined') ) {
    throw "Can't find BX24Wrapper! See https://github.com/andrey-tech/bx24-wrapper-js";
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _BX24Wrapper = BX24Wrapper;
const BX24W = new _BX24Wrapper();


type ParamsType = {[key: string]: any};

type ResponseClass = typeof Response | typeof ResponseArray | typeof ResponseBatch | null;


/**
 * Замыкание, которое реализует общую логику работы библиотеки.
 * Вызывает переданную func и помещает ее результат в переданный объект responseClass.
 * @param func Метод библиотеки BX24
 * @returns Асинхронную функцию для запроса.
 */
function requestClosure(func: any) {
    async function wrapper(endpoint: string, params: ParamsType = {}, responseClass: ResponseClass = null): Promise<Response | ResponseArray> {
        let result = await func(endpoint, params);
        if ( responseClass !== null ) {
            return new responseClass(result);
        }
        return result;
    }
    return wrapper;
}


/**
 * Основные методы запросов.
 */
export namespace Call {

    /**
     * Вызов BX24W.callMethod.
     */
    export const method = requestClosure(BX24W.callMethod);

    /**
     * Вызов BX24W.callListMethod.
     */
    export const listMethod = requestClosure(BX24W.callListMethod);

    /**
     * Асинхронная функция для работы с батчами.
     * @param endpoint Эндпоинт запроса
     * @param requests Массив запросов. Должны быть сформированы по правилам битрикса
     * @returns Результат батч-запроса.
     */
    export async function longBatch(endpoint: string, requests: any[], responseClass: ResponseClass = null): Promise<any[] | ResponseBatch> {
        if ( !requests.length ) {
            return [];
        }
        const calls = _BX24Wrapper.createCalls(endpoint, requests);
        const response = await BX24W.callLongBatch(calls, false);
        if ( responseClass !== null ) {
            return new responseClass(response) as ResponseBatch;
        }
        return response;
    }
}
