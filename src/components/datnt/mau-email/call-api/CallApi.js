import React from 'react'
import axios from 'axios'
import * as Config from './config';
import BaseServices from "./../../../../services/base/BaseServices";
import { async } from 'rxjs';
 
export const callApi = async (endpoint, method = 'GET', body) => {
  console.log("fL:", JSON.parse(localStorage.getItem("token")))
  var to = 'Bearer ' + JSON.parse(localStorage.getItem("token"));
  //to = JSON.parse(localStorage.getItem("token"));
  console.log("fL:", to);
    const axiosInstance = axios.create({
        // baseURL: 'http://localhost:8080',
        timeout: 1200000,
        headers: {
          // Authorization: authenticationService.currentUserValue
          //   ? authenticationService.currentUserValue.token
          //   : ""
          Authorization: to,//(localStorage.getItem("token")===null? {to} : ''),
    //    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJocnR1U1J2cVE4QVdaTkx1aFN3YXVOb1NiQWM2amRmMlRRbUp0U1lvazZRIn0.eyJleHAiOjE2MDk0MDU1MzgsImlhdCI6MTYwOTQwMTkzOCwianRpIjoiYzI5ZjkwOTEtZmQwYi00NTBhLWE3NzgtMzYyMjZlZDIwZTBiIiwiaXNzIjoiaHR0cDovLzEwLjMwLjEuNDA6ODA4MC9hdXRoL3JlYWxtcy9jeWJlcnRheHYyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6Ijg5MTMwYmFjLTQ0YjItNDZkNy04YmQzLWNmMDZlMTdhYjcyYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InRheGZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjNlMzk1NWE3LWUyMjktNGJlMi04ODE5LWU4OTQ3NjgzNTUzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InRoYWkgdGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjeWJlcnRheCIsImdpdmVuX25hbWUiOiJ0aGFpIiwiZmFtaWx5X25hbWUiOiJ0YSIsImVtYWlsIjoiY3liZXJ0YXhAZ21haWwuY29tIn0.FQ5ZktHCSZ53XZb5ObfsioR6YXytCPtPznBmKMd3hb0KJ0M4ENOKgiG3gMZc0sn-_S4hbNz1bQMn1vdCKuJORdVDFis5FvckUsnjcHUt63S_2arhmo9iCX5zcaneM-bbRChQI5ifmmk8pKcCfoDQgX5BWxG1rsiPNHfO355dZ3PWNqXtfIzqHQf0oIGc1gERhzvg1WmNSEmXaxpzLaLTd8Y5Up5aU3UGYbt0_WvFZGKp95Xm5o99p7pZ6jhQ9yS0uxTAd6bxgiTnDebOCoEIjujS2bC6PmsHMAUKGi5PpV6su6ylRN_F9RMGXJ5lU6GI5RrExf44my-PIn8jXqwQlQ',
        Accept: '*/*'
        }
      });
     // debugger
      const dynamicKeyData = "data";
      const configRequest = {
    //    url: 'http://localhost:8080/test',
         url:'http://localhost:8080/cybertax/api/cts?id=2d67221f-4655-11eb-9066-69fb54db8e99',
        method: 'GET',
        [dynamicKeyData]: []
      };

      const result = await axiosInstance
      .request(configRequest)
      .catch(response => {throw new Error(response);});
      console.log("duong09:", result);
    return result ? result.data : {};
  } 

  //  handleResponse = (error) => {
   
  //   const response = error.response;
  //   if (response && [400, 401].indexOf(response.status) !== -1) {
  //     authenticationService.logout();
  //     window.location.reload();
  //   }

  //   if(response && [404].indexOf(response.status) !== -1){
  //       onFailAction('Có lỗi xảy ra')
  //     // window.location.href = "/404";
  //   }
  //   throw new Error(error);
  // }

  export const test = async () =>{
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
           "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJocnR1U1J2cVE4QVdaTkx1aFN3YXVOb1NiQWM2amRmMlRRbUp0U1lvazZRIn0.eyJleHAiOjE2MDk0MDU1MzgsImlhdCI6MTYwOTQwMTkzOCwianRpIjoiYzI5ZjkwOTEtZmQwYi00NTBhLWE3NzgtMzYyMjZlZDIwZTBiIiwiaXNzIjoiaHR0cDovLzEwLjMwLjEuNDA6ODA4MC9hdXRoL3JlYWxtcy9jeWJlcnRheHYyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6Ijg5MTMwYmFjLTQ0YjItNDZkNy04YmQzLWNmMDZlMTdhYjcyYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InRheGZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjNlMzk1NWE3LWUyMjktNGJlMi04ODE5LWU4OTQ3NjgzNTUzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InRoYWkgdGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjeWJlcnRheCIsImdpdmVuX25hbWUiOiJ0aGFpIiwiZmFtaWx5X25hbWUiOiJ0YSIsImVtYWlsIjoiY3liZXJ0YXhAZ21haWwuY29tIn0.FQ5ZktHCSZ53XZb5ObfsioR6YXytCPtPznBmKMd3hb0KJ0M4ENOKgiG3gMZc0sn-_S4hbNz1bQMn1vdCKuJORdVDFis5FvckUsnjcHUt63S_2arhmo9iCX5zcaneM-bbRChQI5ifmmk8pKcCfoDQgX5BWxG1rsiPNHfO355dZ3PWNqXtfIzqHQf0oIGc1gERhzvg1WmNSEmXaxpzLaLTd8Y5Up5aU3UGYbt0_WvFZGKp95Xm5o99p7pZ6jhQ9yS0uxTAd6bxgiTnDebOCoEIjujS2bC6PmsHMAUKGi5PpV6su6ylRN_F9RMGXJ5lU6GI5RrExf44my-PIn8jXqwQlQ`,
      }
    };
    return axios({
      method:"GET",
     // url: 'http://localhost:8080/test',
       url:'http://localhost:8080/cybertax/api/cts?id=2d67221f-4655-11eb-9066-69fb54db8e99',
      data:'',

      headers:axiosConfig
    }).then(res => {
      console.log("test fcun:", res.data);
    }).catch(e => {
      console.log("err:", e);
    });
  }
