/**
 * Абстрактный класс, который реализует общие методы для ответов.
 */
export class Response {
    static _cache: {[key: string]: any} = {};

    /**
     * Возвращает объект метода, который был использован для запроса.
     */
    get method(): object {
        return Response._cache[this.constructor.name];
    }
}


/**
 * Абстрактный класс миксин для ответов, которые приходят в соответствующем виде.
 */
export class ResponseArray extends Response {}


/**
 * Для его корректного существования в тупескрипт нужен интерфейс.
 */
export interface ResponseArray extends Array<any> {}


/**
 * Функция для реализации миксинов
 * @param derivedCtor Класс - приемник поведения
 * @param baseCtors Подмешиваемые классы.
 */
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
applyMixins(ResponseArray, [Array]);
