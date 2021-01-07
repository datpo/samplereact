import React, {useEffect, useState} from "react";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import _ from "lodash";
import {match} from "react-router";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {loading, loading as loadingHelper} from "components/common/loading/Loading";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import {RequestCertificateGroupService} from "../../services/request-certificate-group/RequestCertificateGroupServices";
import { handleDateData } from './../../helpers/NewCaCrmHelper';
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";


interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}
const objectDate1 = {
    1: 'represen_passport_date'
};
const objectDate2 = {
    1: 'provide_date'
};
export const RequestCTSGroupUpdate: React.FC<Props> = props => {
    const id = props.match.params.id;

    const onChange = async value => {
        const selectdCate: any = _.find(cateServicePackageAmount, { id: parseInt(value) });
        if(selectdCate){
            props.form.setFieldsValue({ package_price: selectdCate.price });
        }
    };
    const [provideDate, setProvideDate] = useState("");
    const [represenProvideDate, setRepresenProvideDate] = useState("");
    const [status, setStatus] = useState(0);
    const [reason, setReason] = useState("");
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [oldFile, setOldFile] = useState("");
    const [oldFile2, setOldFile2] = useState("");
    const [oldFile3, setOldFile3] = useState("");
    const [cateServicePackageAmount, setCateServicePackageAmount] = useState([]);

    const [file, setFile] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const [isFileDk02, setIsFileDk02] = useState(false);
    const [isFileDk03, setIsFileDk03] = useState(false);

    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

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
                    let valuesConvert = val;
                    if (val.represen_passport_date !== undefined && val.represen_passport_date !== null ){
                        valuesConvert = handleDateData(val, objectDate1);
                    }
                    if (val.provide_date !== undefined && val.provide_date !== null){
                        valuesConvert = handleDateData(valuesConvert, objectDate2);
                    }
                    const data = await RequestCertificateGroupService.update(id, valuesConvert);
                    if (data && Number(data.status) === 422) {
                        onFailAction("Có lỗi xảy ra khi cập nhật !");
                        _.forOwn(data.error, function (errors, key) {
                            props.form.setFields({
                                [key]: {
                                    errors: [new Error(errors.toString())]
                                }
                            });
                        });
                    } else {
                        onSuccessAction("Cập nhập yêu cầu thành công", () => {
                            props.history.push("/yeu-cau-cts-to-chuc");
                        });
                    }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi cập nhật yêu cầu!");
                } finally {
                    loadingHelper.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const fetchRequestPersonal = async () => {
        const result = await RequestCertificateGroupService.getRequestCertificate(id);
        const province = await RequestCertificateGroupService.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
        const district = await RequestCertificateGroupService.getDistrictByProvince(result.data.province_code);
        setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        setProvideDate(result.data.organization.provide_date);
        setRepresenProvideDate(result.data.organization.represen_passport_date);

        result.data.list_document.forEach(function (value) {
            if(value['type'] === 5){
                setOldFile(value['file'].split("/").pop());
            }else if(value['type'] === 6){
                setOldFile2(value['file'].split("/").pop());
            }else if(value['type'] === 3){
                setOldFile3(value['file'].split("/").pop());
            }else if(value['type'] === 7){
                setIsFileDk02(true);
            }else if(value['type'] === 14){
                setIsFileDk03(true);
            }
        });
        setStatus(result.data.status);
        setReason(result.data.reason);

        props.form.setFieldsValue({
            type_legal: result.data.organization.type_legal.toString(),
            code: result.data.organization.code,
            provide_organization: result.data.organization.provide_organization,
            tax_code: result.data.organization.tax_code,
            fullname: result.data.organization.fullname,
            address: result.data.organization.address,
            email: result.data.organization.email,
            phone: result.data.organization.phone,
            object: result.data.object.toString(),
            type_docurment: result.data.type_docurment.toString(),
            type_device: result.data.type_device.toString(),
            package_id: result.data.package_id.toString(),
            package_price: result.data.package_price,
            support_register: result.data.support_register.toString(),
            represent_fullname: result.data.organization.represent_fullname,
            represen_passport: result.data.organization.represen_passport,
            represen_passport_place: result.data.organization.represen_passport_place,
            represen_position: result.data.organization.represen_position,
            represen_email: result.data.organization.represen_email,
            represen_phone: result.data.organization.represen_phone,
            province_code: result.data.province_code.toString(),
            district_code: result.data.district_code.toString(),
            // file:
        });
        if (Number(result.data.object) === 2){
            props.form.setFieldsValue({
                serial_cts: result.data.serial_cts,
                token_type: result.data.token_type.toString(),
            });
        }
        if (Number(result.data.support_register) === 1) {
            props.form.setFieldsValue({
                sp_fullname: result.data.requestsupport.fullname,
                sp_position: result.data.requestsupport.position,
                sp_email: result.data.requestsupport.email,
                sp_phone: result.data.requestsupport.phone,
            });
        }
        const type_search = 4;
        const type = props.form.getFieldValue("object");
        const object = 3;
        const type_device = props.form.getFieldValue("type_device");
        const data = await getCateServicePackage(type_search, type, object, type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
    };
    const getCateServicePackage = async (type_search, type, obj, type_device) =>{
        return await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
    };
    const onChangeTypeDevice = async (e) => {
        const type_search = 4;
        const type = props.form.getFieldValue("object");
        const object = 3;
        const type_device = e.target.value;
        loading.runLoadingBlockUI();
        props.form.setFieldsValue({package_id: undefined});
        props.form.setFieldsValue({package_price: undefined});
        const data = await getCateServicePackage(type_search, type, object, type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
        loading.stopRunLoading();
    };
    const onViewFileDoc = async type => {
        try {
            let token = localStorage.getItem("currentUser");
            if (token){
                let obj = JSON.parse(token);
                let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/yeu-cau-chung-thu-so-to-chuc/getFileDoc/${id}/${type}?token=${obj.token}`;
                window.open(link);
            }

        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xem trước file!");
        }
    };

    const onPreviewFile = async (typeFile) => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    setVisibleModal(true);
                    setLoadingModal(true);
                    const val= {
                        ...values,
                        typeFile: typeFile
                    };

                    let valuesConvert = val;
                    if (val.represen_passport_date !== undefined && val.represen_passport_date !== null ){
                        valuesConvert = handleDateData(val, objectDate1);
                    }
                    if (val.provide_date !== undefined && val.provide_date !== null){
                        valuesConvert = handleDateData(valuesConvert, objectDate2);
                    }
                    const data = await RequestCertificateGroupService.previewFile(valuesConvert);
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
        setFile("");
    };
    const getProvince = ()=>{
        const province = RequestCertificateGroupService.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));

    };
    const onChangeProvince = async (e) =>{
        if(e){
            const district = await RequestCertificateGroupService.getDistrictByProvince(e);
            setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        } else{
            setDistrict({});
        }
        props.form.setFieldsValue({district_code: undefined})
    };
    useEffect(() => {
        getProvince();
        fetchRequestPersonal();
        // eslint-disable-next-line
    }, []);

    const STATUS_TU_CHOI = 3;
    return (
        <PageWrapper title="Cập nhật yêu cầu chứng thư số tổ chức">
            <ModalDisplayFile
                titleModal="File"
                visibleModal={visibleModal}
                loadingModal={loadingModal}
                fileBase64={file}
                onOkModal={()=>onOkModal()}
            />
            <InputWithLabel
                wrapClass={''}
                name={'isUpdate'}
                label={''}
                form={props.form}
                defaultValue={2}
                hidden={true}
            />
            <InputWithLabel
                wrapClass={''}
                name={'id'}
                label={''}
                form={props.form}
                defaultValue={id}
                hidden={true}
            />
            <Form>
                {status === STATUS_TU_CHOI ? (
                    <div className="input-group">
                        {" "}
                        <InputWithLabel
                            label="Lý do từ chối"
                            form={props.form}
                            name="reason-deny"
                            wrapClass="col-md"
                            defaultValue={reason}
                            isDisabled={true}
                        />{" "}
                    </div>
                ) : (
                    ""
                )}
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin gói chứng thư số</label>} size="small">
                    {/*line 1*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Mã số doanh nghiệp"
                            name="code"
                            isRequired={true}
                            wrapClass="col-md-2"
                            maxLength={16}
                        />
                        <RadioWithLabel
                            options={{1: "Cấp mới", 2: "Gia hạn", 3: "Chuyển đổi"}}
                            label="Đối tượng"
                            name="object"
                            wrappedClass="col-md-4 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                            isDisabled={true}
                        />
                        {Number(props.form.getFieldValue("object")) === 2 ? (
                            <React.Fragment>
                                <InputWithLabel
                                    form={props.form}
                                    label="Serial CTS"
                                    name="serial_cts"
                                    wrapClass="col-md-3"
                                    isRequired={true}
                                    isDisabled={true}
                                />
                                <SelectWithLabel
                                    options={{1: "Token mới", 2: "Token cũ"}}
                                    name="token_type"
                                    wrappedClass="col-md-3"
                                    form={props.form}
                                    label={"Loại token"}
                                    isRequired={true}
                                    isDisabled={true}
                                />
                            </React.Fragment>
                        ): ('')}
                        <RadioWithLabel
                            options={{1: "Token", 2: "HSM"}}
                            label="Thiết bị đầu cuối thuê bao"
                            name="type_device"
                            wrappedClass="col-md-2 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                            isDisabled={true}
                            onChange={onChangeTypeDevice}
                        />
                        <SelectWithLabel
                            options={cateServicePackage}
                            name="package_id"
                            wrappedClass="col-md-2 "
                            form={props.form}
                            label={"Gói dịch vụ"}
                            isRequired={true}
                            onChange={onChange}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Giá bán"
                            name="package_price"
                            wrapClass="col-md-2"
                            isRequired={true}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin doanh nghiệp</label>} size="small">
                    {/*line 1*/}
                    <div className="input-group">
                        <RadioWithLabel
                            options={{1: "Giấy ĐKKD", 2: "Giấy phép đầu tư", 3: "Quyết định thành lập"}}
                            label="Giấy tờ pháp lý"
                            name="type_legal"
                            wrappedClass="col-md-5 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file pháp lý"
                            name="file_legal"
                            form={props.form}
                            isRequired={!oldFile}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            onClickDownloadFile={()=>onViewFileDoc(1)}
                        />

                        <SelectDateWithLabel
                            name="provide_date"
                            form={props.form}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                            defaultValue={provideDate ? moment(provideDate) : null}
                            rules={[
                                {
                                    validator: function(rule, value, callback) {
                                        if (value && value > moment()) {
                                            callback("Ngày cấp phải nhỏ hơn ngày hiện tại");
                                        } else {
                                            callback();
                                        }
                                    },
                                    message: "Ngày cấp phải nhỏ hơn ngày hiện tại"
                                }
                            ]}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="provide_organization"
                            wrapClass="col-md-2"
                            maxLength={255}
                        />
                    </div>
                    {/*line2*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="MST (nếu có)"
                            name="tax_code"
                            wrapClass="col-md-2"
                            maxLength={16}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên doanh nghiệp"
                            name="fullname"
                            wrapClass="col-md-4"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-2"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            wrapClass="col-md-4"
                            isRequired={true}
                            maxLength={16}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-8"
                            maxLength={255}
                        />
                        <SelectWithLabel
                            options={province}
                            name="province_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Tỉnh thành"}
                            isRequired={true}
                            onChange={onChangeProvince}
                        />
                        <SelectWithLabel
                            options={district}
                            name="district_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Quận huyện"}
                            isRequired={true}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Người đại diện </label>} size="small">
                    {/*line 1*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Họ và tên"
                            name="represent_fullname"
                            wrapClass="col-md-4"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số CMND"
                            name="represen_passport"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={16}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file CMND/Hộ chiếu"
                            name="file_deputy_passport"
                            form={props.form}
                            isRequired={!oldFile2}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                            onClickDownloadFile={()=>onViewFileDoc(2)}
                        />
                        <SelectDateWithLabel
                            name="represen_passport_date"
                            form={props.form}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                            defaultValue={represenProvideDate ? moment(represenProvideDate) : null}
                            rules={[
                                {
                                    validator: function(rule, value, callback) {
                                        if (value && value > moment()) {
                                            callback("Ngày cấp phải nhỏ hơn ngày hiện tại");
                                        } else {
                                            callback();
                                        }
                                    },
                                    message: "Ngày cấp phải nhỏ hơn ngày hiện tại"
                                }
                            ]}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="represen_passport_place"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="represen_position"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="represen_email"
                            wrapClass="col-md-3"
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="represen_phone"
                            wrapClass="col-md-3"
                            maxLength={16}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Đăng ký hỗ trợ khẩn cấp</label>} size="small">
                    <div>
                        <RadioWithLabel
                            options={{1: "Có", 2: "Không"}}
                            name="support_register"
                            wrappedClass="col-md-12 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                        />
                    </div>
                    {props.form.getFieldValue("support_register") === "1" ? (
                        <React.Fragment>
                            <div className="input-group">
                                <div className="input-group">
                                    <InputWithLabel
                                        form={props.form}
                                        label="Họ tên đầu mối"
                                        name="sp_fullname"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Chức vụ"
                                        name="sp_position"
                                        wrapClass="col-md-3"
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Email"
                                        name="sp_email"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Số điện thoại"
                                        name="sp_phone"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={16}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        ""
                    )}
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Mẫu đăng ký</label>} size="small">
                    <div className="input-group">
                        <RadioWithLabel
                            options={{1: "Điện tử", 2: "Giấy", 3: "Scan"}}
                            label="Loại hồ sơ"
                            name="type_docurment"
                            wrappedClass="col-md-3 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                        />
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() => onPreviewFile(1)} className="btn btn-outline-success form-control">
                                Tải xuống DK-01.01
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() => onPreviewFile(2)} className="btn btn-outline-primary form-control">
                                Tải xuống DK-02
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() => onPreviewFile(3)} className="btn btn-outline-primary form-control">
                                Tải xuống DK-03
                            </button>
                        </div>
                    </div>
                    <div className="input-group">
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK 01.02"
                            name="file_register_paper"
                            form={props.form}
                            isRequired={!oldFile3}
                            onClickDownloadFile={() => onViewFileDoc(3)}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-02"
                            name="file_dk_02"
                            form={props.form}
                            onClickDownloadFile={isFileDk02 ? () => onViewFileDoc(4) : ''}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-03"
                            name="file_dk_03"
                            form={props.form}
                            onClickDownloadFile={isFileDk03 ? () => onViewFileDoc(5) : ''}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                    </div>
                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-4">
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
                            props.history.push("/yeu-cau-cts-to-chuc");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedRequestCTSGroupUpdate = Form.create<Props>({
    name: "RequestCTSPersonalUpdate"
})(RequestCTSGroupUpdate);

export default WrappedRequestCTSGroupUpdate;
