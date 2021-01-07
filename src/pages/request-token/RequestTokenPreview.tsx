import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import { AgencyService } from "services/agency/AgencyServices";
import _ from "lodash";
import { RequestTokenService } from "services/request-token/RequestTokenServices";
import { match } from "react-router";
import { onFailAction } from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import AntModal from "components/common/modal/AntModal";

const STATUS_TU_CHOI = 3;
interface Props extends FormComponentProps {
  match: match<{ id: string }>;
  history: any;
}

export const RequestTokenPreview: React.FC<Props> = props => {
  const [agency, setAgency] = useState([]);
  const [agencyOption, setAgencyOption] = useState({});
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

  const id = props.match.params.id;

  const fetchAgencyOption = async () => {
    const agencyService = new AgencyService();
    const data = await agencyService.getAgency();
    setAgency(data);
    setAgencyOption(_.mapValues(_.keyBy(data, "id"), "fullname"));
  };

  const onChangeAgency = async value => {
    const selectdAgency: any = _.find(agency, { id: parseInt(value) });
    props.form.setFieldsValue({ tax_code: selectdAgency.tax_code });
  };

  const fetchRequestToken = async () => {
    const requestToken = await RequestTokenService.previewRequest(id);
    const data = requestToken.data;
    props.form.setFieldsValue({
      owner_id: data.owner_id.toString(),
      receive_type: data.receive_type.toString(),
      token_admin_num: data.token_admin_num,
      box_num: data.box_num,
      envelope_num: data.envelope_num,
      receive_fullname: data.receive_fullname,
      type_pay: data.type_pay.toString(),
      token_admin_note: data.token_admin_note
    });
    setReason(data.reason);
    setStatus(data.status);
    setPassport(data.receive_passport);
    setAddress(data.receive_address);
    setPhone(data.receive_phone);
    setReceiveDate(data.receive_date);
    setLoading(false);
    props.form.setFieldsValue({ tax_code: data.owner.tax_code });
  };

  useEffect(() => {
    fetchAgencyOption();
    fetchRequestToken();
    // eslint-disable-next-line
  }, []);

  const onPreviewFile = () => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          setVisibleModal(true);
          setLoadingModal(true);
          const data = await RequestTokenService.previewFile(id);
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

  return (
    <PageWrapper title="Xem chi tiết yêu cầu tạo tài khoản" loading={loading}>
      <Form>
        {status === STATUS_TU_CHOI ? (
          <div className="input-group">
            {" "}
            <InputWithLabel
              label="Lý do từ chối"
              form={props.form}
              name="reason-deny"
              isDisabled={true}
              wrapClass="col-md"
              labelClass="text-danger"
              defaultValue={reason}
            />{" "}
          </div>
        ) : (
          ""
        )}

        <div className="input-group">
          <SelectWithLabel
            options={agencyOption}
            name="owner_id"
            wrappedClass="col-md-5"
            form={props.form}
            placeholder="Chọn đại lý"
            label="Đại lý"
            isRequired={true}
            onChange={onChangeAgency}
            isDisabled={true}
          />
          <InputWithLabel
            form={props.form}
            label="Mã số thuế"
            name="tax_code"
            wrapClass="col-md-4"
            isDisabled={true}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng"
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
            wrappedClass="col-md-2"
            form={props.form}
            isRequired={true}
            isDisabled={true}
          />

          <InputWithLabel
            form={props.form}
            label="Số lượng vỏ hộp"
            name="box_num"
            wrapClass="col-md-4"
            type="number"
            isDisabled={true}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng phong bì"
            name="envelope_num"
            wrapClass="col-md"
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
            wrapClass="col-md-2"
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
              wrapClass="col-md-2"
              type="text"
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
                wrapClass="col-md-4"
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
            wrapClass="col-md"
            rows={4}
            isDisabled={true}
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
        <div className="col-md-2">
          <ButtonCancel
            onClick={() => {
              props.history.push("/yeu-cau-token");
            }}
            className={"btn btn-default btn-sm"}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

const WrappedRequestTokenPreview = Form.create<Props>({
  name: "RequestTokenPreview"
})(RequestTokenPreview);

export default WrappedRequestTokenPreview;
