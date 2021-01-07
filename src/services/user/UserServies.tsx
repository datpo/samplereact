import BaseServices from "../base/BaseServices";

export class UserServices {

    public async getUserAuth() {
        const user = await BaseServices.request("user-info", {}, "GET");
        return user;
    }
    public async getUserByType(type) {
        const user = await BaseServices.request("user-by-type", {type}, "GET");
        return user;
    }
    public async getUserByBusinessEmployee(nvkd_chuyen_id) {
        const user = await BaseServices.request("user-by-business-employee", {nvkd_chuyen_id}, "GET");
        return user;
    }
    public async changePassword(password,newPassword,reNewPassword) {
        const user = await BaseServices.request("qlbh/change-password", {password,newPassword,reNewPassword}, "POST");
        return user;
    }
}