import { CategoryScope } from "./category/scope";
import { CompanyScope } from "./company/scope";
import { ContactScope } from "./contact/scope";
import { DealScope } from "./deal/scope";
import { StatusScope } from "./status/scope";


/**
 * Доступ к дочерним скоупам crm
 */
export namespace CRMScope {
    export const category = CategoryScope;
    export const company = CompanyScope;
    export const contact = ContactScope;
    export const deal = DealScope;
    export const status = StatusScope;
}