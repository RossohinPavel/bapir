import { ProductScope } from "./product/scope";
import { ProductPropertyEnumScope } from "./productPropertyEnums/scope";

/**
 * Доступ к дочерним скоупам Catalog
 */
export namespace CatalogScope {
    export const product = ProductScope;
    export const productPropertyEnum = ProductPropertyEnumScope;
}