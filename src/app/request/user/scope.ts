import { UserGetRequest } from "./get"

/**
 * Скоуп для запросов к user
 */
export const UserScope = {
    get: UserGetRequest.call,
    fromDepartment: UserGetRequest.shortcuts.fromDepartment
}