import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/quan-ly-hop-dong/";

const list = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "list",
        data,
        "GET"
    );
    return result;
};


const onPreviewFile = async (id, type, isAddendum, typeAddendum) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `previewFile/${id}`,
        {type, isAddendum, typeAddendum},
        "GET"
    );
    return result;
};

const getIsSign = async (id, typeAddendum) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `getIsSign/${id}`,
        {typeAddendum},
        "GET"
    );
    return result;
};

const getDataSign = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `getDataSign/${id}`,
        {},
        "GET"
    );
    return result;
};

const getSerial = async () => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `getSerial`,
        {},
        "GET"
    );
    return result;
};

const updateFileSigned = async (data) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `updateFileSigned`,
        data,
        "POST"
    );
    return result;
};

export const ContractManagerService = {
    list,
    onPreviewFile,
    getIsSign,
    getDataSign,
    getSerial,
    updateFileSigned,
};
