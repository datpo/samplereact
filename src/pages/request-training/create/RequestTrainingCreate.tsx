import React, { useEffect } from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { loading } from "components/common/loading/Loading";
import _ from "lodash";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import {UserServices} from "../../../services/user/UserServies";
import PageWrapper from "../../wrapper/PageWrapper";
import moment from "moment";
import {RequestTrainingServices} from "../../../services/request-training/RequestTrainingServices";

interface Props extends FormComponentProps {
    user: any;
    history: any;
}
export const RequestTraining: React.FC<Props> = props => {

    const storeRequest = status => {
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loading.runLoadingBlockUI();
                    const data = await RequestTrainingServices.storeRequest({ ...values, status });
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
                            props.history.push("/yeu-cau-dao-tao");
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

    const fetchUser = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        const type = userInfo.data.type;
        props.form.setFieldsValue({
            name : userInfo.data.owner.fullname,
            owner_id: userInfo.data.owner.id,
        });
        if(type === TYPE_AGENCY){
            props.form.setFieldsValue({
                taxcode_cmnd: userInfo.data.owner.tax_code,
                belong_to: 1,
            });
        }
        if(type === TYPE_CONTRIBUTOR){
            props.form.setFieldsValue({
                taxcode_cmnd: userInfo.data.owner.passport,
                belong_to: 2,
            });
        }
    };
    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, []);

    const TYPE_AGENCY = 7;
    const TYPE_CONTRIBUTOR = 8;

    return (
        <PageWrapper title="Thêm yêu cầu đào tạo">
            <Form>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label=""
                            name="owner_id"
                            wrapClass="col-md"
                            hidden={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label=""
                            name="belong_to"
                            wrapClass="col-md"
                            hidden={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Người yêu cầu"
                            name="name"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="MST/Số CMND"
                            name="taxcode_cmnd"
                            isRequired={true}
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nội dung đào tạo"
                            name="content_train"
                            isRequired={true}
                            wrapClass="col-md-6"
                            maxLength={255}
                        />
                    </div>
                    <div className="input-group">
                        <SelectDateWithLabel
                            name="training_date"
                            form={props.form}
                            isRequired={true}
                            wrapClass="col-md-3"
                            label="Thời gian đào tạo"
                            rules={[
                                {
                                    validator: function(rule, value, callback) {
                                        if (value && value < moment()) {
                                            callback("Ngày đào tạo phải lớn hơn ngày hiện tại");
                                        } else {
                                            callback();
                                        }
                                    },
                                    message: "Ngày đào tạo phải lớn hơn ngày hiện tại"
                                }
                            ]}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nhân sự tham gia đào tạo"
                            name="personal"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isRequired={true}
                        /><InputWithLabel
                            form={props.form}
                            label="Địa điểm đào tạo"
                            name="location"
                            wrapClass="col-md-6"
                            maxLength={255}
                            isRequired={true}
                        />
                    </div>
                <div className="input-group">
                    <TextAreaWithLabel
                        form={props.form}
                        label="Ghi chú"
                        name="note"
                        wrapClass="col-md-12"
                        rows={4}
                    />
                </div>
            </Form>
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
                            storeRequest(2);
                        }}
                        label="Trình duyệt"
                        className={"btn btn-success btn-sm"}
                    />
                </div>
                <div className="">
                    <ButtonCancel
                        onClick={() => {
                            props.history.push("/yeu-cau-dao-tao");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedRequestTrainingCreate = Form.create<Props>({
    name: "RequestTraining"
})(RequestTraining);

export default WrappedRequestTrainingCreate;
