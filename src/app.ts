import { UserScope } from "./app/request/user/scope";


/**
 * Базовый объект для доступа к запросам. Bitrix 24 API Requests.
 */
export namespace bapir {

    /**
     * Доступ к скоупу user
     */
    export const user = UserScope;
}