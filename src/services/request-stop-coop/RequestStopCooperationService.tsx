import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-dung-hop-tac/";

const getListIndexCustomer = async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + "index-customer",
        data,
        "GET"
    );
    return collarborator;
};

const getListIndexStaff = async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + "index-staff",
        data,
        "GET"
    );
    return collarborator;
};

const destroyCustomer = async id => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `destroy-customer/${id}`,
        {},
        "GET"
    );
    return collarborator;
};

const customerConfirmDestroy = async id => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `customer-confirm-destroy/${id}`,
        {},
        "GET"
    );
    return collarborator;
};

const confirmDestroyRequest = async id => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `confirm-destroy-request/${id}`,
        {},
        "GET"
    );
    return collarborator;
};

const sendDataRequest= async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `store-customer`,
        data,
        "POST"
    );
    return collarborator;
};

const sendDataRequestNewca = async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `store-newca`,
        data,
        "POST"
    );
    return collarborator;
};

export const RequestStopService = {
    getListIndexCustomer,
    getListIndexStaff,
    destroyCustomer,
    customerConfirmDestroy,
    sendDataRequest,
    sendDataRequestNewca,
    confirmDestroyRequest,
};
