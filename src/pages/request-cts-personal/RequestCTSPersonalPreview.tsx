import React, { useState, useEffect } from "react";
import {Card, Form} from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import _ from "lodash";
import { match } from "react-router";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import { onFailAction } from "helpers/SwalCommon";
import {loading} from "../../components/common/loading/Loading";


interface Props extends FormComponentProps {
  match: match<{ id: string }>;
  history: any;
  isUpdateForm?: boolean;
  onClickDownloadFile?: any;
  disable?: boolean;
  defaultFileLabel?: string;
}
export const RequestCTSPersonalPreview: React.FC<Props> = props => {
  const id = props.match.params.id;

  const [passportDate, setPassportDate] = useState("");
  const [status, setStatus] = useState(0);
  const [reason, setReason] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [cateServicePackage, setCateServicePackage] = useState({});
  const [fileLabelPassport, setFileLabelPassport] = useState("");
  const [fileLabelOrgan, setFileLabelOrgan] = useState("");
  const [statusReqGen, setStatusReqGen] = useState(false);
  const [isFileDk02, setIsFileDk2] = useState(false);
  const [isFileDk03, setIsFileDk3] = useState(false);


  const [province, setProvince] = useState({});
  const [district, setDistrict] = useState({});


  const onPreviewFile = async (type) => {
    const {validateFields} = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        loading.runLoadingBlockUI();
        try {
          let token = localStorage.getItem("currentUser");
          if (token) {
            let obj = JSON.parse(token);
            let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/request-digital-certificate-personal/get-file/${id}/${type}?token=${obj.token}`;
            window.open(link)
          }
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem file!");
        }
        loading.stopRunLoading();
      }
    });
  };

  const fetchRequestPersonal = async () => {
    const requestCertificateData = await RequestDigitalCertificatePersonalServices.previewRequestPersonal(id);

    const province = await RequestDigitalCertificatePersonalServices.getProvince();
    setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
    const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(requestCertificateData.data.province_code);
    setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
    if (requestCertificateData.data.requestpersonal.tax_code) {
      props.form.setFieldsValue({
        tax_code: requestCertificateData.data.requestpersonal.tax_code,
      });
    }

    if(Number(requestCertificateData.data.status) === 5 ){
      setStatusReqGen(true);
    }


    let arrAll:any = [];
    requestCertificateData.data.list_document.forEach(function (values) {
      arrAll[values.id] = values.type;
    });
    arrAll.forEach(function(item, index, array) {
      if(Number(item) === 7){
        setStatusReqGen(true);
        setIsFileDk2(true);
      }
      if(Number(item) === 14){
        setIsFileDk3(true);
      }
    });

    let filePassportName = '';
    let fileOrganName = '';
    requestCertificateData.data.list_document.forEach(function (value) {
      if(value['type'] === 1){
        filePassportName = value['file'].split("/") ;
      }else if(value['type'] === 2){
        fileOrganName = value['file'].split("/");
      }
    });
    props.form.setFieldsValue({
      passport: requestCertificateData.data.requestpersonal.passport,
      passport_place: requestCertificateData.data.requestpersonal.passport_place.toString(),
      fullname: requestCertificateData.data.requestpersonal.fullname.toString(),
      phone: requestCertificateData.data.requestpersonal.phone,
      email: requestCertificateData.data.requestpersonal.email,
      address: requestCertificateData.data.requestpersonal.address,
      is_organization: requestCertificateData.data.requestpersonal.is_organization.toString(),
      object: requestCertificateData.data.object.toString(),
      type_docurment: requestCertificateData.data.type_docurment.toString(),
      support_register: requestCertificateData.data.support_register.toString(),
      package_id: requestCertificateData.data.package_id.toString(),
      package_price: requestCertificateData.data.package_price,
      type_device: requestCertificateData.data.type_device.toString(),
      province_code: requestCertificateData.data.province_code.toString(),
      district_code: requestCertificateData.data.district_code.toString(),
      passport_file: filePassportName[4],
    });
    setPassportDate(requestCertificateData.data.requestpersonal.passport_date);
    setStatus(requestCertificateData.data.status);
    setReason(requestCertificateData.data.reason);
    setSecretCode(requestCertificateData.data.secret_code);
    setFileLabelPassport(filePassportName[6] ? filePassportName[6] :'');
    if (Number(requestCertificateData.data.requestpersonal.is_organization) === 1) {
      props.form.setFieldsValue({
        organization_name: requestCertificateData.data.requestpersonal.organization_name,
        organization_department: requestCertificateData.data.requestpersonal.organization_department,
        organization_tax_code: requestCertificateData.data.requestpersonal.organization_tax_code,
        organization_position: requestCertificateData.data.requestpersonal.organization_position,
        organization_email: requestCertificateData.data.requestpersonal.organization_email,
        organization_phone: requestCertificateData.data.requestpersonal.organization_phone,
        organization_address: requestCertificateData.data.requestpersonal.organization_address,
      });
      // const fileOrganName = requestCertificateData.data.requestpersonal.organization_file.split("/");
      setFileLabelOrgan(fileOrganName[4] ? fileOrganName[4].substring(11) : '');
      props.form.setFieldsValue({
        organization_file: fileOrganName[4],
      });
    }
    if (Number(requestCertificateData.data.support_register) === 1) {
      props.form.setFieldsValue({
        fullname_support: requestCertificateData.data.requestsupport.fullname,
        position_support: requestCertificateData.data.requestsupport.position,
        email_support: requestCertificateData.data.requestsupport.email,
        phone_support: requestCertificateData.data.requestsupport.phone,
      });

    }

      let object = 1;
      if(Number(requestCertificateData.data.requestpersonal.is_organization) === 1){
        object = 2;

      }
      const type_search = 4;
      const type = props.form.getFieldValue("object");
      const type_device = props.form.getFieldValue("type_device");
      const data = await getCateServicePackage(type_search, type, object, type_device);
      setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
    };
    const getCateServicePackage = async (type_search, type, obj, type_device) =>{
        return await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
    };

useEffect(() => {
  fetchRequestPersonal();
  // eslint-disable-next-line
}, []);
const STATUS_TU_CHOI = 3;
const STATUS_WAIT_GEN = 6;
  return (

      <PageWrapper title="Chi tiết yêu cầu CTS cá nhân ">
        <Form>
          {status === STATUS_TU_CHOI ? (
              <Card className="m-r-15-i m-l-15-i" title={<label>Lý do từ chối</label>} size="small">
              <div className="input-group">
                {" "}
                <InputWithLabel
                    label=""
                    form={props.form}
                    name="reason-deny"
                    isDisabled={true}
                    wrapClass="col-md-12"
                    defaultValue={reason}
                />{" "}
              </div>
              </Card>
          ) : (
              ""
          )}
          {status === STATUS_WAIT_GEN ? (
              <Card className="m-r-15-i m-l-15-i" title={<label>Mã bảo mật</label>} size="small">
              <div className="input-group">
                {" "}
                <InputWithLabel
                    label=""
                    form={props.form}
                    name="secret_code"
                    isDisabled={true}
                    wrapClass="col-md"
                    defaultValue={secretCode}
                />{" "}
              </div>
              </Card>
          ) : (
              ""
          )}
          <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Trường hợp cá nhân thuộc tổ chức doanh nghiệp </label>} size="small">
            <div className="input-group">
              <div className=" input-group">
                <RadioWithLabel
                    label={"Trường hợp cá nhân thuộc tổ chức doanh nghiệp"}
                    options={{ 1: "Có", 2: "Không"}}
                    name="is_organization"
                    wrappedClass="col-md-4 radio-to-chuc"
                    form={props.form}
                    isDisabled={true}
                />
              </div>
              {props.form.getFieldValue("is_organization") === "1" ? (
                  <React.Fragment>
                    <div className="input-group">
                      <InputWithLabel
                          form={props.form}
                          label="Tên tổ chức"
                          name="organization_name"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Tên phòng ban"
                          name="organization_department"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="MST tổ chức/doanh nghiệp"
                          name="organization_tax_code"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Chức vụ"
                          name="organization_position"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />

                    </div>
                    <div className="input-group">
                      <InputWithLabel
                          form={props.form}
                          label="Email"
                          name="organization_email"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Số điện thoại"
                          name="organization_phone"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Địa chỉ tổ chức/doanh nghiệp"
                          name="organization_address"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                      <InputFileUpload
                          defaultLabel={fileLabelOrgan}
                          classWrapped="col-md-3"
                          label="File xác nhận tổ chức/doanh nghiệp"
                          name="organization_file"
                          form={props.form}
                          isDisabled={true}
                          onClickDownloadFile={() => onPreviewFile(2)}
                          extentionsAllow={['pdf', 'PDF']}
                          accept={".pdf"}
                      />
                    </div>
                  </React.Fragment>
              ) : (
                  ""
              )}

            </div>
          </Card>
          <Card className="m-r-15-i m-l-15-i  mt-4" title={<label>Thông tin cá nhân đăng ký</label>} size="small">
            <div className="input-group">
            <div className="input-group">
              <InputWithLabel
                  form={props.form}
                  label="Số CMND/Hộ chiếu"
                  name="passport"
                  wrapClass="col-md-2"
                  isDisabled={true}
              />
              <SelectDateWithLabel
                  name="passport_date"
                  form={props.form}
                  wrapClass="col-md-2"
                  label="Ngày cấp"
                  isDisabled={true}
                  defaultValue={passportDate ? moment(passportDate) : null}
              />
              <InputWithLabel
                  form={props.form}
                  label="Nơi cấp"
                  name="passport_place"
                  wrapClass="col-md-2"
                  isDisabled={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="MST (nếu có)"
                  name="tax_code"
                  wrapClass="col-md-2"
                  isDisabled={true}
              />
              <InputFileUpload
                  defaultLabel={fileLabelPassport}
                  classWrapped="col-md-4"
                  label="File CMND/Hộ chiếu"
                  name="passport_file"
                  form={props.form}
                  isDisabled={true}
                  onClickDownloadFile={() => onPreviewFile(1)}
                  extentionsAllow={['pdf', 'PDF']}
                  accept={".pdf"}
              />
            </div>
            <div className="input-group">
              <InputWithLabel
                  form={props.form}
                  label="Họ tên cá nhân"
                  name="fullname"
                  wrapClass="col-md-4"
                  isDisabled={true}
              />

              <InputWithLabel
                  form={props.form}
                  label="Số điện thoại"
                  name="phone"
                  wrapClass="col-md-4"
                  isDisabled={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="Email"
                  name="email"
                  wrapClass="col-md-4"
                  isDisabled={true}
              />

            </div>
            <div className="input-group">
              <RadioWithLabel
                  options={{ 1: "Có đăng ký", 2: "Không đăng ký" }}
                  label="ĐK hỗ trợ khẩn cấp"
                  name="support_register"
                  wrappedClass="col-md-4 radio_register_support"
                  form={props.form}
                  isDisabled={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="Địa chỉ thường trú"
                  name="address"
                  wrapClass="col-md-4"
                  isDisabled={true}
              />
              <SelectWithLabel
                  options={province}
                  name="province_code"
                  wrappedClass="col-md-2"
                  form={props.form}
                  label={"Tỉnh thành"}
                  isDisabled={true}
                  // onChange={onchange}
              />
              <SelectWithLabel
                  options={district}
                  name="district_code"
                  wrappedClass="col-md-2"
                  form={props.form}
                  label={"Quận huyện"}
                  isDisabled={true}
              />

            </div>
          </div>
          </Card>


          <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Đăng ký dịch vụ chứng thư số</label>} size="small">
            <div className="input-group">
              <div className="input-group">
              <RadioWithLabel
                  options={{ 1: "Cấp mới", 2: "Gia hạn", 3: "Chuyển đổi" }}
                  label="Đối tượng"
                  name="object"
                  wrappedClass="col-md-4 select-doi-tuong"
                  form={props.form}
                  isDisabled={true}
              />
              <RadioWithLabel
                  options={{1: "Token", 2: "HSM"}}
                  label="Loại thiết bị đầu cuối thuê bao"
                  name="type_device"
                  wrappedClass="col-md-3 select-doi-tuong"
                  form={props.form}
                  isDisabled={true}
              />
              <SelectWithLabel
                  options={cateServicePackage}
                  name="package_id"
                  wrappedClass="col-md-3 nopadding-left"
                  form={props.form}
                  label={"Gói dịch vụ"}
                  isDisabled={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="Giá bán"
                  name="package_price"
                  wrapClass="col-md-2"
                  isDisabled={true}
              />

            </div>
          </div>
          </Card>

          <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Đăng ký sử dụng dịch vụ hỗ trợ trường hợp khẩn cấp (nếu cần) </label>} size="small">
          {props.form.getFieldValue("support_register") === "1" ? (
              <React.Fragment>
                <div className="input-group">
                  <div className="label-thong-tin">
                    <label>Đăng ký sử dụng dịch vụ hỗ trợ trường hợp khẩn cấp (nếu cần)</label>
                  </div>
                  <div className="input-group">
                    <InputWithLabel
                        form={props.form}
                        label="Họ tên đầu mối"
                        name="fullname_support"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Chức vụ"
                        name="position_support"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Email"
                        name="email_support"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Số điện thoại"
                        name="phone_support"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />

                  </div>
                </div>
              </React.Fragment>
          ) : (
              ""
          )}
          </Card>
          <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Mẫu đăng ký</label>} size="small">
            <div className="input-group">
              <RadioWithLabel
                  options={{1: "Điện tử", 2: "Giấy", 3: "Scan"}}
                  label="Loại hồ sơ"
                  name="type_docurment"
                  wrappedClass="col-md-3 select-doi-tuong"
                  form={props.form}
                  isRequired={true}
                  isDisabled={true}
              />
              {status === STATUS_TU_CHOI ?
                  ("") : (
                      <React.Fragment>
                        <div className="col-md-2">
                          <label className="invisible">11111998</label>
                          <button onClick={() => onPreviewFile(4)} className="btn btn-outline-success form-control">
                            Tải xuống DK-01.02
                          </button>
                        </div>
                      </React.Fragment>
                  )
              }
              {statusReqGen || isFileDk02 ? (
                  <div className="col-md-2">
                    <label className="invisible">11111998</label>
                    <button onClick={() => onPreviewFile(7)} className="btn btn-outline-primary form-control">
                      Tải xuống DK-02
                    </button>
                  </div>

              ) : ("")
              }
              {isFileDk03 ? (
                  <div className="col-md-2">
                    <label className="invisible">11111998</label>
                    <button onClick={() => onPreviewFile(14)} className="btn btn-outline-success form-control">
                      Tải xuống DK-03
                    </button>
                  </div>
              ) : ("")}
            </div>
          </Card>
        </Form>

        <div className="input-group d-flex justify-content-center p-5 mt-4">
                    <div className="">
            <ButtonCancel
                onClick={() => {
                  props.history.push("/yeu-cau-cts-ca-nhan");
                }}
                className={"btn btn-default btn-sm"}
            />
          </div>
        </div>
      </PageWrapper>
  );
};

const WrappedRequestCTSPersonalPreview = Form.create<Props>({
  name: "RequestCTSPersonalPreview"
})(RequestCTSPersonalPreview);

export default WrappedRequestCTSPersonalPreview;
