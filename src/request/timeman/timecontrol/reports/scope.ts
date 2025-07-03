import { Call } from "../../../request";
import { ReportsHandler } from "../../../../response/timeman/timecontrol/reports/handler";


type ReportParams = {
    USER_ID: number,
    MONTH: number,
    YEAR: number,
    IDLE_MINUTES?: number,
    WORKDAY_HOURS?: number
}

type ReportBatchParams = Array<ReportParams>


/**
 * Запросы для timeman.timecontrol.reports
 */
export namespace ReportsScope {

    /**
     * Получить отчет о выявленных отсутствиях
     * @see https://apidocs.bitrix24.ru/api-reference/timeman/timecontrol/timeman-timecontrol-reports-get.html
     * 
     * @async
     * @param params Параметры запроса
     * @param params.USER_ID Идентификатор пользователя
     * @param params.MONTH 
     * @param params.YEAR
     * @param params.IDLE_MINUTES
     * @param params.WORKDAY_HOURS
     * @returns
     */
    export async function get(params: ReportParams) {
        return await Call.method('timeman.timecontrol.reports.get', params, ReportsHandler.object);
    }

    export async function getBatch(params: ReportBatchParams) {
        if (!params) {
            return [];
        }
        return await Call.longBatch('timeman.timecontrol.reports.get', params, ReportsHandler.batch)
    }
}