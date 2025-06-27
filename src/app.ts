import { CatalogScope } from "./request/catalog/scope";
import { CRMScope } from "./request/crm/scope";
import { TasksScope } from "./request/tasks/scope";
import { UserScope } from "./request/user/scope";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export namespace bapir {
    export const catalog = CatalogScope;
    export const crm = CRMScope;
    export const tasks = TasksScope;
    export const user = UserScope;
}