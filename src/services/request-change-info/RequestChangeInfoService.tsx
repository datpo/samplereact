import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-thay-doi-thong-tin/";

const getData = async () => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "getData",
        {},
        "GET"
    );
    return result;
};

const store = async data => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "storeContributorInfo",
        data,
        "POST"
    );
    return result;
};

const storeAgency = async data => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "storeAgency",
        data,
        "POST"
    );
    return result;
};

const index = async () => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index",
        {},
        "GET"
    );
    return result;
};

const del = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `del/${id}`,
        {},
        "DELETE"
    );
    return result;
};

const find = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `find/${id}`,
        {},
        "GET"
    );
    return result;
};

const getFilePassport = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `getFilePassport/${id}`,
        {},
        "GET"
    );
    return result;
};

const update = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `update`,
        data,
        "POST"
    );
    return result;
};

const updateAgency = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `updateAgency `,
        data,
        "POST"
    );
    return result;
};

const checkAddRequest = async () => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `checkAddRequest`,
        {},
        "GET"
    );
    return result;
};
export const RequestChangeInfoService = {
    getData,
    store,
    index,
    del,
    find,
    getFilePassport,
    update,
    storeAgency,
    updateAgency,
    checkAddRequest
};
