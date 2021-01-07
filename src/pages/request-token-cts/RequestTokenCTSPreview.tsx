import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import _ from "lodash";
import { match } from "react-router";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import AntModal from "components/common/modal/AntModal";
import {RequestTokenCTSService} from "../../services/request-token-cts/RequestTokenCTSServices";
import {TypeToken} from "../../helpers/enum/request-token/RequestTokenEnums";
import ButtonOnSave from "../../components/common/form/button/ButtonOnSave";
import ModalDeny from "../../components/common/form/ModalDeny";
import DenyButton from "../../components/common/form/button/DenyButton";
import {UserServices} from "../../services/user/UserServies";
import { checkPermission } from "helpers/NewCaCrmHelper";

const per_confirm = 'confirm-request-document'
const STATUS_KE_TOAN_TU_CHOI = 3;
const STATUS_HTKD_TU_CHOI = 6;
const STATUS_CHO_HTKD_DUYET = 5;
const TYPE_BUSINESS_SUPPORT = 6;
interface Props extends FormComponentProps {
  match: match<{ id: string }>;
  history: any;
}

export const RequestTokenCTSPreview: React.FC<Props> = props => {
  const [ownerOption, setOwnerOption] = useState({});
  const [passport, setPassport] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiveDate, setReceiveDate] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [file, setFile] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const [status, setStatus] = useState(0);
  const [reason, setReason] = useState("");
  const [userType, setUserType] = useState(0);


  const id = props.match.params.id;

  const fetchRequestToken = async () => {
    const requestToken = await RequestTokenCTSService.previewRequest(id);
    const data = requestToken.data;
    setOwnerOption(_.mapValues(_.keyBy(data, "id"), "fullname"));
    props.form.setFieldsValue({
      owner_id: data.owner_id.toString(),
      receive_type: data.receive_type.toString(),
      token_admin_num: data.token_admin_num,
      box_num: data.box_num,
      envelope_num: data.envelope_num,
      receive_fullname: data.receive_fullname,
      type_pay: data.type_pay.toString(),
      token_admin_note: data.token_admin_note,
      belong_to: data.belong_to.toString(),
    });
    setReason(data.reason);
    setStatus(data.status);
    setPassport(data.receive_passport);
    setAddress(data.receive_address);
    setPhone(data.receive_phone);
    setReceiveDate(data.receive_date);
    setLoading(false);
    if(Number(data.belong_to) === 1 ){
       props.form.setFieldsValue({ tax_code: data.owner.tax_code });
    }else if(Number(data.belong_to) === 2){
       props.form.setFieldsValue({ tax_code: data.owner.passport });
    }else {
      props.form.setFieldsValue({
        tax_code: '',
        nvkd_id: data.owner_id,
        nvkd_name:data.user.fullname,
      });
    }
  };

  const [modalDeny, setModalDeny] = useState({
    visible_modal_deny : false,
    loading: false,
    title_modal: "",
    base64: "",
    type_file: "",
    reason: "",
    error_reason: "",
  });
  const onPreviewFile = () => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {

      if (!errors) {
        try {
          setVisibleModal(true);
          setLoadingModal(true);
          const data = await RequestTokenCTSService.previewFile(id);
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
  };

  const approvalRequest = async () => {
        const data = {id:id}
           const result = await RequestTokenCTSService.approvalRequest(data);
          if (result && Number(result.status) === 422) {
            onFailAction("Có lỗi xảy ra khi duyệt yêu cầu !");
            _.forOwn(result.error, function(errors, key) {
              props.form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          } else {
            onSuccessAction("Duyệt yêu cầu thành công", () => {
              props.history.push("/yeu-cau-token-cts");
            });
          }
  };


  const handleModalDenyCancel = () => {
    setModalDeny({...modalDeny, 'visible_modal_deny':false})
  };
  const confirmDeny = async () => {
    if (modalDeny.reason.trim() === "") {
      setModalDeny({...modalDeny, 'error_reason': "Lý do từ chối không được trống" });
      return false;
    }
    const data = {data:modalDeny.reason, id:id};

    const result = await RequestTokenCTSService.denyRequest(data);
    await setModalDeny({...modalDeny, 'visible_modal_deny': false });

    if (result && Number(result.status) === 200) {
      onSuccessAction("Từ chối yêu cầu thành công!", () => {
        props.history.push("/yeu-cau-token-cts");
      });
    } else if (result && Number(result.status) === 422) {
      onFailAction("Có lỗi xảy ra trong quá trình từ chối!");
    } else {
      onFailAction(result.error);
    }
  };
  const onChangeDataDeny = ({ target: { value } }) => {
    setModalDeny({...modalDeny, 'reason': value});
  };

  const submitDeny = () => {
    setModalDeny({...modalDeny, 'visible_modal_deny': true });
  };
  const fetchUser = async  () => {
    const user = new UserServices();
    const userInfo = await user.getUserAuth();
    const type = userInfo.data.type;
    setUserType(type)

  };
  useEffect(() => {
    fetchRequestToken();
    fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <PageWrapper title="Xem chi tiết yêu cầu tài liệu bán hàng" loading={loading}>
      <Form>
        <InputWithLabel
            wrapClass={''}
            name={'nvkd_id'}
            label={""}
            form={props.form}
            hidden={true}
        />
        <ModalDeny
            visible={modalDeny.visible_modal_deny}
            handleCancel={handleModalDenyCancel}
            handleDeny={confirmDeny}
            value={modalDeny.reason}
            onChange={onChangeDataDeny}
            error={modalDeny.error_reason}
        />
        {status === STATUS_KE_TOAN_TU_CHOI || status === STATUS_HTKD_TU_CHOI ? (
          <div className="input-group">
            {" "}
            <InputWithLabel
              label="Lý do từ chối"
              form={props.form}
              name="reason-deny"
              isDisabled={true}
              wrapClass="col-md"
              defaultValue={reason}
            />{" "}
          </div>
        ) : (
          ""
        )}

        <div className="input-group">
          <SelectWithLabel
              options={TypeToken.TYPEAGENCY}
              name="belong_to"
              wrappedClass="col-md-3"
              form={props.form}
              placeholder="Chọn loại người dùng"
              label="Loại người dùng"
              isRequired={true}
              isDisabled={true}
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
                  options={ownerOption}
                  name="owner_id"
                  wrappedClass="col-md-3"
                  form={props.form}
                  label="Đại lý/CTV/NVKD"
                  isRequired={true}
                  isDisabled={true}
              />
          )}

          <InputWithLabel
            form={props.form}
            label="MST/CMND"
            name="tax_code"
            wrapClass="col-md-3"
            isDisabled={true}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng Token"
            name="token_admin_num"
            isRequired={true}
            wrapClass="col-md-3"
            type="number"
            isDisabled={true}
          />
        </div>
        <div className="input-group">
          <RadioWithLabel
            options={{ "1": "Tại NewCA", "2": "Chuyển phát nhanh" }}
            label="Hình thức nhận"
            name="receive_type"
            wrappedClass="col-md-3"
            form={props.form}
            isRequired={true}
            isDisabled={true}
          />
          <RadioWithLabel
            options={{ 1: "Chuyển khoản", 2: "Tiền mặt" }}
            label="Hình thức thanh toán"
            name="type_pay"
            wrappedClass="col-md-3"
            form={props.form}
            isRequired={true}
            isDisabled={true}
          />

          <InputWithLabel
            form={props.form}
            label="Số lượng vỏ hộp"
            name="box_num"
            wrapClass="col-md-3"
            type="number"
            isDisabled={true}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng phong bì"
            name="envelope_num"
            wrapClass="col-md-3"
            type="number"
            isDisabled={true}
          />
        </div>
        <div className="input-group">
          <InputWithLabel
            form={props.form}
            label="Người nhận"
            name="receive_fullname"
            isRequired={true}
            wrapClass="col-md-3"
            type="text"
            isDisabled={true}
          />
          <SelectDateWithLabel
            name="receive_date"
            form={props.form}
            isRequired={true}
            wrapClass="col-md"
            label="Ngày nhận"
            defaultValue={receiveDate ? moment(receiveDate) : null}
            isDisabled={true}

          />
          {props.form.getFieldValue("receive_type") === "1" ? (
            <InputWithLabel
              form={props.form}
              label="Số CMND/Hộ chiếu"
              name="receive_passport"
              isRequired={true}
              wrapClass="col-md-3"
              type={"text"}
              defaultValue={passport}
              isDisabled={true}
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
                defaultValue={address}
                isDisabled={true}
              />
              <InputWithLabel
                form={props.form}
                label="Số điện thoại"
                name="receive_phone"
                isRequired={true}
                wrapClass="col-md-3"
                isDisabled={true}
                type="text"
                defaultValue={phone}
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
            isDisabled={true}
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
      {status === STATUS_CHO_HTKD_DUYET && userType === TYPE_BUSINESS_SUPPORT? (
          <div className="input-group d-flex justify-content-center p-5">
            {" "}
            <div className="">
              {checkPermission(per_confirm)
                ? <ButtonOnSave
                      onClick={() => {
                        approvalRequest();
                      }}
                      label="Duyệt"
                      className={"btn btn-success btn-sm"}
                  />
                : null
              }
            </div>
            <div className="">
              {checkPermission(per_confirm)
                ? <DenyButton onClick={submitDeny}/>
                : null
              }
            </div>
            <div className="">
              <ButtonCancel
                  onClick={() => {
                    props.history.push("/yeu-cau-token-cts");
                  }}
                  className={"btn btn-default btn-sm"}
              />
            </div>{" "}
          </div>
      ) : (
          <div className="input-group d-flex justify-content-center p-5">
            <div className="">
              <ButtonCancel
                  onClick={() => {
                    props.history.push("/yeu-cau-token-cts");
                  }}
                  className={"btn btn-default btn-sm"}
              />
            </div>
          </div>
      )}

    </PageWrapper>
  );
};

const WrappedRequestTokenCTSPreview = Form.create<Props>({
  name: "RequestTokenCTSPreview"
})(RequestTokenCTSPreview);

export default WrappedRequestTokenCTSPreview;
