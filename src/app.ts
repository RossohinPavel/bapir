import { UserScope } from "./app/request/user";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export namespace bapir {
    export const user = UserScope;
}