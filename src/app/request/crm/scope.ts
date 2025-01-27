import { DealScope } from "./deal/scope";
import { StatusScope } from "./status/scope";

/**
 * Доступ к дочерним скоупам crm
 */
export namespace CRMScope {
    export const category: any = null;
    export const company: any = null;
    export const contact: any = null;
    export const deal = DealScope;
    export const status = StatusScope;
}