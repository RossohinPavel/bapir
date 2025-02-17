import { Response } from "../../../response";


export namespace ProductrowsResponse {
    export const handler = {
        ...Response.handler,
    }

    export const arrayHandler = {
        ...Response.arrayHandler,
    }

    export const batchHandler = {
        ...Response.batchHandler,
    }
}

// import { Call } from "../../../../request/request";
// export class ProductrowsBatch extends ResponseBatch {

//     /**
//      * Обновляет продукты, наделяет их метаинформацией по группам продуктов.
//      * @async
//      */
//     async updateProductsGroupsInfo() {
//         // const variationByProduct: {[key: string]: any} = {};
//         // const variationsRequests: Array<{"id": string}> = [];
//         // for (const product of this._flatIterator() ) {
//         //     if ( !variationByProduct[product.PRODUCT_ID] ) {
//         //         variationByProduct[product.PRODUCT_ID as string] = null;
//         //         variationsRequests.push({'id': product.PRODUCT_ID});
//         //     };
//         // };
//         // const variations = await Call.longBatch('catalog.product.get', variationsRequests);
//         // // разбираем вариации
//         // const metaByProduct: {[key: string]: any} = {};
//         // const metaRequests: Array<{"id": string}> = [];
//         // const metaComp: string[] = [];
//         // variations.forEach((variation, index) => {
//         //     const productID = variationsRequests[index].id;
//         //     const type = variation.product.type;
//         //     metaByProduct[productID] = null;
//         //     if ( type == 1 || type == 4 || type == 7 ) {
//         //         variationByProduct[productID] = variation.product;
//         //     };
//         //     if ( type == 1 || type == 7 ) {
//         //         metaByProduct[productID] = variation.product;
//         //     };
//         //     if ( type == 4 ) {
//         //         metaRequests.push({'id': variation.product.parentId.value});
//         //         metaComp.push(productID);
//         //     };
//         // });
//         // const meta = await Call.longBatch('catalog.product.get', metaRequests);
//         // meta.forEach((product, index) => {
//         //     metaByProduct[metaComp[index]] = product?.product;
//         // });
//         // for ( const product of this._flatIterator() ) {
//         //     product._variation = variationByProduct[product.PRODUCT_ID];
//         //     product._meta = metaByProduct[product.PRODUCT_ID];
//         // }
//     }

//     /**
//      * Обновляет атрибут _meta у товара, наделяет его массивом всех возможных вариаций для этого продукта.
//      * Вызвать этот метод можно только после updateProductsGroupsInfo.
//      * 
//      * @async
//      * @param select - Поля, которые нужно вернуть для вариаций.
//      */
//     async updateProductMetaWithAllVariatons(...select: string[]) {
//         // select.push('id', 'iblockId');
//         // const requests = [];
//         // for ( const product of this._flatIterator() ) {
//         //     requests.push({
//         //         filter: {
//         //             parentId: product._meta.id, 
//         //             iblockId: 26
//         //         },
//         //         select: select,
//         //     });
//         // }
//         // const variations = await Call.longBatch('catalog.product.list', requests);
//         // this._flatIterator().forEach((product, index) => {
//         //     product._meta._variations = variations[index].products;
//         // });
//     }
// }
