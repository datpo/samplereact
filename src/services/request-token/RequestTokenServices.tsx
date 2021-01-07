import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/yeu-cau-token/";

const getListIndex = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "index",
    data,
    "GET"
  );
  return collarborator;
};

const store = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "store",
    data,
    "POST"
  );
  return collarborator;
};

const getModelToUpdate = async id => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "get-to-update/" + id,
    {},
    "GET"
  );
  return collarborator;
};

const previewRequest = async id =>{
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "preview-request/" + id,
    {},
    "GET"
  );
  return collarborator;
}

const update = async (id, data) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "update",
    { request_id: id, ...data },
    "PUT"
  );
  return collarborator;
};

const deleteRequest = async (id, ) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "delete",
    { request_id: id },
    "DELETE"
  );
  return collarborator;
};

const previewFileCreate = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "preview-file-register",
    data,
    "POST"
  );
  return collarborator;
};
const previewFile = async (id) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "preview-file-preview",
    {id: id},
    "POST"
  );
  return collarborator;
};


export const RequestTokenService = {
  store,
  getListIndex,
  getModelToUpdate,
  previewRequest,
  update,
  deleteRequest,
  previewFile,
  previewFileCreate

};
