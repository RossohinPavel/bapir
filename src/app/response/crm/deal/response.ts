import { Response, ResponseArray } from "../../response";
import { Call } from "../../../request/_request";

import { CompanyScope, ListParams as CompanyParams } from "../../../request/crm/company/scope";
import { ContactScope, ListParams as ContactParams } from "../../../request/crm/contact/scope";
import { UserScope, GetParams as UserParams } from "../../../request/user/scope";

import { ProductrowsBatch } from "./productRows/response";


export class Deal extends Response {}


export class DealsArray extends ResponseArray {
    static item = Deal;

    /**
     * Метод для получения Компаний из сделок.
     * В объектах сделок должен присутствовать ключ COMPANY_ID.
     * @async
     * @param params - Дополнительные параметры для запроса. Заполнять по правилам bapir.crm.company.list
     */
    async companies(params: CompanyParams = {}) {
        const companies = new Set();
        for ( const deal of this ) {
            deal.COMPANY_ID && companies.add(deal.COMPANY_ID);
        }
        const requests = Array.from(companies) as string[];
        if ( requests.length > 0 ) {
            if ( 'filter' in params ) {
                params.filter['@ID'] = requests;
            } else {
                params.filter = {"@ID": requests};
            }
            return await CompanyScope.list(params)
        }
        return requests;
    }

    /**
     * Метод для получения Контактов из сделок.
     * В объектах сделок должен присутствовать ключ CONTACT_ID.
     *
     * @async
     * @param params - Дополнительные параметры для запроса. Заполнять по правилам bapir.crm.contact.list
     * @returns
     */
    async contacts(params: ContactParams = {}) {
        const contacts = new Set();
        for ( const deal of this ) {
            deal.CONTACT_ID && contacts.add(deal.CONTACT_ID);
        }
        const requests = Array.from(contacts) as string[];
        if ( requests.length > 0 ) {
            if ( 'filter' in params ) {
                params.filter['@ID'] = requests;
            } else {
                params.filter = {"@ID": requests};
            }
            return await ContactScope.list(params);
        }
        return requests;
    }

    /**
     * Метод для получения менеджеров из сделок.
     * В объектах сделок должен присутствовать ключ ASSIGNED_BY_ID.
     * @async
     * @param params - Дополнительные параметры запроса. Заполнять по правилам bapir.user.get
     * @returns
     */
    async managers(params: UserParams = {}) {
        const managers = new Set();
        for ( const deal of this ) {
            deal.ASSIGNED_BY_ID && managers.add(deal.ASSIGNED_BY_ID);
        };
        const requests = Array.from(managers) as string[];
        if ( requests.length > 0 ) {
            params['@id'] = requests;
            return await UserScope.get(params);
        }
        return requests;
    }

    /**
     * Получает продукты из сделок. 
     * В объектах ответа this.result должен присутствовать ключ ID.
     * Вызывает метод callLongBatch
     * @async
     */
    async products() {
        const requests = [];
        for ( const deal of this ) {
            deal.ID && requests.push({'id': deal.ID});
        };
        return await Call.longBatch('crm.deal.productrows.get', requests, ProductrowsBatch);
    }
}
