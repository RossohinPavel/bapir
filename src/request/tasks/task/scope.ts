import { Call } from "../../request";
import { TaskHandler } from "../../../response/tasks/task/handler";


type commonParam = string | number | boolean;

type ListParams = {
    select?: string[],
    filter?: {[key: string]: commonParam},
    order?: {[key: string]: string}
};


/**
 * Запросы для tasks.task
 */
export namespace TaskScope {
    
    /**
     * Получает список задач по фильтрам.
     * @see https://apidocs.bitrix24.ru/api-reference/tasks/tasks-task-list.html
     * 
     * @async
     * @param params Параметры запроса
     * @param params.select Список полей, которые должны присутствовать в ответе от сервера.
     * @param params.filter Перечисление полей для фильтрации
     * @param params.order Перечисление полей для Сортировки
     * @returns
     */
    export async function list(params: ListParams = {}) {
        return await Call.listMethod('tasks.task.list', params, TaskHandler.array);
    }
}