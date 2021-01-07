import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-chung-thu-so-to-chuc/";

const previewFile = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "previewFile",
        data,
        "POST"
    );
    return result;
};

const getListIndex = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return result;
};

const getListIndexSatff = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index-staff",
        data,
        "GET"
    );
    return result;
};

const store = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "store",
        data,
        "POST"
    );
    return result;
};

const getRequestCertificate = async id => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getRequestCertificate/" + id,
        {},
        "GET"
    );
    return result;
};

const getFile = async id => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getFile/" + id,
        {},
        "GET"
    );
    return result;
};

const getFileRegister = async id => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getFileRegister/" + id,
        {},
        "GET"
    );
    return result;
};

const previewRequest = async id =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + "preview-request/" + id,
        {},
        "GET"
    );
    return result;
};

const update = async (id, data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "update",
        { request_id: id, ...data },
        "PUT"
    );
    return result;
};

const deleteRequest = async (id, ) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "delete",
        { request_id: id },
        "DELETE"
    );
    return result;
};

const denyRequest = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "deny-request",
        data,
        "POST"
    );
    return result;
};

const approvalRequest = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "approval-request",
        data,
        "POST"
    );
    return result;
};


const getInfo = async (code, object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getInfo",
        {code, object},
        "POST"
    );
    return result;
};

const uploadFile = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "upload-file",
        data,
        "POST"
    );
    return result;
};

const getFileDoc = async (id , type) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getFileDoc",
        {id,type},
        "POST"
    );
    return result;
};

const getProvince =  () =>{
    const result =  BaseServices.request(
        PREFIX_SERVICES+ 'getProvince',
        {},
        "GET"
    );
    return result
};
const getDistrictByProvince = async (provinceCode) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'getDistrictByProvinceCode',
        {provinceCode},
        "GET"
    );
    return result;
};
const getRequestBySerial = async (serial_cts, identity_code) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getRequestBySerial",
        {serial_cts, identity_code},
        "GET"
    );
    return result;
};
export const RequestCertificateGroupService = {
    previewFile,
    getListIndex,
    getListIndexSatff,
    store,
    getRequestCertificate,
    previewRequest,
    update,
    deleteRequest,
    denyRequest,
    approvalRequest,
    getFile,
    getFileRegister,
    getInfo,
    uploadFile,
    getFileDoc,
    getProvince,
    getDistrictByProvince,
    getRequestBySerial
};