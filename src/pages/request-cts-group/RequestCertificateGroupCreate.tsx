import React, {useEffect, useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import {loading} from "components/common/loading/Loading";
import _ from "lodash";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import {RequestCertificateGroupService} from "../../services/request-certificate-group/RequestCertificateGroupServices";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import moment from "moment";
import { handleDateData } from './../../helpers/NewCaCrmHelper';
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";

interface Props extends FormComponentProps {
    user: any;
    history: any;
}

const objectDate1 = {
    1: 'represen_passport_date'
};
const objectDate2 = {
    1: 'provide_date'
};

export const RequestCertificateGroup: React.FC<Props> = props => {
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [cateServicePackageAmount, setCateServicePackageAmount] = useState([]);
    const [disableCode, setDisableCode] = useState(false);
    const [disableObject, setDisableObject] = useState(true);
    const [typeObject, setTypeObject] = useState(Number);

    const [file, setFile] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});
    const [disableField, setDisableField] = useState(false);
    const [disableTypeDevice, setDisableTypeDevice] = useState(false);

    const onChange = async value => {
        const selectdCate: any = _.find(cateServicePackageAmount, { id: parseInt(value) });
        if(selectdCate){
            props.form.setFieldsValue({ package_price: selectdCate.price });
        }
    };

    const storeRequest = status => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loading.runLoadingBlockUI();
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

                    const data = await RequestCertificateGroupService.store(valuesConvert);
                    if (data && Number(data.status) === 422) {
                        _.forOwn(data.error, function (errors, key) {
                            props.form.setFields({
                                [key]: {
                                    errors: [new Error(errors.toString())]
                                }
                            });
                        });
                    } else if (data && Number(data.status) === 200) {
                        onSuccessAction("Lưu yêu cầu thành công", () => {
                            props.history.push("/yeu-cau-cts-to-chuc");
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

    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    const changeObject = async (e)=>{
        setTypeObject(e.target.value);
        let code = props.form.getFieldValue('code');
        let object = e.target.value;
        let result = await fetchInfo(code, object);
        if (Number(e.target.value) === 2 ){
            if (Number(result.status) === 101){
                onFailAction("Mã định danh không tồn tại trong hệ thống!", () => {
                    props.form.setFieldsValue({object:`1`.toString()});
                    setDisableCode(false);
                }, "warning", "");
            }else {
                setDisableCode(true);
            }
        }
        if(Number(e.target.value) === 2 && result.data) {
            setDisableCode(true);
        }else{
            setDisableCode(false);
        }
        if(Number(e.target.value) === 1 || Number(e.target.value) === 2 || Number(e.target.value) === 3){
            setTypeObject(props.form.getFieldValue("object"));
            let type_search = 4;
            let type = props.form.getFieldValue("object");
            let obj = 3;
            let type_device = props.form.getFieldValue("type_device");
            const catePackage = await getCateServicePackage(type_search, type, obj, type_device);
            setCateServicePackageAmount(catePackage.data);
            setCateServicePackage(_.mapValues(_.keyBy(catePackage.data, "id"), "name"));
        }
        props.form.setFieldsValue({
            package_id: '',
            package_price: ''
        });
    };
    const getCateServicePackage = async (type_search, type, obj, type_device) =>{
        return  await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
    };
    const changeTypeDevice = async (e) =>{
        const type_search = 4;
        const type = typeObject;
        let obj = 3;
        const type_device = e.target.value;
        const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
        props.form.setFieldsValue({
            package_id: '',
            package_price: ''
        });
    };
    const changeCode = async (e) =>{
        if (e.target.value){
            setDisableObject(false);
        }else{
            setDisableObject(true);
            props.form.setFields({"object": ''});
        }
    };

    const fetchInfo = async (code, object) => {
        loading.runLoadingBlockUI();
        const result = await RequestCertificateGroupService.getInfo(code, object);
        if (Number(object) === 1 || Number(object) === 3){
            if (result && result.data){
                props.form.setFieldsValue({
                    type_legal: result.data.type_legal.toString(),
                    code: result.data.code,
                    provide_organization: result.data.provide_organization,
                    tax_code: result.data.tax_code,
                    fullname: result.data.fullname,
                    address: result.data.address,
                    email: result.data.email,
                    phone: result.data.phone,
                    type_device: result.data.request.type_device.toString(),
                    represent_fullname: result.data.represent_fullname,
                    represen_passport: result.data.represen_passport,
                    represen_passport_place: result.data.represen_passport_place,
                    represen_position: result.data.represen_position,
                    represen_email: result.data.represen_email,
                    represen_phone: result.data.represen_phone,
                    support_register: result.data.request.support_register.toString(),

                });
                if(result.data.represen_passport_date){
                    props.form.setFieldsValue({
                        represen_passport_date: moment(result.data.represen_passport_date)
                    })
                }
                if(result.data.provide_date){
                    props.form.setFieldsValue({
                        provide_date: moment(result.data.provide_date)
                    })
                }
                if(Number(result.data.request.support_register) === 1){
                    props.form.setFieldsValue({
                        sp_fullname: result.data.request.requestsupport.fullname,
                        sp_position: result.data.request.requestsupport.position,
                        sp_email: result.data.request.requestsupport.email,
                        sp_phone: result.data.request.requestsupport.phone,
                    });
                }
            }
        }
        loading.stopRunLoading();
        return result;
    };

    const getProvince = async () => {
        const province = await RequestCertificateGroupService.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
    };
    const onChangeProvince = async (e) =>{
        if(e){
            const district = await RequestCertificateGroupService.getDistrictByProvince(e);
            setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        }

    };
    const onChangeAdjourn = async e =>{
        if (e){
            loading.runLoadingBlockUI();
            const identity_code = props.form.getFieldValue("code");
            const dataRequestCert = await RequestCertificateGroupService.getRequestBySerial(e.target.value, identity_code);
            if(dataRequestCert.status === 200){
                if (dataRequestCert.data.status === 2){
                    onFailAction("Chứng thư số đang chờ thu hồi!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 3){
                    onFailAction("Chứng thư số đã thu hồi!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 4){
                    onFailAction("Chứng thư số đang chờ hủy!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 5){
                    onFailAction("Chứng thư số đã hủy!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 6){
                    onFailAction("Chứng thư số đang chờ dừng!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 7){
                    onFailAction("Chứng thư số đã dừng!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 8){
                    onFailAction("Chứng thư số đã xóa!!!", () => {
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 1 || dataRequestCert.data.status === 9){
                    setDisableField(false);
                    props.form.setFieldsValue({
                        type_legal: dataRequestCert.data.requestcertificate.organization.type_legal.toString(),
                        code: dataRequestCert.data.requestcertificate.organization.code,
                        provide_organization: dataRequestCert.data.requestcertificate.organization.provide_organization,
                        tax_code: dataRequestCert.data.requestcertificate.organization.tax_code,
                        fullname: dataRequestCert.data.requestcertificate.organization.fullname,
                        address: dataRequestCert.data.requestcertificate.organization.address,
                        email: dataRequestCert.data.requestcertificate.organization.email,
                        phone: dataRequestCert.data.requestcertificate.organization.phone,

                        type_device: dataRequestCert.data.requestcertificate.type_device.toString(),

                        represent_fullname: dataRequestCert.data.requestcertificate.organization.represent_fullname,
                        represen_passport: dataRequestCert.data.requestcertificate.organization.represen_passport,
                        represen_passport_place: dataRequestCert.data.requestcertificate.organization.represen_passport_place,
                        represen_position: dataRequestCert.data.requestcertificate.organization.represen_position,
                        represen_email: dataRequestCert.data.requestcertificate.organization.represen_email,
                        represen_phone: dataRequestCert.data.requestcertificate.organization.represen_phone,
                        support_register: dataRequestCert.data.requestcertificate.support_register.toString(),

                    });
                    if(Number(dataRequestCert.data.requestcertificate.support_register) === 1){
                        props.form.setFieldsValue({
                            sp_fullname: dataRequestCert.data.requestcertificate.requestsupport.fullname,
                            sp_position: dataRequestCert.data.requestcertificate.requestsupport.position,
                            sp_email: dataRequestCert.data.requestcertificate.requestsupport.email,
                            sp_phone: dataRequestCert.data.requestcertificate.requestsupport.phone,
                        });
                    }
                    if(dataRequestCert.data.requestcertificate.organization.represen_passport_date){
                        props.form.setFieldsValue({
                            represen_passport_date: moment(dataRequestCert.data.requestcertificate.organization.represen_passport_date)
                        })
                    }
                    if(dataRequestCert.data.requestcertificate.organization.provide_date){
                        props.form.setFieldsValue({
                            provide_date: moment(dataRequestCert.data.requestcertificate.organization.provide_date)
                        })
                    }
                    setDisableTypeDevice(true);
                    let type_search = 4;
                    let type = props.form.getFieldValue("object");
                    let obj = 3;
                    let type_device = dataRequestCert.data.requestcertificate.type_device.toString();
                    const catePackage = await getCateServicePackage(type_search, type, obj, type_device);
                    setCateServicePackageAmount(catePackage.data);
                    setCateServicePackage(_.mapValues(_.keyBy(catePackage.data, "id"), "name"));
                }
            }
            if (Number(dataRequestCert.status) === 102){
                onFailAction("Serial chứng thư số không phù hợp!!!", () => {
                    props.form.setFieldsValue({
                        serial_cts : ''
                    });
                }, "warning", "");
            }
            if (dataRequestCert.status === 103){
                if (dataRequestCert.data.status === 2){
                    onFailAction("Chứng thư số đang chờ thu hồi!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 3){
                    onFailAction("Chứng thư số đã thu hồi!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 4){
                    onFailAction("Chứng thư số đang chờ hủy!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 5){
                    onFailAction("Chứng thư số đã hủy!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 6){
                    onFailAction("Chứng thư số đang chờ dừng!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 7){
                    onFailAction("Chứng thư số đã dừng!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 8){
                    onFailAction("Chứng thư số đã xóa!!!", () => {
                        setDisableField(true);
                        props.form.setFieldsValue({
                            serial_cts : ''
                        });
                    }, "warning", "");
                }
                if (dataRequestCert.data.status === 1 || dataRequestCert.data.status === 9){
                    setDisableField(false);
                    props.form.setFieldsValue({
                        type_device: dataRequestCert.data.requestcertificate.type_device.toString(),
                    });
                    setDisableTypeDevice(true);
                    let type_search = 4;
                    let type = props.form.getFieldValue("object");
                    let obj = 3;
                    let type_device = dataRequestCert.data.requestcertificate.type_device.toString();
                    const catePackage = await getCateServicePackage(type_search, type, obj, type_device);
                    setCateServicePackageAmount(catePackage.data);
                    setCateServicePackage(_.mapValues(_.keyBy(catePackage.data, "id"), "name"));
                }
            }
            if (dataRequestCert.status === 101){
                onFailAction("Không tồn tại chứng thư số phù hợp với serial!!!", () => {
                    props.form.setFieldsValue({
                        serial_cts : ''
                    });
                }, "warning", "");
            }
        }
    };
    useEffect(() => {
        getProvince();
        // eslint-disable-next-line
    }, []);
    return (
        <PageWrapper title="Yêu cầu chứng thư số tổ chức ">
            <ModalDisplayFile
                titleModal="File DK-02"
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
                defaultValue={1}
                hidden={true}
            />
            <Form>
                <Card className="m-r-15-i m-l-15-i mt-2" title={<label>Thông tin gói chứng thư số</label>} size="small">
                    {/*line 1*/}
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Mã số doanh nghiệp"
                            name="code"
                            isRequired={true}
                            wrapClass="col-md-2"
                            maxLength={16}
                            onChange={changeCode}
                            isDisabled={disableCode}
                        />
                        <RadioWithLabel
                            options={{1: "Cấp mới", 2: "Gia hạn", 3: "Chuyển đổi"}}
                            label="Đối tượng"
                            name="object"
                            wrappedClass="col-md-4 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                            onChange={changeObject}
                            isDisabled={disableObject}
                        />
                        {Number(props.form.getFieldValue("object")) === 2 ? (
                            <React.Fragment>
                                <InputWithLabel
                                    form={props.form}
                                    label="Serial CTS"
                                    name="serial_cts"
                                    wrapClass="col-md-3"
                                    isRequired={true}
                                    onBlur={onChangeAdjourn}
                                />
                                <SelectWithLabel
                                    options={{1: "Token mới", 2: "Token cũ"}}
                                    name="token_type"
                                    wrappedClass="col-md-3"
                                    form={props.form}
                                    label={"Loại token"}
                                    isRequired={true}
                                    isDisabled={disableField}
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
                            onChange={changeTypeDevice}
                            isDisabled={disableTypeDevice}
                        />
                        <SelectWithLabel
                            options={cateServicePackage}
                            name="package_id"
                            wrappedClass="col-md-2 nopadding-left"
                            form={props.form}
                            label={"Gói dịch vụ"}
                            isRequired={true}
                            onChange={onChange}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Giá bán"
                            name="package_price"
                            wrapClass="col-md-2"
                            isRequired={true}
                            isDisabled={disableField}
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
                            isDisabled={disableField}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file giấy tờ pháp lý"
                            name="file_legal"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            isDisabled={disableField}
                            note={true}
                        />
                        <SelectDateWithLabel
                            name="provide_date"
                            form={props.form}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
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
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="provide_organization"
                            wrapClass="col-md-2"
                            maxLength={255}
                            isDisabled={disableField}
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
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên doanh nghiệp"
                            name="fullname"
                            wrapClass="col-md-4"
                            isRequired={true}
                            maxLength={255}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            wrapClass="col-md-2"
                            isRequired={true}
                            maxLength={16}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-4"
                            isRequired={true}
                            maxLength={255}
                            isDisabled={disableField}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-8"
                            maxLength={255}
                            isDisabled={disableField}
                        />
                        <SelectWithLabel
                            options={province}
                            name="province_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Tỉnh thành"}
                            isRequired={true}
                            onChange={onChangeProvince}
                            isDisabled={disableField}
                        />
                        <SelectWithLabel
                            options={district}
                            name="district_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Quận huyện"}
                            isRequired={true}
                            isDisabled={disableField}
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
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số CMND"
                            name="represen_passport"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={16}
                            isDisabled={disableField}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file CMND/Hộ chiếu"
                            name="file_deputy_passport"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            isDisabled={disableField}
                            note={true}
                        />
                        <SelectDateWithLabel
                            name="represen_passport_date"
                            form={props.form}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
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
                            isDisabled={disableField}
                        />

                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="represen_passport_place"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="represen_position"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="represen_email"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={disableField}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="represen_phone"
                            wrapClass="col-md-3"
                            maxLength={16}
                            isDisabled={disableField}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Đăng ký hỗ trợ khẩn cấp</label>} size="small">
                    <div>
                        <RadioWithLabel
                            options={{1: "Có", 2: "Không"}}
                            label="Đăng ký hỗ trợ khẩn cấp"
                            name="support_register"
                            wrappedClass="col-md-12 select-doi-tuong"
                            form={props.form}
                            isRequired={true}
                            isDisabled={disableField}
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
                                        isDisabled={disableField}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Chức vụ"
                                        name="sp_position"
                                        wrapClass="col-md-3"
                                        maxLength={255}
                                        isDisabled={disableField}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Email"
                                        name="sp_email"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                        isDisabled={disableField}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Số điện thoại"
                                        name="sp_phone"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={16}
                                        isDisabled={disableField}
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
                            isDisabled={disableField}
                        />
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() =>onPreviewFile(1)} className="btn btn-outline-success form-control">
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
                    <div className='input-group'>
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-01.01 (Đã ký)"
                            name="file_register_paper"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            warning={true}
                            note={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-02 (Nếu có)"
                            name="file_dk_02"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            note={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-03 (Đã ký)"
                            name="file_dk_03"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            isDisabled={disableField}
                            note={true}
                        />
                    </div>
                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-5">
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
                            props.history.push("/yeu-cau-cts-to-chuc");
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
