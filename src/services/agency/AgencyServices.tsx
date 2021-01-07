import BaseServices from "../base/BaseServices";

export class AgencyService {
  private PREFIX_AGENCY_API = "qlbh/agency";

private PREFIX_NHOMQuyen_API ="http://localhost:8080/cybertax/api/nhomquyen/";

  public async indexAgency(params) {
    debugger
    const result = await BaseServices.request(
      `${this.PREFIX_NHOMQuyen_API}/all?mst=1234567890`,
      params,
      "GET"
    );
    return result;
  }

  public async storeDraftAgency(data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/store-as-draft`,
      data,
      "POST"
    );

    return result;
  }

  public async storeConfirmAgency(data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/store-as-confirm`,
      data,
      "POST"
    );
    return result;
  }

  public async getModelToUpdate(id) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-agency-to-update/` + id,
      {},
      "GET"
    );
    return result;
  }

  public async getAgencyToPreview(id) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-agency-to-preview/` + id,
      {},
      "GET"
    );
    return result;
  }

  public async acceptAgency(id) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/accept-agency/` + id,
      {},
      "PUT"
    );
    return result;
  }

  public async declineAgency(id, data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/decline-agency/` + id,
      data,
      "PUT"
    );
    return result;
  }

  public async updateAgencyAsDraft(id, data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/update-agency-as-draft/` + id,
      data,
      "POST"
    );
    return result;
  }

  public async updateAgencyAsConfirm(id, data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/update-agency-as-confirm/` + id,
      data,
      "POST"
    );
    return result;
  }

  public async updateAgencyAsReactive(id, data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/update-agency-as-reactive/` + id,
      data,
      "POST"
    );
    return result;
  }

  public async getAgencyContract(data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/agency-contract`,
      data,
      "POST"
    );
    return result;
  }

  public async getAgencyReport(data) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/agency-report`,
      data,
      "POST"
    );
    return result;
  }
  public async getAgencyAddendum(data, type) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/agency-addendum/${type}`,
      data,
      "POST"
    );
    return result;
  }

  public async getManagerByAuth() {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-manager-by-auth`,
      {},
      "GET"
    );
    return result;
  }

  public async deleteAgency(id) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/delete-agency/${id}`,
      {},
      "DELETE"
    );
    return result;
  }

  public async getDocument(agency, type, typeAddendum = 0) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-document/${agency}/${type}/${typeAddendum}`,
      {},
      "GET"
    );
    return result;
  }

  public async getGPKD(agency) {
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-file-gpkd/${agency}`,
      {},
      "GET"
    );
    return result;
  }
  
  public async nextContractCode(){
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/next-contract-code`,
      {},
      "GET"
    );
    return result;
  }
  public async nextAgencyCode(){
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/next-agency-code`,
      {},
      "GET"
    );
    return result;
  }

  public async getAgency(){
    const result = await BaseServices.request(
      `${this.PREFIX_AGENCY_API}/get-agency-active-list`,
      {},
      "GET"
    );
    return result;
  }
    public async getAgencyByOwenId(owner_id){
        const result = await BaseServices.request(
            `${this.PREFIX_AGENCY_API}/get-agency-by-ownerid`,
            {owner_id},
            "GET"
        );
        return result;
    }
    public async getContributorByOwenId(owner_id){
        const result = await BaseServices.request(
            `${this.PREFIX_AGENCY_API}/get-contributor-by-ownerid`,
            {owner_id},
            "GET"
        );
        return result;
    }
  public async getAgencyContributor(type, sale_id) {
    const result = await BaseServices.request(
        "qlbh/agency-contributor-all",
        { type, sale_id },
        "GET"
    );
    return result;
  }public async getAgencyContributorForStaff(type) {
    const result = await BaseServices.request(
        "qlbh/agency-contributor-all-for-staff",
        { type },
        "GET"
    );
    return result;
  }

}
