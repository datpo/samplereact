import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/khach-hang/";

const getListIndex = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return result;
};

const getInfo = async (id, type) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "show/"+id+'/'+type,
        {},
        "GET"
    );
    return result;
};
const getInfoCert = async (uid) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "listCert/"+uid,
        {},
        "GET"
    );
    return result;
};
const requestChangeInfoOrganization = async (data) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'request-change-info-organization',
        data,
        'POST'
    );
    return result;
};
const requestChangeInfoPersonal = async (data) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'request-change-info-personal',
        data,
        'POST'
    );
    return result;
};

const actionCetificate = async (data) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "action-certificate",
        data,
        "POST"
    );
    return requestTokenCTS;
};

export const CustomerServices = {
    getListIndex,
    getInfo,
    getInfoCert,
    requestChangeInfoOrganization,
    requestChangeInfoPersonal,
    actionCetificate
}
