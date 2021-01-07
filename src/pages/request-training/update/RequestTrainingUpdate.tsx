import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import _ from "lodash";
import { match } from "react-router";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import { loading as loadingHelper } from "components/common/loading/Loading";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import {handleDateData} from "../../../helpers/NewCaCrmHelper";
import {RequestTrainingServices} from "../../../services/request-training/RequestTrainingServices";


interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

const objectDate = {
    1: 'training_date',
};

export const RequestTrainingUpdate: React.FC<Props> = props => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(0);
    const [trainingDate, setTrainingDate] = useState("");
    const [reason, setReason] = useState("");


    const id = props.match.params.id;

    const fetchRequestData = async () => {
        const requestData = await RequestTrainingServices.getRequest(id);
        props.form.setFieldsValue({
            belong_to: requestData.data.belong_to,
            owner_id: requestData.data.owner_id,
            content_train: requestData.data.content_train,
            personal: requestData.data.personal,
            location: requestData.data.location,
        });
        if(Number(requestData.data.belong_to) === 1){
            props.form.setFieldsValue({
                taxcode_cmnd: requestData.data.owner_agency.tax_code,
                name: requestData.data.owner_agency.fullname,
            });
        }else {
            props.form.setFieldsValue({
                taxcode_cmnd: requestData.data.owner_contributor.passport,
                name: requestData.data.owner_contributor.fullname,
            });
        }
        setReason(requestData.data.reason_refuse);
        setTrainingDate(requestData.data.training_date);
        setStatus(requestData.data.status);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequestData();
        // eslint-disable-next-line
    }, []);

    const update = status => {
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loadingHelper.runLoadingBlockUI();
                    const val= {
                        ...values,
                        status,
                        id
                    };
                    const valuesConvert = handleDateData(val, objectDate);
                    const data = await RequestTrainingServices.updateRequest(valuesConvert);
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
                        onSuccessAction("Lưu yêu cầu thành công", () => {
                            props.history.push("/yeu-cau-dao-tao");
                        });
                    }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi cập nhật !");
                } finally {
                    loadingHelper.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    /* eslint eqeqeq: 0 */
    return (
        <PageWrapper title="Cập nhật yêu cầu token CTS" loading={loading}>
            <Form>
                {Number(status) === 3 || Number(status) === 5 ? (
                    <div className="input-group">
                        <InputWithLabel
                            label="Lý do từ chối"
                            form={props.form}
                            name="reason_deny"
                            isDisabled={true}
                            wrapClass="col-md"
                            defaultValue={reason}
                        />
                    </div>
                ) : (
                    ""
                )}

                <div className="input-group">
                    <InputWithLabel
                        form={props.form}
                        label=""
                        name="owner_id"
                        wrapClass="col-md"
                        hidden={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label=""
                        name="belong_to"
                        wrapClass="col-md"
                        hidden={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Người yêu cầu"
                        name="name"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="MST/Số CMND"
                        name="taxcode_cmnd"
                        isRequired={true}
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Nội dung đào tạo"
                        name="content_train"
                        isRequired={true}
                        wrapClass="col-md-6"
                    />
                </div>
                <div className="input-group">
                    <SelectDateWithLabel
                        name="training_date"
                        form={props.form}
                        isRequired={true}
                        wrapClass="col-md-3"
                        label="Thời gian đào tạo"
                        defaultValue={trainingDate ? moment(trainingDate) : null}
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
                        isRequired={true}
                    /><InputWithLabel
                    form={props.form}
                    label="Địa điểm đào tạo"
                    name="location"
                    wrapClass="col-md-6"
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
                            props.history.push("/yeu-cau-dao-tao");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedRequestTrainingUpdate = Form.create<Props>({
    name: "RequestTrainingUpdate"
})(RequestTrainingUpdate);

export default WrappedRequestTrainingUpdate;
