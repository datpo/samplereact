import BaseServices from "../base/BaseServices";


const changePassword = async (data: object) => {
    const result = await BaseServices.request(
        "change-password",
        data,
        "POST"
    );
    return result;
};

export const ChangePassWordService = {
    changePassword,
};
