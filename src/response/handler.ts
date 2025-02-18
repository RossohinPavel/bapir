type Data = {[key: string]: string | number | boolean};

/**
 * Общий обработчик для ответов, которые приходят в виде объекта.
 * реализует общие методы для Proxy объекта.
 */
export const object = {
    get(target: any, property: string | symbol) {
        if ( property in target ) {
            return target[property];
        }
        if ( property in this ) {
            return this[property];
        }
        return undefined;
    },
    set(target: any, property: string | symbol, value: any) {
        target[property] = value;
        return true;
    },
}


/**
 * Общий обработчик для ответов, которые приходят в виде массива.
 */
export const array = {
    ...object,
    byId() {
        const obj: {[key: string]: Data} = {};
        this.forEach((item: any, index: number) => {
            obj[item.ID || item.id || index] = item;
        });
        return obj;
    },
}


/**
 * Общий обработчик для батч ответов.
 */
export const batch = {
    ...object,
    *flatIterator() {
        for ( const itemGroup of this ) {
            for ( const item of itemGroup ) {
                yield item;
            }
        }
    }
}
