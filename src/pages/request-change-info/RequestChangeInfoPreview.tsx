import React, {useEffect, useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {TextAreaWithLabel} from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import {loading} from "components/common/loading/Loading";
import {onFailAction} from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import {RequestChangeInfoService} from "../../services/request-change-info/RequestChangeInfoService";
import moment from "moment";
import {match} from "react-router";
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}
export const RequestChangeInfo: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [status, setStatus] = useState();
    const getData = async () => {
        loading.runLoadingBlockUI();
        const result = await RequestChangeInfoService.find(id);
        if (result && result.status === 200){
            setStatus(result.data.status);
            let detail = result.data.change_info_detail_contributor;
            props.form.setFieldsValue({
                reason_customer: result.data.reason_customer,
                reason_newca: result.data.reason_newca,
                status: result.data.status,
                fullname: detail.fullname,
                sortname: detail.sortname,
                code: detail.code,
                passport: detail.passport,
                passport_date: moment(detail.passport_date),
                passport_place: detail.passport_place,
                birthday: moment(detail.birthday),
                phone: detail.phone,
                email: detail.email,
                address: detail.address,
                job: detail.job,
                cooperate_capacity: detail.cooperate_capacity,
                supply_capacity: detail.supply_capacity,
                competitive_area: detail.competitive_area,
                provider_list: detail.provider_list,
            });
            loading.stopRunLoading();
        }else{
            onFailAction('Có lỗi xảy ra!');
        }
    };
    
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);
    const [modalFilePassport, setModalFilePassport] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [filePassPort, setFilePassPort] = useState("");
    const onViewFilePassport = async () => {
        try {
            setModalFilePassport(true);
            setLoadingModal(true);
            const result = await RequestChangeInfoService.getFilePassport(id);
            if (result && result.status === 200){
                setFilePassPort(result.base64);
            } else {
                onFailAction('Có lỗi xảy ra!');
            }
        } finally {
            setLoadingModal(false);
        }
    };
    const onOkModalPassPort = () => {
        setModalFilePassport(false);
    };
    return (
        <PageWrapper title="Xem chi tiết yêu cầu thay đổi thông tin">
            <ModalDisplayFile
                titleModal="File CMND/Hộ chiếu"
                visibleModal={modalFilePassport}
                loadingModal={loadingModal}
                fileBase64={filePassPort}
                onOkModal={onOkModalPassPort}
            />
            <Form>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin cộng tác viên</label>} size="small">
                    {props.form.getFieldValue('reason_newca') && Number(status) ? (
                        <div className="input-group">
                            <InputWithLabel
                                form={props.form}
                                label="Lý do từ chối của nghiệp vụ"
                                name="reason_newca"
                                wrapClass="col-md-12 text-danger"
                                maxLength={255}
                                isDisabled={true}
                            />
                        </div>
                    ):""}
                    {/*line 1*/}
                    <div className="input-group">
                        <TextAreaWithLabel
                            label={"Lý do thay đổi thông tin"}
                            form={props.form}
                            wrapClass="col-md-12"
                            name="reason_customer"
                            rows={4}
                            isDisabled={true}
                        />
                    </div>
                    {/*line 2*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Tên cộng tác viên"
                            name="fullname"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Mã cộng tác viên"
                            name="code"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên viết tắt"
                            name="sortname"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="CMND"
                            name="passport"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={16}
                            isDisabled={true}
                        />
                    </div>
                    {/*line 3*/}
                    <div className="input-group">
                        {/*<InputFileUpload*/}
                        {/*    classWrapped="col-md-3"*/}
                        {/*    label="Tải file CMND (pdf)"*/}
                        {/*    name="file"*/}
                        {/*    form={props.form}*/}
                        {/*    extentionsAllow={['pdf']}*/}
                        {/*    accept={".pdf"}*/}
                        {/*    onClickDownloadFile={onViewFilePassport}*/}
                        {/*    isDisabled={true}*/}
                        {/*/>*/}
                        <div className={"col-md-3 mt-4 text-center"}>
                            <button onClick={onViewFilePassport} className="btn btn-primary btn-sm form-control">
                                Xem file CMND
                            </button>
                        </div>
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="passport_place"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <SelectDateWithLabel
                            name="passport_date"
                            form={props.form}
                            isRequired={true}
                            wrapClass="col-md-3"
                            label="Ngày cấp"
                            isDisabled={true}
                        />
                        <SelectDateWithLabel
                            name="birthday"
                            form={props.form}
                            isRequired={true}
                            wrapClass="col-md-3"
                            label="Ngày sinh"
                            isDisabled={true}
                        />
                    </div>
                    {/*line 4*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={16}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Ngành nghề chính"
                            name="job"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                    </div>
                    {/*line 5*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Khả năng hợp tác"
                            name="cooperate_capacity"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Năng lực cung cấp CTS/tháng"
                            name="supply_capacity"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Khu vực thị trường"
                            name="competitive_area"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Hợp tác với nhà cung cấp nào khác"
                            name="provider_list"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                    </div>
                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-5">
                <div className="">
                    <ButtonCancel
                        onClick={() => {
                            props.history.push("/yeu-cau-thay-doi-thong-tin");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedRequestChangeInfoView = Form.create<Props>({
    name: "RequestChangeInfo"
})(RequestChangeInfo);

export default WrappedRequestChangeInfoView;
