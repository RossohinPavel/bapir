/**
 * Получения списка пользователей. Не смотрите на название метода, это скам от битрикса.
 * Выполняет запрос используя списочный метод callListMethod.
 * Фильтры для запроса нужно формировать по правилам битрикса. Смотри прикрепленную ссылку.
 * По умолчанию применяется фильтр, что пользователь активен (не уволен).
 * @see https://apidocs.bitrix24.ru/api-reference/user/user-get.html
 * 
 * @async
 * @param params Объект с параметрами запроса. Можно указывать ключи в lower_case.
 * @param params.sort Ключ сортировки.
 * @param params.order Направление сортировки.
 * @returns Массив с результатами ответа. 
 */
async function get(params={}) {
    console.log('user get');
};

export default get;