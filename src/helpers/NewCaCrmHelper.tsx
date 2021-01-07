import _ from "lodash";
import { Location, History } from "history";
import moment from "moment";
import store from "store/store";

export const convertJsonToQueryString = data => {
  const dataNotNull = _.pickBy(data, _.identity);
  let queryString = "";
  _.forIn(dataNotNull, function(value, key) {
    queryString += `${key}=${value}&`;
  });
  if (queryString) {
    return "?" + _.trimEnd(queryString, "&");
  }
  return "";
};

export const queryStringToJSON = queryString => {
  if (queryString.indexOf("?") > -1) {
    queryString = queryString.split("?")[1];
  }
  var pairs = queryString.split("&");
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split("=");
    result[pair[0]] = decodeURIComponent(pair[1] || "");
  });
  return result;
};

export const reloadPage = (location: Location, history: History) => {
  history.push({ pathname: location.pathname, search: location.search });
};

export const onValidateFormError = (errors, setValidateErrors) => {
  setValidateErrors(errors);
};

export const formatDate = (date: string) => {
  return moment(date).format("l");
};

export const checkPermission = (permission: string) => {
  if(permission === 'menu-support-sale'){
  }
  if (!permission) {
    return true;
  }
  return (
    store.getState().authReducer.permission_list.indexOf(permission) !== -1
  );
};


export const handleDateData = (data: Object, list: Object) => {
  for (let key in list) {
    const value = list[key];
    if(data[value]._i){
      data[value] = data[value]._i;
    }else{
      data[value] = data[value].format('YYYY-MM-DD');
    }
  }
  return data;
};

export const permissionMenu = async (list) => {
  // tạo quyền cho menu hỗ trợ bán hàng
  let arrSupport = ["request-token-all", "request-training"];
  let list1 = await createPermissionMenu(list, arrSupport, 'menu-support-sale')

  // tạo quyền cho menu quản lý bán hàng
  let arrManagerSale = ["request-digital-certificate", "request-gen-token-certificate", "create-certificate-paper", "list-change-info-cert"];
  let list2 = await createPermissionMenu(list1, arrManagerSale, 'menu-manager-sale')

  // tạo quyền cho menu hợp tác
  let arrManagerCoOperate = ["agency-list", "contributor-list", "request-token-ra", "stop-coop-list", "request-change-manager-customer", "request-change-info", "stop-coop"];
  let list3 = await createPermissionMenu(list2, arrManagerCoOperate, 'menu-manager-co-operate')

  // tạo quyền cho menu hồ sơ
  let arrManagerFile = ["request-token-all", "contract-manager-sale"];
  let list4 = await createPermissionMenu(list3, arrManagerFile, 'menu-manager-file')

  // tạo quyền cho menu khách hàng
  let arrManagerCustomer = ["list-customer"];
  let list5 = await createPermissionMenu(list4, arrManagerCustomer, 'menu-manager-customer')

  // tạo quyền cho menu hệ thống
  let arrManagerSystem = ["signature-config"];
  let list6 = await createPermissionMenu(list5, arrManagerSystem, 'menu-system')

  let arrManagerReconciliation = ["reconciliation"];
  let list7 = await createPermissionMenu(list6, arrManagerReconciliation, 'menu-reconciliation')

  return await list7;
}

const createPermissionMenu = (list, child, per) => {
  child.forEach(element => {
    if(list.includes(element)){
      list.push(per)
    }
  });
  let unique = list.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
  })
  return unique;
}
export const formatDateTime = (date: string) => {
  if (date) {
    return moment(date).format("DD/MM/YYYY");
  } else {
    return "";
  }
};
