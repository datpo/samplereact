import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/quan-ly-ho-so/";

const list = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "list",
        data,
        "GET"
    );
    return result;
};


const onPreviewFile = async (id, type) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `previewFile/${id}/${type}`,
        {},
        "GET"
    );
    return result;
};

const onApprove = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `onApprove/${id}`,
        {},
        "GET"
    );
    return result;
};

const onRefuse = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `onRefuse`,
        data,
        "GET"
    );
    return result;
};

const uploadFile = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `uploadFile`,
        data,
        "GET"
    );
    return result;
};

export const DocLegalManagerService = {
    list,
    onPreviewFile,
    onApprove,
    onRefuse,
    uploadFile
};
