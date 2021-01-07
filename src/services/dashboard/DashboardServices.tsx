import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/";

const totalByUser = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-by-user',
        {},
        'GET'
    );
    return result
};
const totalByMonth = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-request-by-month',
        {},
        'GET'
    );
    return result
};
const totalByObject = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-request-by-object',
        {},
        'GET'
    );
    return result
};
const totalReqTokenCTS = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-request-tokenCTS',
        {},
        'GET'
    );
    return result
};
const totalDigitalByYear = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-req-digital-by-year',
        {},
        'GET'
    );
    return result
};
const topOwner = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'top-owner',
        {},
        'GET'
    );
    return result
};
const totalDataForSale = async () =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'total-data-for-sale',
        {},
        'GET'
    );
    return result
};

export const DashboardService = {
    totalByUser,
    totalByMonth,
    totalByObject,
    totalReqTokenCTS,
    totalDigitalByYear,
    topOwner,
    totalDataForSale
};
