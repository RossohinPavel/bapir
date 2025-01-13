import { crm } from "./requests/crm/scope";
import { UserRequests } from "./requests/user";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export const BAPIR = {
    crm,
    user: UserRequests.method,
}
