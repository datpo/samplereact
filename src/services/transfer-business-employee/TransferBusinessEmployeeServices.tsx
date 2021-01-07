import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/transfer-business-employee/";

const getListIndex = async (data: object) => {
    const transfer = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return transfer;
};
const store = async (data: object) => {
    const transfer = await BaseServices.request(
        PREFIX_SERVICES + "store",
        data,
        "POST"
    );
    return transfer;
};


const previewTransfer = async id =>{
    const transfer = await BaseServices.request(
        PREFIX_SERVICES + "preview-transfer/" + id,
        {},
        "GET"
    );
    return transfer;
};
const listOwnerChanged = async id =>{
    const transfer = await BaseServices.request(
        PREFIX_SERVICES + "list-owner-changed/" +id ,
        {},
        "GET"
    );
    return transfer;
};

export const TransferBusinessEmployeeServices = {
    getListIndex,
    store,
    previewTransfer,
    listOwnerChanged
 };
