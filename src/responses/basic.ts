interface CacheInterface {
    [key: string]: any;
}

/**
 * Абстрактный объект, который реализует общие методы для ответов.
 */
export class BasicRespose {
    static _cache: CacheInterface = {};

    /**
     * Метод для получения информации о последнем запросе для 
     */
    request() {}
}