// Проверка на присутствие класса-обертки BX24Wrapper
if ( !("BX24Wrapper" in window) ) {
    throw "Can't find BX24Wrapper! See https://github.com/andrey-tech/bx24-wrapper-js";
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const BX24W = new BX24Wrapper();
