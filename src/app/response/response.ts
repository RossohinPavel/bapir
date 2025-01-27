/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде объекта.
 */
export class Response {}

/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде списка.
 */
export class ResponseArray extends Array {}


export type ResponseType = typeof Response | typeof ResponseArray;