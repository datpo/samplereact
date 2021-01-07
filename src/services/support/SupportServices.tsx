import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "cate/";

const getListDocument = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "document",
        data,
        "GET"
    );
    return result;
};
const getListSoftware = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "software",
        data,
        "GET"
    );
    return result;
};

export const SupportServices = {
    getListDocument,
    getListSoftware
}
