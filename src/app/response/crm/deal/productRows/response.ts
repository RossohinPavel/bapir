// /**
//  * Запросы для crm.deal.productrows
//  */
// class CRMDealProductrowsResponse extends Response {

//     /**
//      * Обновляет продукты, наделяет их метаинформацией по группам продуктов
//      * Чтобы метод отработал корректно, нужен результат предыдущего запроса. 
//      * В result должен лежать объект или массив с продуктами.
//      * 
//      * @async
//      */
//     async updateProductsGroupsInfo() {
//         const variationByProduct = {};
//         const variationsRequests = [];
//         for (const product of this.flatIterator() ) {
//             if ( !variationByProduct[product.PRODUCT_ID] ) {
//                 variationByProduct[product.PRODUCT_ID] = null;
//                 variationsRequests.push({'id': product.PRODUCT_ID});
//             };
//         };
//         const variations = await Request.callLongBatch('catalog.product.get', variationsRequests);
//         // разбираем вариации
//         const metaByProduct  = {};
//         const metaRequests = [];
//         const metaComp = [];
//         variations.forEach((variation, index) => {
//             const productID = variationsRequests[index].id;
//             const type = variation.product.type;
//             metaByProduct[productID] = null;
//             if ( type == 1 || type == 4 || type == 7 ) {
//                 variationByProduct[productID] = variation.product;
//             };
//             if ( type == 1 || type == 7 ) {
//                 metaByProduct[productID] = variation.product;
//             };
//             if ( type == 4 ) {
//                 metaRequests.push({'id': variation.product.parentId.value});
//                 metaComp.push(productID);
//             };
//         });
//         const meta = await Request.callLongBatch('catalog.product.get', metaRequests);
//         meta.forEach((product, index) => {
//             metaByProduct[metaComp[index]] = product.product;
//         });
//         for ( const product of this.flatIterator() ) {
//             product._variation = variationByProduct[product.PRODUCT_ID];
//             product._meta = metaByProduct[product.PRODUCT_ID];
//         }
//     }

//     /**
//      * Обновляет атрибут _meta у товара, наделяет его массивом всех возможных вариаций для этого продукта.
//      * Вызвать этот метод можно только после updateProductsGroupsInfo.
//      * 
//      * @async
//      * @param {string} select - Поля, которые нужно вернуть для вариаций.
//      */
//     async updateProductMetaWithAllVariatons(...select) {
//         select.push('id', 'iblockId');
//         const requests = [];
//         for ( const product of this.flatIterator() ) {
//             const request = {
//                 filter: {'parentId': product._meta.id, iblockId: 26},
//                 select: select,
//             };
//             requests.push(request);
//         };
//         const variations = await Request.callLongBatch('catalog.product.list', requests);
//         this.flatIterator().forEach((product, index) => {
//             product._meta._variations = variations[index].products;
//         });
//     }
// }