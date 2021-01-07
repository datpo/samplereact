import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-token-cts/";

const getListIndex = async (data: object) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return requestTokenCTS;
};const getListIndexStaff = async (data: object) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "index-staff",
        data,
        "GET"
    );
    return requestTokenCTS;
};

const store = async (data: object) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "store",
        data,
        "POST"
    );
    return requestTokenCTS;
};

const getModelToUpdate = async id => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "get-to-update/" + id,
        {},
        "GET"
    );
    return requestTokenCTS;
};

const previewRequest = async id =>{
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "preview-request/" + id,
        {},
        "GET"
    );
    return requestTokenCTS;
};

const update = async (id, data) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "update",
        { request_id: id, ...data },
        "PUT"
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
const previewFile = async (id) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "preview-file-preview",
        {id: id},
        "POST"
    );
    return requestTokenCTS;
};
const previewFileCreate = async (data : object) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "preview-file-register",
        data,
        "POST"
    );
    return requestTokenCTS;
};
const denyRequest = async (data) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "deny-request",
        data,
        "POST"
    );
    return requestTokenCTS;
};
const approvalRequest = async (data) => {
    const requestTokenCTS = await BaseServices.request(
        PREFIX_SERVICES + "approval-request",
        data,
        "POST"
    );
    return requestTokenCTS;
};

export const RequestTokenCTSService = {
    getListIndex,
    getListIndexStaff,
    store,
    getModelToUpdate,
    previewRequest,
    update,
    deleteRequest,
    previewFile,
    denyRequest,
    approvalRequest,
    previewFileCreate
};
