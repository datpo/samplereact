import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/request-digital-certificate-personal/";

const getListIndex = async (data: object) => {
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return requestDigital;
};
const store = async (data: object) => {
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "store",
        data,
        "POST"
    );
    return requestDigital;
};
const update = async (id, data) => {
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "update",
        { id_request: id, ...data },
        "PUT"
    );
    return requestDigital;
};

const previewRequestPersonal = async id =>{
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "preview-request-personal/" + id,
        {},
        "GET"
    );
    return requestDigital;
};
const getModelToUpdate= async id =>{
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "get-model-to-update/" +id ,
        {},
        "GET"
    );
    return requestDigital;
};

const getListCateServicePackage = async (type_search,type, obj,type_device) => {
    const listCate = await BaseServices.request(
        PREFIX_SERVICES + "get-cate-service-package",
        {type_search,type, obj, type_device},
        "GET"
    );
    return listCate;
};
const deleteRequest = async (id, ) => {
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "delete",
        { id_request: id },
        "DELETE"
    );
    return requestDigital;
};
const generateFile = async (data: object) => {
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "gen-file",
        data,
        "POST"
    );
    return requestDigital;
};

const getFileDoc = (id, type) =>{
    const file = BaseServices.request(
        PREFIX_SERVICES + `get-file/${id}/${type}`,
        {},
        "GET"
    );
    return file;
};

const getInfo = (passport, object) =>{
    const file = BaseServices.request(
        PREFIX_SERVICES + `getInfo`,
        {passport, object},
        "POST"
    );
    return file;
};

const getListCateServicePackagePersonal = async (type_search, type) => {
    const listCate = await BaseServices.request(
        PREFIX_SERVICES + "get-list-cate-service-package",
        {type_search, type},
        "GET"
    );
    return listCate;
};
const getProvince = () =>{
    const result =  BaseServices.request(
        PREFIX_SERVICES+ 'getProvince',
        {},
        "GET"
    );
    return result
};
const getDistrictByProvince = async (provinceCode) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'getDistrictByProvinceCode',
        {provinceCode},
        "GET"
    );
    return result;
};
export const RequestDigitalCertificatePersonalServices = {
    store,
    update,
    getListIndex,
    getModelToUpdate,
    previewRequestPersonal,
    getListCateServicePackage,
    deleteRequest,
    generateFile,
    getFileDoc,
    getInfo,
    getListCateServicePackagePersonal,
    getProvince,
    getDistrictByProvince
};
