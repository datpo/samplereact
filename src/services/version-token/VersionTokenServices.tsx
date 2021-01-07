import BaseServices from "../base/BaseServices";

export class VersionTokenServices {
    public async getVersionToken() {
        const result = await BaseServices.request("cate/danh-muc-version-token", {} , "GET");
        return result;
    }
}