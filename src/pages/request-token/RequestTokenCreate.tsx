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
import { RequestTokenService } from "services/request-token/RequestTokenServices";
import _ from "lodash";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import AntModal from "components/common/modal/AntModal";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";

interface Props extends FormComponentProps {
  user: any;
  history: any;
}

const RequestToken: React.FC<Props> = props => {
  const [agency, setAgency] = useState([]);
  const [agencyOption, setAgencyOption] = useState({});
  const [visibleModal, setVisibleModal] = useState(false);
  const [file, setFile] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchAgencyOption = async () => {
    const agencyService = new AgencyService();
    const data = await agencyService.getAgency();
    setAgency(data);
    setAgencyOption(_.mapValues(_.keyBy(data, "id"), "fullname"));
  };

  const storeAgency = status => {
    const { validateFields } = props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        try {
          loading.runLoadingBlockUI();
          const data = await RequestTokenService.store({ ...values, status });
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
              props.history.push("/yeu-cau-token");
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
          const data = await RequestTokenService.previewFileCreate(values);
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
          setFile(data);
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
    fetchAgencyOption();
    // eslint-disable-next-line
  }, []);

  const onChangeAgency = async value => {
    const selectdAgency: any = _.find(agency, { id: parseInt(value) });
    props.form.setFieldsValue({ tax_code: selectdAgency.tax_code });
  };

  return (
    <PageWrapper title="Thêm mới yêu cầu tạo tài khoản">
      <Form>
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
            defaultValue={1}
            isDisabled={true}
            maxLength={4}
          />
        </div>
        <div className="input-group">
          <RadioWithLabel
            options={{ 1: "Tại NewCA", 2: "Chuyển phát nhanh" }}
            label="Hình thức nhận"
            name="receive_type"
            wrappedClass="col-md-3"
            form={props.form}
            isRequired={true}
          />
          <RadioWithLabel
            options={{ 1: "Chuyển khoản", 2: "Tiền mặt" }}
            label="Hình thức thanh toán"
            name="type_pay"
            wrappedClass="col-md-2"
            form={props.form}
            isRequired={true}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng vỏ hộp"
            name="box_num"
            wrapClass="col-md-4"
            type="number"
            maxLength={4}
          />
          <InputWithLabel
            form={props.form}
            label="Số lượng phong bì"
            name="envelope_num"
            wrapClass="col-md-3"
            type="number"
            maxLength={4}
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
                wrapClass="col-md-4"
                type="text"
              />
              <InputWithLabel
                form={props.form}
                label="Số điện thoại"
                name="receive_phone"
                isRequired={true}
                wrapClass="col-md-3"
                type="number"
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
      <div className="input-group d-flex justify-content-center">
          <ButtonOnSave
            onClick={() => {
              storeAgency(1);
            }}
            label="Lưu nháp"
            className={"btn btn-primary btn-sm"}
          />
          <ButtonOnSave
            onClick={() => {
              storeAgency(2);
            }}
            label="Trình duyệt"
            className={"btn btn-success btn-sm"}
          />
          <ButtonCancel
            onClick={() => {
              props.history.push("/yeu-cau-token");
            }}
            className={"btn btn-default btn-sm"}
          />
      </div>
    </PageWrapper>
  );
};

const WrappedRequestTokenCreate = Form.create<Props>({
  name: "RequestToken"
})(RequestToken);

export default WrappedRequestTokenCreate;
