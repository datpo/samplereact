import axios from "axios";
import { authenticationService } from "../authentication/AuthenticationService";
import { loading } from '../../components/common/loading/Loading';
import {onFailAction} from "../../helpers/SwalCommon";

declare const METHOD_REQUEST: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export default class BaseServices {
  public static BASE_URL = process.env.REACT_APP_BASE_API_URL;
  public static BASE_URL_GEN = process.env.REACT_APP_GEN_API_URL;

  public static async request(
    path: string,
    data: object,
    methodType: typeof METHOD_REQUEST
  ) {
   // const token = JSON.parse(localStorage.getItem("currentUser")).token;
    const axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 120000,
      headers: {
        // Authorization: authenticationService.currentUserValue
        //   ? authenticationService.currentUserValue.token
        //   : ""
        Authorization:localStorage.getItem("token")===null? localStorage.getItem("token") : ""
      }
    });
    const dynamicKeyData = methodType === "GET" ? "params" : "data";
    const configRequest = {
      url: path,
      method: methodType,
      [dynamicKeyData]: data
    };
    try {
      loading.runLoadingBlockUI();
      const result = await axiosInstance
        .request(configRequest)
        .catch(response => BaseServices.handleResponse(response));
      return result ? result.data : {};
    } catch (error) {
      throw error;
    } finally {
      loading.stopRunLoading();
    }
  }


  public static async requestGenCert(
    path: string,
    data: object,
    methodType: typeof METHOD_REQUEST
  ) {
    const axiosInstance = axios.create({
      baseURL: this.BASE_URL_GEN,
      timeout: 120000,
      headers: {
        Authorization: authenticationService.currentUserValue
          ? authenticationService.currentUserValue.token
          : ""
      }
    });
    const dynamicKeyData = methodType === "GET" ? "params" : "data";
    const configRequest = {
      url: path,
      method: methodType,
      [dynamicKeyData]: data
    };
    try {
      // loading.runLoadingBlockUI();
      const result = await axiosInstance
        .request(configRequest)
        .catch(response => BaseServices.handleResponse(response));
      return result ? result.data : {};
    } catch (error) {
      throw error;
    } finally {
      // loading.stopRunLoading();
    }
  }
  public static async axiosUpLoadFile(formData) {
    const uploadFileId = await axios
      .post(`${this.BASE_URL}upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authenticationService.currentUserValue
            ? authenticationService.currentUserValue.token
            : ""
        }
      })
      .catch(this.handleResponse);
    return uploadFileId ? uploadFileId.data : {};
  }


  public static handleResponse(error) {
   
    const response = error.response;
    if (response && [400, 401].indexOf(response.status) !== -1) {
      authenticationService.logout();
      window.location.reload();
    }

    if(response && [404].indexOf(response.status) !== -1){
        onFailAction('Có lỗi xảy ra')
      // window.location.href = "/404";
    }
    throw new Error(error);
  }
}
