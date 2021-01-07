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
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import _ from "lodash";
import { ChangeInfoCertServices } from './../../services/change-info-cert/ChangeInfoCertServices';
import AntModal from "components/common/modal/AntModal";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewOrganization: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [typeChange, setTypeChange] = useState(true);
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

        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
        const districts = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(result.data.province_code);
        setDistrict(_.mapValues(_.keyBy(districts, "newtel_district_code"), "fullname"));
        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.code,
            fullname: result.data.fullname,
            represent_fullname: result.data.represent_fullname,
            email: result.data.email,
            address: result.data.address,
            contact_name: result.data.contact_name,
            contact_position: result.data.contact_position,
            contact_phone: result.data.contact_phone,
            contact_mobile: result.data.contact_mobile,
            contact_email: result.data.contact_email,
            contact_fax: result.data.contact_fax,
            contact_address: result.data.contact_address,
            change_type: result.data.type_change.toString(),
            province_code: result.data.province_code.toString(),
            district_code: result.data.district_code.toString(),
        });
        setStatus(result.data.status);
        setReason(result.data.reason);
        setOldFile(result.data.file_present_passport.split("/").pop());
        setOldFile2(result.data.file_legal.split("/").pop());
        setOldFile3(result.data.file_change.split("/").pop());
        if (result.data.type_change.toString() === "1") {
            setTypeChange(true);
        } else {
            setTypeChange(false);
        }
    };

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
    }
    const onOkModal = () => {
        setVisibleModal(false);
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
                    const data = await ChangeInfoCertServices.requestChangeInfoOrganization(id,val);
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
        <PageWrapper title="Cập nhật Yêu cầu điều chỉnh thông tin tổ chức">
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
                            label="Mã định danh"
                            name="code"
                            wrapClass="col-md-2"
                            maxLength={16}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Người đại diện"
                            name="represent_fullname"
                            wrapClass="col-md-2"
                            isDisabled={false}
                            maxLength={255}
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
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-4"
                            isDisabled={false}
                            maxLength={255}
                            isRequired={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file CMND/Hộ chiếu người đại diện"
                            name="file_deputy_passport"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            isRequired={!oldFile}
                            onClickDownloadFile={()=>onViewFileDoc(1)}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file giấy tờ pháp lý"
                            name="file_legal"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            isRequired={!oldFile2}
                            onClickDownloadFile={()=>onViewFileDoc(2)}
                        />
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
                                    DC 01.01
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
            </Form>
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

const WrappedPreviewOrganization = Form.create<Props>({
    name: "PreviewOrganization"
})(PreviewOrganization);

export default WrappedPreviewOrganization;
