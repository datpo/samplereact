import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/doi-soat/";

const index = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'index',
        data,
        'GET'
    );
    return result
};
const indexStaff = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'index-staff',
        data,
        'GET'
    );
    return result
};
const deny = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'deny',
        data,
        'POST'
    );
    return result;
};
const approve = async (id) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'approve',
        {id: id},
        'PUT'
    );
    return result;
};
const getFile = async (id) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'get-file',
        {id: id},
        'GET'
    );
    return result;
};
const updateSignedFile = async (data: object) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'update-signed-file',
        data,
        'PUT'
    );
    return result;
};
const getCertSerial = async (id) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'get-cert-serial',
        {id: id},
        'GET'
    );
    return result;
};

export const ReconciliationServices = {
    index,
    indexStaff,
    deny,
    approve,
    getFile,
    updateSignedFile,
    getCertSerial
};
