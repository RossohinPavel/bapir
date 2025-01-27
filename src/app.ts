import { CatalogScope } from "./app/request/catalog/scope";
import { CRMScope } from "./app/request/crm/scope";
import { UserScope } from "./app/request/user/scope";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export namespace bapir {
    export const catalog = CatalogScope;
    export const crm = CRMScope;
    export const user = UserScope;
}