import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-dao-tao/";

const index = async (data:object) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'index',
        data,
        'GET'
    );
    return result
};

const indexForStaff = async (data:object) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'index-for-staff',
        data,
        'GET'
    );
    return result
};

const storeRequest = async (data: object) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'store',
        data,
        'POST'
    );
    return result
};

const getRequest = async (id) =>{
    const result = BaseServices.request(
        PREFIX_SERVICES + 'get-request/' + id,
        {},
        'GET'
    );
    return result
};

const updateRequest = async (data: object) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'update',
        data,
        'PUT'
    );
    return result;
};

const deleteRequest = async (id) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'delete/' +id,
        {},
        'DELETE'
    );
    return result
};

const denyRequest = async (data) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'deny',
        data,
        'POST'
    );
    return result;
};

const approvalRequest =  async (id) => {
    const result = BaseServices.request(
        PREFIX_SERVICES + 'approval/' +id,
        {},
        'POST'
    );
    return result;
};

export const RequestTrainingServices = {
    index,
    indexForStaff,
    storeRequest,
    getRequest,
    updateRequest,
    deleteRequest,
    denyRequest,
    approvalRequest
};
