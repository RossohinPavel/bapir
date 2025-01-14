import { crm } from "./app/request/crm/scope";
import { UserScope } from "./app/request/user/scope";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export const BAPIR = {
    crm,
    user: UserScope
}
