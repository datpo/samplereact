import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import _ from "lodash";
import { match } from "react-router";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import ButtonOnSave from "../../../components/common/form/button/ButtonOnSave";
import DenyButton from "../../../components/common/form/button/DenyButton";
import {UserServices} from "../../../services/user/UserServies";
import ModalDeny from "../../../components/common/form/ModalDeny";
import {RequestTrainingServices} from "../../../services/request-training/RequestTrainingServices";
import { checkPermission } from "helpers/NewCaCrmHelper";

const per_confirm = 'confirm-request-training'
interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const RequestTrainingPreview: React.FC<Props> = props => {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(0);
    const [userType, setUserType] = useState(0);
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

    const [modalDeny, setModalDeny] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        base64: "",
        type_file: "",
        reason: "",
        error_reason: "",
    });

    const approvalRequest = async () => {
        const result = await RequestTrainingServices.approvalRequest(id);
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
                props.history.push("/yeu-cau-dao-tao");
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

        const result = await RequestTrainingServices.denyRequest(data);
        await setModalDeny({...modalDeny, 'visible_modal_deny': false });

        if (result && Number(result.status) === 200) {
            onSuccessAction("Từ chối yêu cầu thành công!", () => {
                props.history.push("/yeu-cau-dao-tao");
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
        fetchRequestData();
        fetchUser();
        // eslint-disable-next-line
    }, []);

    return (
        <PageWrapper title="Xem chi tiết yêu cầu" loading={loading}>
            <Form>
                <ModalDeny
                    visible={modalDeny.visible_modal_deny}
                    handleCancel={handleModalDenyCancel}
                    handleDeny={confirmDeny}
                    value={modalDeny.reason}
                    onChange={onChangeDataDeny}
                    error={modalDeny.error_reason}
                />
                {Number(status) === 3 || Number(status) === 5 ? (
                    <div className="input-group">
                        {" "}
                        <InputWithLabel
                            label="Lý do từ chối"
                            form={props.form}
                            name="reason_deny"
                            isDisabled={true}
                            wrapClass="col-md"
                            defaultValue={reason}
                        />{" "}
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
                        wrapClass="col-md-3"
                        isDisabled={true}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Nội dung đào tạo"
                        name="content_train"
                        wrapClass="col-md-6"
                        isDisabled={true}
                    />
                </div>
                <div className="input-group">
                    <SelectDateWithLabel
                        name="training_date"
                        form={props.form}
                        wrapClass="col-md-3"
                        label="Thời gian đào tạo"
                        isDisabled={true}
                        defaultValue={trainingDate ? moment(trainingDate) : null}
                    />
                    <InputWithLabel
                        form={props.form}
                        label="Nhân sự tham gia đào tạo"
                        name="personal"
                        wrapClass="col-md-3"
                        isDisabled={true}
                    /><InputWithLabel
                    form={props.form}
                    label="Địa điểm đào tạo"
                    name="location"
                    isDisabled={true}
                    wrapClass="col-md-6"
                />
                </div>
                <div className="input-group">
                    <TextAreaWithLabel
                        form={props.form}
                        label="Ghi chú"
                        name="note"
                        wrapClass="col-md-12"
                        rows={4}
                        isDisabled={true}
                    />
                </div>
            </Form>
            {Number(status) === 2 && Number(userType) === 6 ? (
                <div className="input-group d-flex justify-content-center p-5">
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
                                props.history.push("/yeu-cau-dao-tao");
                            }}
                            className={"btn btn-default btn-sm"}
                        />
                    </div>
                </div>
            ) : (
                <div className="input-group d-flex justify-content-center p-5">
                    <div className="">
                        <ButtonCancel
                            onClick={() => {
                                props.history.push("/yeu-cau-dao-tao");
                            }}
                            className={"btn btn-default btn-sm"}
                        />
                    </div>
                </div>
            )}

        </PageWrapper>
    );
};

const WrappedRequestTrainingPreview = Form.create<Props>({
    name: "RequestTrainingPreview"
})(RequestTrainingPreview);

export default WrappedRequestTrainingPreview;
