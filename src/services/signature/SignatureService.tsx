import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/cau-hinh-cts/";

const getListIndex = async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return collarborator;
};

const deleteRequest = async id => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + "delete",
        id,
        "DELETE"
    );
    return collarborator;
};

const getTaxcode = async id => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `getTaxCode/${id}`,
        {},
        "GET"
    );
    return collarborator;
};

const sendDataSignature = async (data: object) => {
    const collarborator = await BaseServices.request(
        PREFIX_SERVICES + `store`,
        data,
        "POST"
    );
    return collarborator;
};

export const SignatureService = {
    getListIndex,
    deleteRequest,
    getTaxcode,
    sendDataSignature
};
