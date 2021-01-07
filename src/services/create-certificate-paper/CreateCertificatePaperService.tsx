import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/quan-ly-giay-chung-nhan/";

const list = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "list",
        data,
        "GET"
    );
    return result;
};

const genCertificatePaper = async (id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `genCertificatePaper/${id}`,
        {},
        "GET"
    );
    return result;
};

const onPreviewFile = async (type, id) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + `previewFile/${id}`,
        {type},
        "GET"
    );
    return result;
};

export const CreateCertificatePaperService = {
    list,
    genCertificatePaper,
    onPreviewFile
};
