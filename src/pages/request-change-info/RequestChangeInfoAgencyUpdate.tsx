import React, {useEffect, useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {TextAreaWithLabel} from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import {loading} from "components/common/loading/Loading";
import _ from "lodash";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RequestChangeInfoService} from "../../services/request-change-info/RequestChangeInfoService";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import {match} from "react-router";
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";
import LeadershipInfoRow from "./table-contact/LeadershipInfoRow";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}
export const RequestChangeInfo: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [leaderShip,setLeaderShip] = useState({"name":"", "email":"", "position":"", "phone":"",});
    const [business,setBusiness] = useState({"name":"", "email":"", "position":"", "phone":"",});
    const [businessSkill,setBusinessSkill] = useState({"name":"", "email":"", "position":"", "phone":"",});
    const [supportCustomer,setSupportCustomer] = useState({"name":"", "email":"", "position":"", "phone":"",});
    const [accountant,setAccountant] = useState({"name":"", "email":"", "position":"", "phone":"",});
    const [status, setStatus] = useState();
    
    const storeRequest = () => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loading.runLoadingBlockUI();
                    const data = await RequestChangeInfoService.updateAgency({...values, id});
                    if (data && data.status === 422) {
                        _.forOwn(data.error, function (errors, key) {
                            props.form.setFields({
                                [key]: {
                                    errors: [new Error(errors.toString())]
                                }
                            });
                        });
                    } else if (data && data.status === 200) {
                        onSuccessAction("Lưu yêu cầu thành công", () => {
                            props.history.push("/yeu-cau-thay-doi-thong-tin");
                        });
                    }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra !");
                } finally {
                    loading.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const getData = async () => {
        loading.runLoadingBlockUI();
        const result = await RequestChangeInfoService.find(id);
        if (result && result.status === 200){
            setStatus(result.data.status);
            let detail = result.data.change_info_detail_agency;
            setLeaderShip({...leaderShip, "phone":detail.co_phone,"position":detail.co_position, "email":detail.co_email,"name":detail.co_fullname});
            setBusiness({...business, "phone":detail.bu_phone,"position":detail.bu_position, "email":detail.bu_email,"name":detail.bu_fullname});
            setBusinessSkill({...businessSkill, "phone":detail.tech_phone,"position":detail.tech_position, "email":detail.tech_email,"name":detail.tech_fullname});
            setSupportCustomer({...supportCustomer, "phone":detail.ma_phone,"position":detail.ma_position, "email":detail.ma_email,"name":detail.ma_fullname});
            setAccountant({...accountant, "phone":detail.ac_phone,"position":detail.ac_position, "email":detail.ac_email,"name":detail.ac_fullname});
            props.form.setFieldsValue({
                fullname: detail.fullname,
                sortname: detail.sortname,
                code: detail.code,
                tax_code: detail.tax_code,
                passport_place: detail.passport_place,
                deputy: detail.deputy,
                deputy_position: detail.deputy_position,
                address: detail.address,
                email: detail.email,
                phone: detail.phone,
                office_address: detail.office_address,
                field_id: detail.field_id,
                job: detail.job,
                personnal_scale: detail.personnal_scale,
                supply_capacity: detail.supply_capacity,
                competitive_area: detail.competitive_area,
                bank_number: detail.bank_number,
                bank_branch: detail.bank_branch,
                reason_newca: result.data.reason_newca,
                reason_customer: result.data.reason_customer,
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
    
    const changeSortName = (e) => {
        const uId = props.form.getFieldValue('tax_code');
        props.form.setFieldsValue({'code':`${uId}_${e.target.value}`});
    };
    return (
        <PageWrapper title="Cập nhật yêu cầu thay đổi thông tin">
            <ModalDisplayFile
                titleModal="File CMND/Hộ chiếu"
                visibleModal={modalFilePassport}
                loadingModal={loadingModal}
                fileBase64={filePassPort}
                onOkModal={onOkModalPassPort}
            />
            <Form>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin đại lý</label>} size="small">
                    {props.form.getFieldValue('reason_newca')  && Number(status) === 2 ? (
                        <div className="input-group">
                            <InputWithLabel
                                form={props.form}
                                label="Lý do từ chối của nghiệp vụ"
                                name="reason_newca"
                                wrapClass="col-md-12"
                                maxLength={255}
                                isDisabled={true}
                                rules={[
                                    {
                                        validator: function(rule, value, callback) {
                                            if (value.trim() === "") {
                                                callback("Lý do thay đổi thông tin không được bỏ trống!");
                                            } else {
                                                callback();
                                            }
                                        },
                                        message: "Lý do thay đổi thông tin không được bỏ trống!"
                                    }
                                ]}
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
                            isRequired={true}
                        />
                    </div>
                    {/*line 2*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Tên đại lý"
                            name="fullname"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Mã đại lý"
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
                            onChange={changeSortName}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Mã số thuế"
                            name="tax_code"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={16}
                            isDisabled={true}
                        />
                    </div>
                    {/*line 3*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Người đại diện"
                            name="deputy"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ người đại diện"
                            name="deputy_position"
                            isRequired={true}
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            isRequired={false}
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                    </div>
                    {/*line 4*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Trụ sở chính"
                            name="office_address"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Lĩnh vực kinh doanh"
                            name="field_id"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Quy mô nhân sự"
                            name="personnal_scale"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                    </div>
                    {/*line 5*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Năng lực cung cấp chứng thư số/tháng"
                            name="supply_capacity"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isRequired={false}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Khu vực"
                            name="competitive_area"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số tài khoản ngân hàng"
                            name="bank_number"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chi nhánh"
                            name="bank_branch"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                    </div>
                    {/*line 6*/}
                    <div className="input-group">
                        <InputFileUpload
                            classWrapped="col-md-12"
                            label="Tải file ĐKKD (pdf)"
                            name="file"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            onClickDownloadFile={onViewFilePassport}
                        />
                    </div>
                    {/*line 7*/}
                    <div className="input-group mt-3">
                        <div className="col-md-12">
                            <LeadershipInfoRow
                                form={props.form}
                                leaderShipData={leaderShip}
                                accountant={accountant}
                                businessSkillData={businessSkill}
                                businessData={business}
                                supportCustomer={supportCustomer}
                            />
                        </div>
                    </div>
                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-5">
                <div className="">
                    <ButtonOnSave
                        onClick={() => {
                            storeRequest();
                        }}
                        label="Gửi yêu cầu"
                        className={"btn btn-success btn-sm"}
                    />
                </div>
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

const WrappedRequestChangeInfoUpdate = Form.create<Props>({
    name: "RequestChangeInfo"
})(RequestChangeInfo);

export default WrappedRequestChangeInfoUpdate;
