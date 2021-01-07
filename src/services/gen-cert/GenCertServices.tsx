import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/gen-cts/";
const PREFIX_SERVICES_GEN_CUS = "gen-cts-customer/";


const getListIndex = async (data: object) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES + "index",
        data,
        "GET"
    );
    return result;
};
const previewInfoCert = async id =>{
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES + "view-info-cert/" +id ,
        {},
        "GET"
    );
    return requestDigital;
};
const getRequestToGenCus = async id =>{
    const requestDigital = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "get-request-to-gen/" +id ,
        {},
        "GET"
    );
    return requestDigital;
};
const getListCateServicePackage = async () => {
    const listCate = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "get-cate-service-package",
        {},
        "GET"
    );
    return listCate;
};
const getRequestBySecretCode = async (secretCode) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS +"get-request-by-secret-code",
        { secretCode},
        "GET"
    );
    return result;
};
const checkPlugin = async () =>{
    const result = await BaseServices.requestGenCert(
        "gettokenversion",
        {},
        "GET"
    );
    return result;
};
const genCsr = async (pin, keylength , typetoken, serial, Uid, CN, Org, Locality, ST, Country) =>{
    const result = await BaseServices.requestGenCert(
        "gencsr",
        {pin, keylength , typetoken, serial, Uid, CN, Org, Locality, ST, Country},
        "POST"
    );
    return result;
};
const getTokenByCode = async (tokenCode) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "get-token-by-code",
        {tokenCode},
        "GET"
    );
    return result;
};
const saveCSR = async (type_user, type_gen, secret_code,CKID, Base64CSR) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "save-CSR",
        {type_user, type_gen, secret_code,CKID, Base64CSR},
        "POST"
    );
    return result
};
const genUSBToken = async (type_user, type_gen, secret_code, serial, dateEnd, typeToken) =>{
    const result = await BaseServices.request(
    PREFIX_SERVICES_GEN_CUS + "gen-usb-token",
        {type_user,type_gen,secret_code, serial, dateEnd, typeToken},
        "POST"
    );
    return result;
};
const installCert = async (pin, typetoken, serialtoken, base64cert) => {
    const result = await BaseServices.requestGenCert(
        "installcert",
        {pin, typetoken, serialtoken, base64cert},
        "POST"
    );
    return result
};
const getFileToSign = async (type_gen, type_user, secret_code) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "get-file-to-sign",
        {type_gen, type_user, secret_code},
        "POST"
    );
    return result
};
const saveInfoCertificate = async (type_gen, type_user, secret_code, serial, certificateBase64, keyLength, subjectDN, issuerDN, certificateBegin, certificateEnd, certificateSerial ) => {
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'save-info-certificate',
        {type_gen, type_user, secret_code, serial, certificateBase64, keyLength, subjectDN, issuerDN, certificateBegin, certificateEnd, certificateSerial},
        'POST'
    );
    return result
};
const getCertInfo = async id =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'get-cert-info/'+id,
        {},
        'GET'
    );
    return result
};
const saveDocument = async (type, type_gen, type_user, secret_code, serial) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'save-document',
        {type, type_gen, type_user, secret_code, serial},
        'POST'
    );
    return result;
};
const updateSignFile = async (data) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'update-sign-file',
        data,
        'POST'
    );
    return result;
};
const getRequestDoc = async (owner_id, type_gen, type_user) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES + 'get-request-doc',
        {owner_id, type_gen, type_user},
        'GET'
    );
    return result;
};
const getRequestDocCus = async (owner_id, type_gen, type_user) =>{
    const result = await BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'get-request-doc',
        {owner_id, type_gen, type_user},
        'GET'
    );
    return result;
};
const genCsrRenew = async (uid, pin, typetoken,keylength ,serial, serialcert, CN, Org, Locality, ST, Country) =>{
    const result = await BaseServices.requestGenCert(
        "gencsrrenew",
        {uid, pin, keylength , typetoken, serial, serialcert, CN, Org, Locality, ST, Country},
        "POST"
    );
    return result;
};
const getSerialCert = async (code) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'get-serial-cert-info',
        {code},
        'GET'
    );
    return  result;
};
const getRequestChange = async (secretCode, type) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'get-request-change',
        {secretCode, type},
        'GET',
    );
    return result;
};
const getCertInfoBySerial = async (serialCert) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + "get-cert-info-by-serial",
        {serialCert},
        'GET',
    );
    return  result;
};
const deleteCertInfo = async (serialCert) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'delete-cert-info',
        {serialCert},
        'DELETE',
    );
    return result;
};
const deleteCertExtend = async (serialCert) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES_GEN_CUS + 'delete-cert-extend',
        {serialCert},
        'DELETE',
    );
    return result;
};
export const GenCertServices = {
    getListIndex,
    previewInfoCert,
    getListCateServicePackage,
    getRequestBySecretCode,
    checkPlugin,
    genCsr,
    getTokenByCode,
    saveCSR,
    genUSBToken,
    installCert,
    getFileToSign,
    saveInfoCertificate,
    getCertInfo,
    saveDocument,
    updateSignFile,
    getRequestDoc,
    genCsrRenew,
    getSerialCert,
    getRequestChange,
    getCertInfoBySerial,
    deleteCertInfo,
    getRequestDocCus,
    getRequestToGenCus,
    deleteCertExtend,
};
