/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде объекта.
 */
export class Response {}

/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде списка.
 */
export class ResponseArray extends Array {
    /**
     * Возвращает представление result в виде объекта, где ключи - ID (или id) объекта, а значения - сам объект.
     * Внимание! Повторяющиеся сущности, у которых один id будут объеденены.
     */
    // byID() {
    //     const obj = {};
    //     this.flatIterator().forEach((item, index) => {
    //         const id = item.ID || item.id || index;
    //         obj[id] = item;
    //     });
    //     return obj;
    // }
}


export type ResponseType = typeof Response | typeof ResponseArray;