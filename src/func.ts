export function func() {
    return {
        attr: 1,
        attr1: 0,

        /**
         * Дока над функцией
         * @param arg Принтанет этот элемент
         */
        func: (arg: string) => {console.log(arg)}
    }
}