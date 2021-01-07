import React, { useEffect, useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { AgencyService } from "services/agency/AgencyServices";
import { loading } from "components/common/loading/Loading";
import _ from "lodash";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import AntModal from "components/common/modal/AntModal";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import {RequestTokenCTSService} from "../../services/request-token-cts/RequestTokenCTSServices";
import {TypeToken} from "../../helpers/enum/request-token/RequestTokenEnums";
import {UserServices} from "../../services/user/UserServies";

interface Props extends FormComponentProps {
  user: any;
  history: any;
}
export const RequestTokenCTS: React.FC<Props> = props => {
  const [owner, setOwner] = useState([]);
  const [userType, setUserType] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [file, setFile] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const [agency, setAgency] = useState([]);
  const [contributor, setContributor] = useState([]);

  const storeRequest = status => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          loading.runLoadingBlockUI();
          const data = await RequestTokenCTSService.store({ ...values, status });
          if (data && Number(data.status) === 422) {
            _.forOwn(data.error, function(errors, key) {
              props.form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          } else if (data && Number(data.status) === 200) {
            onSuccessAction("Lưu yêu cầu thành công", () => {
              props.history.push("/yeu-cau-token-cts");
            });
          }
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi lưu !");
        } finally {
          loading.stopRunLoading();
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
      }
    });
  };
  const onPreviewFile = () => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          const data = await RequestTokenCTSService.previewFileCreate(values);
          if (data && Number(data.status) === 422) {
            setVisibleModal(false);
            setLoadingModal(false);
            _.forOwn(data.error, function(errors, key) {
              props.form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          }else {
            setVisibleModal(true);
            setLoadingModal(true);
            setFile(data);
          }
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
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

//sun
  const getAgency = async (type, sale_id)  => {
    const agencyService = new AgencyService();
    const lst = await agencyService.getAgencyContributor(type, sale_id);
    setAgency(lst.data);
    setContributor(lst.data);
    if (lst) {
      const arr:any = [];
      lst.data.map(value => (arr[value.id] = value.fullname));
      setOwner(arr);
    }
  };
  const onChangeSelectedType = async (e) => {
    const userService = new UserServices();
    const userResult = await userService.getUserAuth();
    if(!e){
      setOwner([]);
    }else {
      let sale_id = userResult.data.id;
      let type = 7;
      if (e == 2) type = 8;
      getAgency(type, sale_id);
      if(Number(e) === 3 && Number(userResult.data.type) === TYPE_BUSINESS_EMPLOYEE ){
        props.form.setFieldsValue({
          nvkd_id: sale_id,
          nvkd_name: userResult.data.fullname,
        })
      }
      /* eslint eqeqeq: 0 */
    }
    props.form.setFieldsValue({owner_id: undefined})
  };
  const onChangeAgency = async value => {
    if(props.form.getFieldValue("belong_to") == 1){
      const selectdAgency: any = _.find(agency, { id: parseInt(value) });
      props.form.setFieldsValue({ tax_code: selectdAgency.tax_code });
    }else {
      const selectdAgency: any = _.find(contributor, { id: parseInt(value) });
      props.form.setFieldsValue({ passport_ctv: selectdAgency.passport });
    }

  };
  const fetchUser = async  () => {
    const user = new UserServices();
    const userInfo = await user.getUserAuth();
    const type = userInfo.data.type;
    setUserType(type);
    const agencyService = new AgencyService();
    const agencyDta = await agencyService.getAgencyByOwenId(userInfo.data.owner_id);
    const contributorData = await agencyService.getContributorByOwenId(userInfo.data.owner_id);

    if(type === TYPE_AGENCY){
      props.form.setFieldsValue({
        belong_to: "1",
        owner_id : agencyDta.data.id,
        agency_name: agencyDta.data.fullname,
      });
      const selectdAgency: any = _.find(agencyDta, { id: parseInt(userInfo.data.owner_id) });
      props.form.setFieldsValue({ tax_code: selectdAgency.tax_code });

    }
    if(type === TYPE_CONTRIBUTOR){
      props.form.setFieldsValue({
        belong_to: "2",
        owner_id : contributorData.data.id,
        contributor_name: contributorData.data.fullname,
      });

      const selectdAgency: any = _.find(contributorData, { id: parseInt(userInfo.data.owner_id) });
      props.form.setFieldsValue({ passport_ctv: selectdAgency.passport });

    }

  };
  const TYPE_BUSINESS_EMPLOYEE = 5;
  const TYPE_BUSINESS_SUPPORT = 6;
  const TYPE_AGENCY = 7;
  const TYPE_CONTRIBUTOR = 8;

  return (
      <PageWrapper title="Thêm mới yêu cầu tài liệu bán hàng">
        <Form>
          <InputWithLabel
              wrapClass={''}
              name={'nvkd_id'}
              label={""}
              form={props.form}
              hidden={true}
          />
          {userType === TYPE_BUSINESS_EMPLOYEE || userType === TYPE_BUSINESS_SUPPORT ? (
              <div className="input-group">
                {" "}
                <SelectWithLabel
                    options={TypeToken.TYPEAGENCY}
                    name="belong_to"
                    wrappedClass="col-md-3"
                    form={props.form}
                    placeholder="Chọn loại người dùng"
                    label="Loại người dùng"
                    isRequired={true}
                    onChange={onChangeSelectedType}
                />
                {Number(props.form.getFieldValue("belong_to")) === 3 ? (
                    <InputWithLabel
                        wrapClass={'col-md-3'}
                        name={'nvkd_name'}
                        label={"Nhân viên kinh doanh"}
                        form={props.form}
                        isDisabled={true}
                        isRequired={true}
                    />
                ) : (
                    <SelectWithLabel
                        options={owner}
                        name="owner_id"
                        wrappedClass="col-md-3"
                        form={props.form}
                        placeholder="Chọn đại lý/CTV"
                        label="Chọn đại lý/cộng tác viên"
                        isRequired={true}
                        onChange={onChangeAgency}
                    />
                )}
                {Number(props.form.getFieldValue("belong_to")) === 1 ? (
                    <InputWithLabel
                        form={props.form}
                        label="MST/CMND"
                        name="tax_code"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                ) : (
                    ""
                ) }
                { Number(props.form.getFieldValue("belong_to")) === 2 ? (
                    <InputWithLabel
                        form={props.form}
                        label="MST/CMND"
                        name="passport_ctv"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                ) : ("")}
                <InputWithLabel
                    form={props.form}
                    label="Số lượng Token"
                    name="token_admin_num"
                    isRequired={true}
                    wrapClass="col-md-3"
                    type={"number"}
                />{" "}
              </div>
          ) : (
              <div className="input-group">
                {" "}
                <SelectWithLabel
                    options={TypeToken.TYPEAGENCY}
                    name="belong_to"
                    wrappedClass="col-md-3"
                    form={props.form}
                    label="Loại người dùng"
                    isRequired={true}
                    isDisabled={true}

                />
                {Number(userType) === 7 ? (
                    <React.Fragment>
                      <InputWithLabel
                          wrapClass={'col-md-3'}
                          name={'agency_name'}
                          label={"Đại lý"}
                          form={props.form}
                          isDisabled={true}
                          isRequired={true}
                      />
                      <InputWithLabel
                          wrapClass={'col-md-3'}
                          name={'owner_id'}
                          label={""}
                          form={props.form}
                          isDisabled={true}
                          hidden={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Mã số thuế"
                          name="tax_code"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                    </React.Fragment>

                ) : (
                    ""
                )}
                {Number(userType) === 8 ? (
                    <React.Fragment>
                      <InputWithLabel
                          wrapClass={'col-md-3'}
                          name={'contributor_name'}
                          label={"Cộng tác viên"}
                          form={props.form}
                          isDisabled={true}
                          isRequired={true}
                      />
                      <InputWithLabel
                          wrapClass={'col-md-3'}
                          name={'owner_id'}
                          label={""}
                          form={props.form}
                          isDisabled={true}
                          hidden={true}
                      />
                      <InputWithLabel
                          form={props.form}
                          label="Số CMND/Hộ chiếu"
                          name="passport_ctv"
                          wrapClass="col-md-3"
                          isDisabled={true}
                      />
                    </React.Fragment>
                ) : (
                    ""
                ) }
                <InputWithLabel
                    form={props.form}
                    label="Số lượng Token"
                    name="token_admin_num"
                    isRequired={true}
                    wrapClass="col-md-3"
                    type={"number"}
                />{" "}
              </div>
          )}
          <div className="input-group">
            <RadioWithLabel
                options={{ 1: "Tại NewCA", 2: "Chuyển phát nhanh" }}
                label="Hình thức nhận"
                name="receive_type"
                wrappedClass="col-md-3"
                form={props.form}
                isRequired={true}
                // onChange={onChangeQuatity}
            />
            <RadioWithLabel
                options={{ 1: "Chuyển khoản", 2: "Tiền mặt" }}
                label="Hình thức thanh toán"
                name="type_pay"
                wrappedClass="col-md-3"
                form={props.form}
                isRequired={true}
            />
            <InputWithLabel
                form={props.form}
                label="Số lượng vỏ hộp"
                name="box_num"
                wrapClass="col-md-3"
                type="number"
                defaultValue={props.form.getFieldValue("token_admin_num")}
            />
            <InputWithLabel
                form={props.form}
                label="Số lượng phong bì"
                name="envelope_num"
                wrapClass="col-md-3"
                type="number"
                defaultValue={props.form.getFieldValue("token_admin_num")}
            />
          </div>
          <div className="input-group">
            <InputWithLabel
                form={props.form}
                label="Người nhận"
                name="receive_fullname"
                isRequired={true}
                wrapClass="col-md-4"
                type="text"
                maxLength={255}
            />
            <SelectDateWithLabel
                name="receive_date"
                form={props.form}
                isRequired={true}
                wrapClass="col-md-2"
                label="Ngày nhận"
            />
            {props.form.getFieldValue("receive_type") === "1" ? (
                <InputWithLabel
                    form={props.form}
                    label="Số CMND/Hộ chiếu"
                    name="receive_passport"
                    isRequired={true}
                    type={"text"}
                    wrapClass="col-md-2"
                />
            ) : (
                ""
            )}
            {props.form.getFieldValue("receive_type") === "2" ? (
                <React.Fragment>
                  <InputWithLabel
                      form={props.form}
                      label="Địa chỉ"
                      name="receive_address"
                      isRequired={true}
                      wrapClass="col-md-3"
                      type="text"
                      maxLength={255}
                  />
                  <InputWithLabel
                      form={props.form}
                      label="Số điện thoại"
                      name="receive_phone"
                      isRequired={true}
                      wrapClass="col-md-3"
                  />
                </React.Fragment>
            ) : (
                ""
            )}
          </div>
          <div className="input-group">
            <TextAreaWithLabel
                form={props.form}
                label="Ghi chú"
                name="token_admin_note"
                wrapClass="col-md"
                rows={4}
            />
          </div>
        </Form>
        <div className="input-group pb-5 pt-2">
          <div className="col-md-2">
            <button onClick={onPreviewFile} className="btn btn-primary btn-sm">
              Mẫu đề xuất
            </button>

            <AntModal
                visible={visibleModal}
                loading={loadingModal}
                className="w-75 h-75"
                bodyStyle={{ height: "700px" }}
                style={{ top: "20px" }}
                onCLickOk={onOkModal}
            >
              <iframe
                  title="Quản lý hợp đồng"
                  src={`data:application/pdf;base64,${file}`}
                  height="100%"
                  width="100%"
              ></iframe>
            </AntModal>
          </div>
        </div>
        <div className="input-group d-flex justify-content-center p-5">
          <div className="">
            <ButtonOnSave
                onClick={() => {
                  storeRequest(1);
                }}
                label="Lưu nháp"
                className={"btn btn-primary btn-sm"}
            />
          </div>
          <div className="">
            <ButtonOnSave
                onClick={() => {
                  storeRequest(5);
                }}
                label="Trình duyệt"
                className={"btn btn-success btn-sm"}
            />
          </div>
          <div className="">
            <ButtonCancel
                onClick={() => {
                  props.history.push("/yeu-cau-token-cts");
                }}
                className={"btn btn-default btn-sm"}
            />
          </div>
        </div>
      </PageWrapper>
  );
};

const WrappedRequestTokenCTSCreate = Form.create<Props>({
  name: "RequestToken"
})(RequestTokenCTS);

export default WrappedRequestTokenCTSCreate;
