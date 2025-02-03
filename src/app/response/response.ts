type Data = {[key: string]: string | number | boolean}

/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде объекта.
 */
export class Response {
    [key: string]: any;

    constructor(data: Data) {
        for ( const [key, value] of Object.entries(data) ) {
            this[key] = value;
        }
    }
}


/**
 * Абстрактный класс для наследования классов ответов, которые приходят в виде списка.
 */
export class ResponseArray extends Array<Response | Data> {

    /**
     * Можно обозначить класс для итема массива.
     */
    static item: typeof Response | null = null;

    /**
     * Конструктор. Оборачивает данные в объект, с которым удобнее взаимодействовать.
     * @param data Сырые данные, полученные от сервера. 
     */
    constructor(data: Data[]) {
        super();
        const itemClass = (this.constructor as typeof ResponseArray).item;
        if ( itemClass !== null && itemClass.prototype instanceof Response ) {
            for ( const _item of data ) {
                this.push(new itemClass(_item));
            }
        } else {
            this.push(...data);
        }
    }

    /**
     * Возвращает представление массива в виде объекта, где ключи - ID (или id) объекта, а значения - сам объект.
     * Внимание! Повторяющиеся сущности, у которых один идентивфикатор будут объеденены.
     */
    byID() {
        const obj: {[key: string]: Response | Data} = {};
        this.forEach((item, index) => {
            obj[item.ID || item.id || index] = item;
        });
        return obj;
    }
}
