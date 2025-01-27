
// class CRMDealResponse extends Response {

//     /**
//      * Метод для получения Компаний из сделок.
//      * В объектах сделок должен присутствовать ключ COMPANY_ID.
//      * 
//      * @async
//      * @param {object} params - Дополнительные параметры для запроса. Заполнять по правилам CRMCompanyRequest.list
//      * @returns {Promise<Array<object>>}
//      */
//     async companies(params={}) {
//         const preRequests = new Set();
//         for ( const deal of this.flatIterator() ) {
//             deal.COMPANY_ID && preRequests.add(deal.COMPANY_ID);
//         }
//         const ids = Array.from(preRequests);
//         let companies;
//         if ( preRequests.length === 0 ) {
//             companies = new CRMCompanyRequest.responseClass();
//             companies.result = ids;
//         } else {
//             if ( 'filter' in params ) {
//                 params.filter['@ID'] = ids;
//             } else {
//                 params.filter = {"@ID": ids};
//             }
//             companies = await CRMCompanyRequest.list(params);
//         }
//         return companies;
//     }

//     /**
//      * Метод для получения Контактов из сделок.
//      * В объектах сделок должен присутствовать ключ COMPANY_ID.
//      *
//      * @async
//      * @param {object} params - Дополнительные параметры для запроса. Заполнять по правилам CRMCompanyRequest.list
//      * @returns {Promise<Array<object>>}
//      */
//     async contacts(params={}) {
//         const preRequests = new Set();
//         for ( const deal of this.flatIterator() ) {
//             deal.CONTACT_ID && preRequests.add(deal.CONTACT_ID);
//         }
//         const ids = Array.from(preRequests);
//         let companies;
//         if ( preRequests.length === 0 ) {
//             companies = new CRMContactRequest.responseClass();
//             companies.result = ids;
//         } else {
//             if ( 'filter' in params ) {
//                 params.filter['@ID'] = ids;
//             } else {
//                 params.filter = {"@ID": ids};
//             }
//             companies = await CRMContactRequest.list(params);
//         }
//         return companies;
//     }

//     /**
//      * Метод для получения менеджеров из сделок.
//      * В объектах сделок должен присутствовать ключ ASSIGNED_BY_ID.
//      * 
//      * @async
//      * @param {object} params - Дополнительные параметры запроса. Заполнять по правилам UserResponse.get
//      * @returns {Promise<Array<object>>}
//      */
//     async managers(params={}) {
//         const preRequests = new Set();
//         for ( const deal of this.flatIterator() ) {
//             deal.ASSIGNED_BY_ID && preRequests.add(deal.ASSIGNED_BY_ID);
//         };
//         const ids = Array.from(preRequests);
//         let users;
//         if ( preRequests.length === 0 ) {
//             users = new UserRequest.responseClass();
//             users.result = ids;
//         } else {
//             params['@id'] = ids;
//             users = await UserRequest.get(params);
//         }
//         return users;
//     }

//     /**
//      * Получает продукты из сделок. 
//      * В объектах ответа this.result должен присутствовать ключ ID.
//      * Вызывает метод callLongBatch
//      * 
//      * @async
//      * @returns {Promise<CRMDealProductrowsResponse>}
//      */
//     async products() {
//         const requests = [];
//         for ( const deal of this.flatIterator() ) {
//             deal.ID && requests.push({'id': deal.ID});
//         };
//         const products = new CRMDealProductrowsResponse();
//         products.result = await Request.callLongBatch('crm.deal.productrows.get', requests);
//         return products;
//     }
// }