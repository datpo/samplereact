import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-thay-doi-thong-tin-cert/";

const getListIndex = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return result;
};

const getInfo = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "show/"+id,
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
const requestChangeInfoOrganization = async (id, data) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'request-change-info-organization',
        { request_id: id, ...data },
        'POST'
    );
    return result;
};
const requestChangeInfoPersonal = async (id, data) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'request-change-info-personal',
        { request_id: id, ...data },
        'POST'
    );
    return result;
};

const denyRequestCert = async (data) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "deny-request-cert",
        data,
        "POST"
    );
    return requestTokenCTS;
};

const deleteRequest = async (id, ) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "delete",
        { request_id: id },
        "DELETE"
    );
    return requestTokenCTS;
};

const getFileChange = async (id,type) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getFile/" + id+'/'+type,
        {},
        "GET"
    );
    return result;
};

export const ChangeInfoCertServices = {
    getListIndex,
    getInfo,
    getInfoCert,
    requestChangeInfoOrganization,
    requestChangeInfoPersonal,
    denyRequestCert,
    deleteRequest,
    getFileChange
}
