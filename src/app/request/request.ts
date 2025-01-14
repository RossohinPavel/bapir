import { Response } from "../response/response";


// Проверка на присутствие класса-обертки BX24Wrapper
if ( !("BX24Wrapper" in window) ) {
    throw "Can't find BX24Wrapper! See https://github.com/andrey-tech/bx24-wrapper-js";
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _BX24Wrapper = BX24Wrapper;
const BX24W = new _BX24Wrapper();


/**
 * Замыкание, которое реализует общую логику работы библиотеки.
 * Вызывает переданную func и помещает ее результат в переданный объект responseClass.
 * @param func Метод библиотеки BX24
 * @returns Асинхронную функцию для запроса.
 */
function requestClosure(func: any) {
    async function wrapper(request: Request, params: object): Promise<Response> {
        const result = await func(request.method, params);
        const response = new request.responseClass();
        const className = response.constructor.name;
        request.responseClass._cache[className] = request;
        return Object.assign(response, result);
    }
    return wrapper;
}


/**
 * Асинхронная функция для работы с батчами.
 * @param endpoint Эндпоинт запроса
 * @param requests Массив запросов. Должны быть сформированы по правилам битрикса
 * @returns Результат батч-запроса.
 */
async function callLongBatch(endpoint: string, requests: any[]): Promise<any[]> {
    if ( !requests.length ) {
        return [];
    }
    const calls = _BX24Wrapper.createCalls(endpoint, requests);
    return await BX24W.callLongBatch(calls, false);
}


/**
 * Объект, который содержит в себе основные методы запросов.
 */
export const Call = {
    method: requestClosure(BX24W.callMethod),
    listMethod: requestClosure(BX24W.callListMethod),
    longBatch: callLongBatch, 
}


/**
 * Интерфейс, который должны соблюдать все запросы.
 */
export interface Request {
    // Метод запроса
    method: string;

    // Класс, объект которого будет использован для ответа.
    responseClass: typeof Response;

    // Функция, для получения результата
    call(params: {[key: string]: any}): Promise<Response>;

    // Техническая переменная, которая будет сохранять в себе результата последнего запроса.
    params?: object;

    // В этой переменной могут находиться шорткаты для вызова основного метода
    shortcuts?: {[key: string]: (...args: any[]) => Promise<any>}
}



