import BaseServices from "../base/BaseServices";

const getLiquidation = async (id) => {
    const result = await BaseServices.request(
         `getLiquidation/${id}`,
        {},
        "GET"
    );
    return result;
};

const getCertificate = async (id) => {
    const result = await BaseServices.request(
        `getCertificate/${id}`,
        {},
        "GET"
    );
    return result;
};

const updateSignedContract = async (data) => {
    const result = await BaseServices.request(
        `updateSignedContract`,
        data,
        "POST"
    );
    return result;
};

export const SignLiquidatinService = {
    getLiquidation,
    getCertificate,
    updateSignedContract
};
