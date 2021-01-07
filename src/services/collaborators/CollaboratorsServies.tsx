import BaseServices from "../base/BaseServices";

const PREFIX_SERVICES = "qlbh/ctv/";

const getListIndex = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "index",
    data,
    "GET"
  );
  return collarborator;
};

const getToUpdate = async id => {
  const collar = await BaseServices.request(
    PREFIX_SERVICES + "get-to-update/" + id,
    {},
    "GET"
  );
  return collar;
};

const getToPreview = async id =>{
  const collar = await BaseServices.request(
    PREFIX_SERVICES + "get-to-preview/" + id,
    {},
    "GET"
  );
  return collar;
}

const draftStore = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "draft-store",
    data,
    "POST"
  );
  return collarborator;
};

const confirmStore = async (data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "confirm-store",
    data,
    "POST"
  );
  return collarborator;
};

const draftUpdate = async (id, data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "draft-update/" + id,
    data,
    "POST"
  );
  return collarborator;
};

const confirmUpdate = async (id, data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "confirm-update/" + id,
    data,
    "POST"
  );
  return collarborator;
};

const confirmReactive = async (id, data: object) => {
  const collarborator = await BaseServices.request(
    PREFIX_SERVICES + "confirm-reactive/" + id,
    data,
    "POST"
  );
  return collarborator;
};

const previewContractFile = async (data: object) => {
  const contract = await BaseServices.request(
    PREFIX_SERVICES + "gen-contract-file",
    data,
    "POST"
  );
  return contract;
};

const previewToTrinhFile = async (data: object) => {
  const totrinh = await BaseServices.request(
    PREFIX_SERVICES + "gen-totrinh-file",
    data,
    "POST"
  );
  return totrinh;
};

const getDocument = async (id, type) => {
  const document = await BaseServices.request(
    PREFIX_SERVICES + `get-document/${id}/${type}`,
    {},
    "GET"
  );
  return document;
};

const confirm = async id => {
  const document = await BaseServices.request(
    PREFIX_SERVICES + `confirm/${id}`,
    {},
    "PUT"
  );
  return document;
};

const decline = async (data,id) => {
  const document = await BaseServices.request(
    PREFIX_SERVICES + `decline/${id}`,
    data,
    "PUT"
  );
  return document;
};

const deleteColla = async (id) =>{
  const document = await BaseServices.request(
    PREFIX_SERVICES + `delete/${id}`,
    {},
    "DELETE"
  );
  return document;
}

const getContractCode = ()=>{
  const code = BaseServices.request(
    PREFIX_SERVICES + `next-contract-code`,
    {},
    "GET"
  );
  return code;
}

const getFilePassport = (id) =>{
  const file = BaseServices.request(
    PREFIX_SERVICES + `get-file-passport/${id}`,
    {},
    "GET"
  );
  return file;
}
const nextContributorCode = () =>{
  const data = BaseServices.request(
    PREFIX_SERVICES + `next-contributor-code`,
    {},
    "GET"
  );
  return data;
}

export const collaboratorsServices = {
  getListIndex,
  previewContractFile,
  previewToTrinhFile,
  confirmStore,
  draftStore,
  getToUpdate,
  draftUpdate,
  confirmUpdate,
  getDocument,
  confirm,
  decline,
  deleteColla,
  getToPreview,
  getContractCode,
  getFilePassport,
  confirmReactive,
  nextContributorCode
};