//     return  axios({
//         method: method,
//         url: `http://localhost:8080/cybertax/api/cts/2d67221f-4655-11eb-9066-69fb54db8e99`,
//         data:body
//      }).catch(err => {
//          console.log(err);
//      });
// }

export const AgencyService = async () => {

    // async declineAgency(){
        console.log("heeeere")
    // const result = await BaseServices.request(
    //   `http://localhost:8080/cybertax/api/cts/2d67221f-4655-11eb-9066-69fb54db8e99`,
    //   {},
    //   "GET"
    // );
    // console.log("declineAgency:", result)
    // return result;
//   }
}


// export const getListIndex = async () => {
//     const result = await BaseServices.request(
//         // 'http://localhost:8080/cybertax/api/cts/2d67221f-4655-11eb-9066-69fb54db8e99',
//         `test`,
//         null,
//         "GET"
//     );
//     return result;
// };

// // create obje
// const axiosInstance = axios.create({
//     baseURL: this.BASE_URL,
//     timeout: 120000,
//     headers: {
//       Authorization: authenticationService.currentUserValue
//         ? authenticationService.currentUserValue.token
//         : ""
//     }
//   });

// const request = async(
//     path: string,
//     data: object,
//     methodType: typeof METHOD_REQUEST
//   ) => {
//     const axiosInstance = axios.create({
//       baseURL: this.BASE_URL,
//       timeout: 120000,
//       headers: {
//         Authorization: authenticationService.currentUserValue
//           ? authenticationService.currentUserValue.token
//           : ""
//       }
//     });
//     const dynamicKeyData = methodType === "GET" ? "params" : "data";
//     const configRequest = {
//       url: path,
//       method: methodType,
//       [dynamicKeyData]: data
//     };
//     try {
//       loading.runLoadingBlockUI();
//       const result = await axiosInstance
//         .request(configRequest)
//         .catch(response => BaseServices.handleResponse(response));
//       return result ? result.data : {};
//     } catch (error) {
//       throw error;
//     } finally {
//       loading.stopRunLoading();
//     }
//   }



