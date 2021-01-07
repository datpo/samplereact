import React, { useState, useEffect } from "react";
import {Card, Form} from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import _ from "lodash";
import { match } from "react-router";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import {loading, loading as loadingHelper} from "components/common/loading/Loading";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";
import { handleDateData } from './../../helpers/NewCaCrmHelper';

interface Props extends FormComponentProps {
  match: match<{ id: string }>;
  history: any;
  isUpdateForm?: boolean;
  onClickDownloadFile?: any;
  disable?: boolean;
  defaultFileLabel?: string;
}
const objectDate = {
  1: 'passport_date',
};

export const RequestCTSPersonalUpdate: React.FC<Props> = props => {
  const id = props.match.params.id;

  const [passportDate, setPassportDate] = useState("");
  const [status, setStatus] = useState(0);
  const [reason, setReason] = useState("");
  const [cateServicePackage, setCateServicePackage] = useState({});
  const [loadingModal, setLoadingModal] = useState(false);
  const [fileLabelPassport, setFileLabelPassport] = useState("");
  const [fileLabelOrgan, setFileLabelOrgan] = useState("");
  const [fileLabelRegister, setFileLabelRegister] = useState("");
  const [isFileDk02, setIsFileDk02] = useState(false);
  const [isFileDk03, setIsFileDk03] = useState(false);
  const [file, setFile] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [province, setProvince] = useState({});
  const [district, setDistrict] = useState({});

  const update = status => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          loadingHelper.runLoadingBlockUI();
          const val= {
            ...values,
            status
          };
          const valuesConvert = handleDateData(val, objectDate);
          const data = await RequestDigitalCertificatePersonalServices.update(id, valuesConvert);
          if (data && Number(data.status) === 422) {
            onFailAction("Có lỗi xảy ra khi cập nhật !");
            _.forOwn(data.error, function(errors, key) {
              props.form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          } else {
            onSuccessAction("Cập nhập yêu cầu thành công", () => {
              props.history.push("/yeu-cau-cts-ca-nhan");
            });
          }
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi cập nhật yêu cầu!");
        } finally {
          loadingHelper.stopRunLoading();
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
      }
    });
  };

  const fetchRequestPersonal = async () => {
    const requestCertificateData = await RequestDigitalCertificatePersonalServices.getModelToUpdate(id);
    const province = await RequestDigitalCertificatePersonalServices.getProvince();
    setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
    const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(requestCertificateData.data.province_code);
    setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
    let filePassportName = '';
    let fileRegisterName = '';
    let fileOrganName = '';
    requestCertificateData.data.list_document.forEach(function (value) {
      if(value['type'] === 1){
        filePassportName = value['file'].split("/") ;
      }else if(value['type'] === 2){
        fileOrganName = value['file'].split("/");
      }else if(value['type'] === 4){
        fileRegisterName= value['file'].split("/");
      }else if(value['type'] === 7){
        setIsFileDk02(true);
      }else if(value['type'] === 14){
        setIsFileDk03(true);
      }
    });

    if (requestCertificateData.data.requestpersonal.tax_code) {
      props.form.setFieldsValue({
        tax_code: requestCertificateData.data.requestpersonal.tax_code,
      });
    }

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
      district_code: requestCertificateData.data.district_code.toString()
    });
    setPassportDate(requestCertificateData.data.requestpersonal.passport_date);
    setStatus(requestCertificateData.data.status);
    setReason(requestCertificateData.data.reason);
    setFileLabelPassport(filePassportName);
    setFileLabelRegister(fileRegisterName);
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
      setFileLabelOrgan(fileOrganName);
      props.form.setFieldsValue({
        organization_file: fileOrganName,
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
    const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
    return data;
  };
  const  onChangeIsOrgan = async e => {
    if (e){
      props.form.setFieldsValue({type_device: undefined});
      props.form.setFieldsValue({package_id: undefined});
      props.form.setFieldsValue({package_price: undefined});
    }
  };
  const onChangTypeDevice = async e => {
    if (e){
      loading.runLoadingBlockUI();
      props.form.setFieldsValue({package_id: undefined});
      props.form.setFieldsValue({package_price: undefined});
      let object = 1;
      if(Number(props.form.getFieldValue("is_organization")) === 1){
        object = 2;
      }
      const type_search = 4;
      const type = props.form.getFieldValue("object");
      const type_device = e.target.value;
      const data = await getCateServicePackage(type_search, type, object, type_device);
      setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
      loading.stopRunLoading();
    }
  };
  const onPreviewFile = async (type) => {
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
  };
  const onGenerateFile = async (typeFile) => {
    const {validateFields} = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          setVisibleModal(true);
          setLoadingModal(true);
          const val= {
            ...values,
            typeFile: typeFile
          };
          const valuesConvert = handleDateData(val, objectDate);
          const data = await RequestDigitalCertificatePersonalServices.generateFile(valuesConvert);
          setFile(data.base64);
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem trước file!");
          setVisibleModal(false);
        } finally {
          setLoadingModal(false);
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
      }
    });
  };
  const onOkModal = () => {
    setVisibleModal(false);
    setFile("");
  };
  const getProvince = ()=>{
    const province = RequestDigitalCertificatePersonalServices.getProvince();
    setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));

  };
  const onChangeProvince = async (e) =>{
    if(e){
      const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(e);
      setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
    } else{
      setDistrict({});
    }
    props.form.setFieldsValue({district_code: undefined})
  };
  useEffect(() => {
    getProvince();
    fetchRequestPersonal();
    // eslint-disable-next-line
  }, []);

  const STATUS_TU_CHOI = 3;
  return (
      <PageWrapper title="Cập nhật yêu cầu CTS cá nhân ">
        <Form>
          <ModalDisplayFile
              titleModal="File"
              visibleModal={visibleModal}
              loadingModal={loadingModal}
              fileBase64={file}
              onOkModal={()=>onOkModal()}
          />
          <InputWithLabel
              wrapClass={''}
              name={'isUpdate'}
              label={''}
              form={props.form}
              defaultValue={2}
              hidden={true}
          />
          <InputWithLabel
              wrapClass={''}
              name={'id'}
              label={''}
              form={props.form}
              defaultValue={id}
              hidden={true}
          />
          {status === STATUS_TU_CHOI ? (
              <Card className="m-r-15-i m-l-15-i" title={<label>Lý do từ chối</label>} size="small">
              <div className="input-group">
                {" "}
                <InputWithLabel
                    label="Lý do từ chối"
                    form={props.form}
                    name="reason-deny"
                    wrapClass="col-md"
                    defaultValue={reason}
                    isDisabled={true}
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
                    isRequired={true}
                    onChange={onChangeIsOrgan}
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
                          isRequired={true}
                          maxLength={255}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Tên phòng ban"
                          name="organization_department"
                          wrapClass="col-md-3"
                          maxLength={255}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="MST tổ chức/doanh nghiệp"
                          name="organization_tax_code"
                          wrapClass="col-md-3"
                          isRequired={true}
                          maxLength={16}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Chức vụ"
                          name="organization_position"
                          wrapClass="col-md-3"
                          maxLength={255}
                      />
                    </div>
                    <div className="input-group">
                      <InputWithLabel
                          form={props.form}
                          label="Email"
                          name="organization_email"
                          wrapClass="col-md-3"
                          isRequired={true}
                          maxLength={255}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Số điện thoại"
                          name="organization_phone"
                          wrapClass="col-md-3"
                          isRequired={true}
                          maxLength={16}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Địa chỉ tổ chức/doanh nghiệp"
                          name="organization_address"
                          wrapClass="col-md-3"
                          isRequired={true}
                          maxLength={255}
                      />
                      <InputFileUpload
                          classWrapped="col-md-3"
                          label="File xác nhận tổ chức/doanh nghiệp"
                          name="organization_file"
                          form={props.form}
                          isRequired={fileLabelOrgan ? false : true}
                          onClickDownloadFile={()=>onPreviewFile(2)}
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
          <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin cá nhân đăng ký</label>} size="small">
            <div className="input-group">
              <div className="input-group">
              <InputWithLabel
                  form={props.form}
                  label="Số CMND/Hộ chiếu"
                  name="passport"
                  isRequired={true}
                  wrapClass="col-md-2"
                  maxLength={16}
              />
              <SelectDateWithLabel
                  name="passport_date"
                  form={props.form}
                  isRequired={true}
                  wrapClass="col-md-2"
                  label="Ngày cấp"
                  defaultValue={passportDate ? moment(passportDate) : null}
                  rules={[
                    {
                      validator: function(rule, value, callback) {
                        if (value && value > moment()) {
                          callback("Ngày cấp phải nhỏ hơn ngày hiện tại");
                        } else {
                          callback();
                        }
                      },
                      message: "Ngày cấp phải nhỏ hơn ngày hiện tại"
                    }
                  ]}
              />
              <InputWithLabel
                  form={props.form}
                  label="Nơi cấp"
                  name="passport_place"
                  isRequired={true}
                  wrapClass="col-md-2"
                  maxLength={255}
              />
              <InputWithLabel
                  form={props.form}
                  label="MST (nếu có)"
                  name="tax_code"
                  wrapClass="col-md-2"
                  maxLength={16}
              />
              <InputFileUpload
                  classWrapped="col-md-4"
                  label="File CMND/Hộ chiếu"
                  name="passport_file"
                  form={props.form}
                  isRequired={fileLabelPassport? false : true}
                  onClickDownloadFile={()=>onPreviewFile(1)}
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
                  isRequired={true}
                  maxLength={255}
              />
              <InputWithLabel
                  form={props.form}
                  label="Số điện thoại"
                  name="phone"
                  wrapClass="col-md-4"
                  isRequired={true}
                  maxLength={16}
              />
              <InputWithLabel
                  form={props.form}
                  label="Email"
                  name="email"
                  wrapClass="col-md-4"
                  isRequired={true}
                  maxLength={255}
              />
            </div>
            <div className="input-group">
              <RadioWithLabel
                  options={{ 1: "Có đăng ký", 2: "Không đăng ký" }}
                  label="ĐK hỗ trợ khẩn cấp"
                  name="support_register"
                  wrappedClass="col-md-4 radio_register_support"
                  form={props.form}
                  isRequired={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="Địa chỉ thường trú"
                  name="address"
                  wrapClass="col-md-4"
                  maxLength={255}
              />
              <SelectWithLabel
                  options={province}
                  name="province_code"
                  wrappedClass="col-md-2"
                  form={props.form}
                  label={"Tỉnh thành"}
                  isRequired={true}
                  onChange={onChangeProvince}
              />
              <SelectWithLabel
                  options={district}
                  name="district_code"
                  wrappedClass="col-md-2"
                  form={props.form}
                  label={"Quận huyện"}
                  isRequired={true}
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
                  isRequired={true}
                  isDisabled={true}
              />
              <RadioWithLabel
                  options={{1: "Token", 2: "HSM"}}
                  label="Loại thiết bị đầu cuối thuê bao"
                  name="type_device"
                  wrappedClass="col-md-3 select-doi-tuong"
                  form={props.form}
                  isRequired={true}
                  isDisabled={Number(props.form.getFieldValue('object')) === 2}
                  onChange={onChangTypeDevice}
              />
              <SelectWithLabel
                  options={cateServicePackage}
                  name="package_id"
                  wrappedClass="col-md-3 nopadding-left"
                  form={props.form}
                  label={"Gói dịch vụ"}
                  isRequired={true}
              />
              <InputWithLabel
                  form={props.form}
                  label="Giá bán"
                  name="package_price"
                  wrapClass="col-md-2"
                  isRequired={true}
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
                        isRequired={true}
                        maxLength={255}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Chức vụ"
                        name="position_support"
                        wrapClass="col-md-3"
                        maxLength={255}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Email"
                        name="email_support"
                        wrapClass="col-md-3"
                        isRequired={true}
                        maxLength={255}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Số điện thoại"
                        name="phone_support"
                        wrapClass="col-md-3"
                        isRequired={true}
                        maxLength={255}
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
              />
              <div className="col-md-3">
                <label className="invisible">11111998</label>
                <button onClick={() => onGenerateFile(1)} className="btn btn-outline-success form-control">
                  Tải xuống DK-01.02
                </button>

              </div>
              <div className="col-md-3">
                <label className="invisible">11111998</label>
                <button onClick={() => onGenerateFile(2)} className="btn btn-outline-primary form-control">
                  Tải xuống DK-02
                </button>
              </div>
              <div className="col-md-3">
                <label className="invisible">11111998</label>
                <button onClick={() => onGenerateFile(3)} className="btn btn-outline-primary form-control">
                  Tải xuống DK-03
                </button>
              </div>
            </div>
            <div className="input-group">
              <InputFileUpload
                  classWrapped="col-md-3"
                  label="Tải file DK 01.02"
                  name="file_register_paper"
                  form={props.form}
                  isRequired={fileLabelRegister ? false : true}
                  onClickDownloadFile={()=>onPreviewFile(4)}
                  extentionsAllow={['pdf', 'PDF']}
                  accept={".pdf"}
              />
              <InputFileUpload
                  classWrapped="col-md-3"
                  label="Tải file DK-02"
                  name="file_dk_02"
                  form={props.form}
                  onClickDownloadFile={isFileDk02 ? ()=>onPreviewFile(7) : ''}
                  extentionsAllow={['pdf', 'PDF']}
                  accept={".pdf"}
              />
              <InputFileUpload
                  classWrapped="col-md-3"
                  label="Tải file DK-03"
                  name="file_dk_03"
                  form={props.form}
                  onClickDownloadFile={isFileDk03 ? ()=>onPreviewFile(14) : ''}
                  extentionsAllow={['pdf', 'PDF']}
                  accept={".pdf"}
              />
            </div>
          </Card>
        </Form>

        <div className="input-group d-flex justify-content-center p-5 mt-4">
          <div className="">
            <ButtonOnSave
                onClick={() => {
                  update(1);
                }}
                label="Lưu nháp"
                className={"btn btn-primary btn-sm"}
            />
          </div>
          <div className="">
            <ButtonOnSave
                onClick={() => {
                  update(2);
                }}
                label="Trình duyệt"
                className={"btn btn-success btn-sm"}
            />
          </div>
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

const WrappedRequestCTSPersonalUpdate = Form.create<Props>({
  name: "RequestCTSPersonalUpdate"
})(RequestCTSPersonalUpdate);

export default WrappedRequestCTSPersonalUpdate;
