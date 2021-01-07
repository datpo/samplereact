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
import LeadershipInfoRow from "./table-contact/LeadershipInfoRow";

interface Props extends FormComponentProps {
    user: any;
    history: any;
}

export const RequestCertificateGroup: React.FC<Props> = props => {
    const [agencyModel,setAgencyModel] = useState({
        "leaderShip":"",
        "business":"",
        "businessSkill":"",
        "supportCustomer":"",
        "accountant":"",
    });
    const storeRequest = () => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loading.runLoadingBlockUI();
                    const data = await RequestChangeInfoService.storeAgency(values);
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
        const result = await RequestChangeInfoService.getData();
        if (result && result.status === 200){
            setAgencyModel({
                ...agencyModel,
                "leaderShip":result.data.leaderShip,
                "business":result.data.business,
                "businessSkill":result.data.businessSkill,
                "supportCustomer":result.data.supportCustomer,
                "accountant":result.data.accountant,
            });
            props.form.setFieldsValue({
                fullname: result.data.fullname,
                sortname: result.data.sortname,
                code: result.data.code,
                tax_code: result.data.tax_code,
                passport_place: result.data.passport_place,
                deputy: result.data.deputy,
                deputy_position: result.data.deputy_position,
                address: result.data.address,
                email: result.data.email,
                phone: result.data.phone,
                office_address: result.data.office_address,
                field_id: result.data.field_id,
                job: result.data.job,
                personnal_scale: result.data.personnal_scale,
                supply_capacity: result.data.supply_capacity,
                competitive_area: result.data.competitive_area,
                bank_number: result.data.bank_number,
                bank_branch: result.data.bank_branch,
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

    const changeSortName = (e) => {
        const uId = props.form.getFieldValue('tax_code');
        props.form.setFieldsValue({'code':`${uId}_${e.target.value}`});
    };

    return (
        <PageWrapper title="Yêu cầu thay đổi thông tin">
            <Form>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin đại lý</label>} size="small">
                    {/*line 1*/}
                    <div className="input-group">
                        <TextAreaWithLabel
                            label={"Lý do thay đổi thông tin"}
                            form={props.form}
                            wrapClass="col-md-12"
                            name="reason_customer"
                            rows={4}
                            isRequired={true}
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
                            isRequired={true}
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
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                    </div>
                    {/*line 7*/}
                    <div className="input-group mt-3">
                        <div className="col-md-12">
                            <LeadershipInfoRow
                                form={props.form}
                                leaderShipData={agencyModel.leaderShip}
                                accountant={agencyModel.accountant}
                                businessSkillData={agencyModel.businessSkill}
                                businessData={agencyModel.business}
                                supportCustomer={agencyModel.supportCustomer}
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

const WrappedRequestCertificateGroupCreate = Form.create<Props>({
    name: "RequestCertificateGroup"
})(RequestCertificateGroup);

export default WrappedRequestCertificateGroupCreate;
