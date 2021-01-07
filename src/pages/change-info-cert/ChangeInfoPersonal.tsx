import React, {useEffect,useState} from "react";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {match} from "react-router";
import InputFileUpload from '../../components/common/form/input-with-label/InputFileUpload';
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";
import { FILE_TYPE_OPTIONS } from "./Enum";
import {loading as loadingHelper} from "components/common/loading/Loading";
import ButtonOnSave from 'components/common/form/button/ButtonOnSave';
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import _ from "lodash";
import { ChangeInfoCertServices } from './../../services/change-info-cert/ChangeInfoCertServices';
import AntModal from "components/common/modal/AntModal";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";


interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewPersonal: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [typeChange, setTypeChange] = useState(true);
    const [isOrganization, setIsOrganization] = useState(true);
    const [oldFile, setOldFile] = useState("");
    const [oldFile2, setOldFile2] = useState("");
    const [oldFile3, setOldFile3] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [file, setFile] = useState("");
    const [status, setStatus] = useState(0);
    const [reason, setReason] = useState("");
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

    const fetchCustomer = async () => {
        const result = await ChangeInfoCertServices.getInfo(id);

        const provinces = await RequestDigitalCertificatePersonalServices.getProvince();
        setProvince(_.mapValues(_.keyBy(provinces, "newtel_code"), "fullname"));
        const districts = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(result.data.province_code);
        setDistrict(_.mapValues(_.keyBy(districts, "newtel_district_code"), "fullname"));

        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.code,
            fullname: result.data.fullname,
            email: result.data.email,
            contact_name: result.data.contact_name,
            contact_position: result.data.contact_position,
            contact_phone: result.data.contact_phone,
            contact_mobile: result.data.contact_mobile,
            contact_email: result.data.contact_email,
            contact_fax: result.data.contact_fax,
            contact_address: result.data.contact_address,
            change_type: result.data.type_change.toString(),
            organization_name: result.data.or_company,
            organization_position: result.data.or_position,
            organization_department: result.data.or_department,
            is_organization: result.data.or_is.toString(),
            province_code: result.data.province_code.toString(),
            district_code: result.data.district_code.toString(),
        });
        setStatus(result.data.status);
        setReason(result.data.reason);
        setOldFile(result.data.file_passport.split("/").pop());
        setOldFile2(result.data.file_company.split("/").pop());
        setOldFile3(result.data.file_change.split("/").pop());

        if (result.data.type_change.toString() === "1") {
            setTypeChange(true);
        } else {
            setTypeChange(false);
        }
        if (result.data.or_is.toString() === "1") {
            setIsOrganization(false);
        } else {
            setIsOrganization(true);
        }
    };
    const onOkModal = () => {
        setVisibleModal(false);
    };

    const changeSelectOrganization = () => {
        var e = props.form.getFieldValue('is_organization');
        if (e === "2") {
            setIsOrganization(false);
        } else {
            setIsOrganization(true);
        }
    }

    const onViewFileDoc = async type => {
        try {
            setVisibleModal(true);
            setLoadingModal(true);
            const data = await ChangeInfoCertServices.getFileChange(id, type);
            setFile(data.base64);
        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xem trước file!");
            setVisibleModal(false);
        } finally {
            setLoadingModal(false);
        }
    };

    const onChangeContractType = async value =>{
        if (value === "1") {
            setTypeChange(true);
        } else {
            setTypeChange(false);
        }
    };
    const onChangeProvince = async (e) =>{
        if(e){
            const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(e);
            setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        }
    };
    useEffect(() => {
        fetchCustomer();
        // eslint-disable-next-line
    }, []);
    const update = status => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loadingHelper.runLoadingBlockUI();
                    const val= {
                        ...values,
                        status
                    };
                    const data = await ChangeInfoCertServices.requestChangeInfoPersonal(id,val);
                    if (data && Number(data.status) === 422) {
                        onFailAction("Có lỗi xảy ra khi yêu cầu !");
                        _.forOwn(data.error, function (errors, key) {
                            props.form.setFields({
                                [key]: {
                                    errors: [new Error(errors.toString())]
                                }
                            });
                        });
                    } else {
                        onSuccessAction("Yêu cầu thành công", () => {
                            props.history.push("/danh-sach-dieu-chinh-thong-tin");
                        });
                    }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra!");
                } finally {
                    loadingHelper.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };

    return (
        <PageWrapper title="cập nhật Yêu cầu điều chỉnh thông tin cá nhân">
            <Form>
                <Card className="m-r-15-i m-l-15-i" title={<label>Thông tin điều chỉnh</label>} size="small">
                    {status === 2 ? (
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
                        <InputWithLabel
                            form={props.form}
                            label="Mã khách hàng"
                            name="uid"
                            wrapClass="col-md-2"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="CMND/ Hộ chiếu"
                            name="code"
                            wrapClass="col-md-2"
                            maxLength={16}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên khách hàng"
                            name="fullname"
                            wrapClass="col-md-6"
                            maxLength={255}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-2"
                            isDisabled={false}
                            maxLength={16}
                            isRequired={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-4"
                            label="Tải file CMND/Hộ chiếu"
                            name="file_passport"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            isRequired={!oldFile}
                            onClickDownloadFile={()=>onViewFileDoc(4)}
                        />
                        <RadioWithLabel
                            label={"Trường hợp cá nhân thuộc tổ chức doanh nghiệp"}
                            options={{ 1: "Có", 2: "Không"}}
                            name="is_organization"
                            wrappedClass="col-md-4 radio-to-chuc"
                            form={props.form}
                            isRequired={true}
                            onChange={()=> changeSelectOrganization()}
                        />
                        <React.Fragment>
                            <div className="input-group" hidden={isOrganization}>
                                <InputWithLabel
                                    form={props.form}
                                    label="Tên tổ chức"
                                    name="organization_name"
                                    wrapClass="col-md-3"
                                    isRequired={isOrganization}
                                    maxLength={255}
                                />
                                <InputWithLabel
                                    form={props.form}
                                    label="Tên phòng ban"
                                    name="organization_department"
                                    wrapClass="col-md-3"
                                    maxLength={255}
                                />
                                <InputWithLabel
                                    form={props.form}
                                    label="Chức vụ"
                                    name="organization_position"
                                    wrapClass="col-md-3"
                                    maxLength={255}
                                />
                                <InputFileUpload
                                    classWrapped="col-md-3"
                                    label="File xác nhận tổ chức"
                                    name="organization_file"
                                    form={props.form}
                                    extentionsAllow={['pdf', 'PDF']}
                                    accept={".pdf"}
                                    isRequired={!oldFile2}
                                    onClickDownloadFile={()=>onViewFileDoc(5)}
                                />
                            </div>
                        </React.Fragment>
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-1" title={<label>Thông tin liên hệ</label>} size="small">
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Họ và tên"
                            name="contact_name"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="contact_position"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={false}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="contact_phone"
                            wrapClass="col-md-3"
                            maxLength={20}
                            minLength={9}
                            isDisabled={false}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số di động"
                            name="contact_mobile"
                            wrapClass="col-md-3"
                            maxLength={20}
                            minLength={9}
                            isDisabled={false}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="contact_email"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Fax"
                            name="contact_fax"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={false}
                        />
                        <SelectWithLabel
                            options={province}
                            name="province_code"
                            wrappedClass="col-md-3"
                            form={props.form}
                            label={"Tỉnh thành"}
                            isRequired={true}
                            onChange={onChangeProvince}
                        />
                        <SelectWithLabel
                            options={district}
                            name="district_code"
                            wrappedClass="col-md-3"
                            form={props.form}
                            label={"Quận huyện"}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="contact_address"
                            wrapClass="col-md-6"
                            maxLength={255}
                            isDisabled={false}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-1" title={<label>File điều chỉnh thông tin</label>} size="small">
                    <div className="input-group">
                        <SelectWithLabel
                            options={FILE_TYPE_OPTIONS}
                            form={props.form}
                            label="Loại điều chỉnh"
                            name="change_type"
                            isRequired={true}
                            wrappedClass="col-md-2"
                            defaultValue={""}
                            isDisabled={false}
                            placeholder="Chọn loại điều chỉnh"
                            onChange={onChangeContractType}
                        />
                        {typeChange === true ?
                            <div className="form-group col-md-2">
                                <button
                                    onClick={()=>onViewFileDoc(3)}
                                    className="btn ml-5 mt-4 btn-primary btn-small"
                                    disabled={!typeChange}
                                >
                                    DC 01.02
                                </button>
                            </div>
                            :
                            <InputFileUpload
                                classWrapped="col-md-4"
                                label="File yêu cầu điều chỉnh thông tin"
                                name="file_change_info"
                                form={props.form}
                                extentionsAllow={['pdf', 'PDF']}
                                accept={".pdf"}
                                isDisabled={typeChange}
                                isRequired={!oldFile3}
                                onClickDownloadFile={()=>onViewFileDoc(3)}
                            />
                        }
                    </div>
                </Card>
            </Form>
            <AntModal
                visible={visibleModal}
                loading={loadingModal}
                className="w-75 h-75"
                bodyStyle={{height: "700px"}}
                style={{top: "20px"}}
                onCLickOk={onOkModal}
            >
                <iframe
                    title="File giấy tờ"
                    src={`data:application/pdf;base64,${file}`}
                    height="100%"
                    width="100%"
                />
            </AntModal>
            <div className="input-group d-flex justify-content-center p-5 mt-4">
                <div className="">
                    <ButtonOnSave
                        onClick={() => {
                            update(1);
                        }}
                        label="Trình duyệt"
                        className={"btn btn-success btn-sm"}
                    />
                </div>
                <div className="">
                    <ButtonCancel
                        onClick={() => {
                            props.history.goBack();
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedPreviewPersonal = Form.create<Props>({
    name: "PreviewPersonal"
})(PreviewPersonal);

export default WrappedPreviewPersonal;
