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
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import moment from "moment";
import { handleDateData } from './../../helpers/NewCaCrmHelper';
import ModalDisplayFile from "../../components/common/modal/display-file/ModalDisplayFile";

interface Props extends FormComponentProps {
    user: any;
    history: any;
    defaultFileLabel?: string;
    isUpdateForm?: boolean;
    onClickDownloadFile?: any;
    disable?: boolean;
}
const objectDate = {
    1: 'passport_date',
};

export const RequestCTSPersonal: React.FC<Props> = props => {
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [cateServicePackageAmount, setCateServicePackageAmount] = useState([]);
    const [disableCode, setDisableCode] = useState(false);
    const [disableObject, setDisableObject] = useState(true);
    const [disableTypeDevice, setDisableTypeDevice] = useState(false);
    const [typeObject, setTypeObject] = useState(Number);
    const [isOrgan, setIsOrgan] = useState(Number);

    const [file, setFile] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

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
                    const valuesConvert = handleDateData(val, objectDate);
                    const data = await RequestDigitalCertificatePersonalServices.store(valuesConvert);
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
                            props.history.push("/yeu-cau-cts-ca-nhan");
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
    const generateFile = async (typeFile) => {
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
                    const valuesConvert = handleDateData(val, objectDate);
                    const data = await RequestDigitalCertificatePersonalServices.generateFile(valuesConvert);
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

    const onChange = async value => {
        const selectedCate: any = _.find(cateServicePackageAmount, {id: parseInt(value)});
        props.form.setFieldsValue({package_price: selectedCate ? selectedCate.price : ''});
    };

    const onChangeIsOrgan = async (e) => {
        setIsOrgan(e.target.value);
        if(Number(props.form.getFieldValue('object')) === 2){
            let type_search = 4;
            let type = props.form.getFieldValue("object");
            let obj = 1;
            let type_device = props.form.getFieldValue("type_device");
            if(Number(e.target.value) === 1){
                obj = 2
            }
            const catePackage = await getCateServicePackage(type_search, type, obj, type_device);
            setCateServicePackageAmount(catePackage.data);
            setCateServicePackage(_.mapValues(_.keyBy(catePackage.data, "id"), "name"));
            
        }else{
            props.form.setFieldsValue({
                type_device: '',
            });
            setCateServicePackage('');
        }
        props.form.setFieldsValue({
            package_id:'',
            package_price: ''
        })
    };
    const changeObject = async (e)=>{
        setTypeObject(e.target.value);
        let passport = props.form.getFieldValue('passport');
        const object = e.target.value;
        let result = await fetchInfo(passport, object);
        if (Number(e.target.value) === 2 && !result.data){
            onFailAction("CMND/Hộ chiếu chưa tồn tại trong hệ thống!", () => {
                props.form.setFieldsValue({object:`1`.toString()});
                setDisableCode(false);
                setDisableTypeDevice(false);
            }, "warning", "");
        }
        if(Number(e.target.value) === 1 || Number(e.target.value) === 2 || Number(e.target.value) === 3){
            setTypeObject(props.form.getFieldValue("object"));
            let type_search = 4;
            let type = props.form.getFieldValue("object");
            let obj = 1;
            let type_device = props.form.getFieldValue("type_device");
            if(Number(props.form.getFieldValue("is_organization")) === 1){
                obj = 2
            }
            const catePackage = await getCateServicePackage(type_search, type, obj, type_device);
            setCateServicePackageAmount(catePackage.data);
            setCateServicePackage(_.mapValues(_.keyBy(catePackage.data, "id"), "name"));
        }
        if(Number(e.target.value) === 2){
            setDisableCode(true);
            setDisableTypeDevice(true);
        } else {
            setDisableCode(false);
            setDisableTypeDevice(false);
        }
        props.form.setFieldsValue({
            package_id:'',
            package_price: ''
        });

    };
    const getCateServicePackage = async (type_search, type, obj, type_device) =>{
        const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
        return data;
    };

    const changeTypeDevice = async (e) =>{
        loading.runLoadingBlockUI();
        const type_search = 4;
        const type = typeObject;
        let obj = 1;
        const type_device = e.target.value;
        if(Number(isOrgan )=== 1){
            obj = 2
        }
        const data = await getCateServicePackage(type_search, type, obj,type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
        props.form.setFieldsValue({
            package_id:'',
            package_price: ''
        });
        loading.stopRunLoading();
    };

    const changeCode = async (e) =>{
        if (e.target.value){
            setDisableObject(false);
        }else{
            setDisableObject(true);
            props.form.setFields({"object": ''});
        }
    };
    const fetchInfo = async (passport, objetc) => {
        loading.runLoadingBlockUI();
        const result = await RequestDigitalCertificatePersonalServices.getInfo(passport, objetc);
        if (result && result.data){
            props.form.setFieldsValue({
                passport: result.data.passport,
                passport_place: result.data.passport_place.toString(),
                fullname: result.data.fullname.toString(),
                phone: result.data.phone,
                email: result.data.email,
                address: result.data.address,
                tax_code: result.data.tax_code,
                passport_date: moment(result.data.passport_date),
                is_organization: result.data.is_organization.toString(),
                support_register: result.data.request.support_register.toString(),
                type_device: result.data.request.type_device.toString(),
            });
            if (Number(result.data.request.support_register) === 1){
                props.form.setFieldsValue({
                    phone_support: result.data.request.requestsupport.phone,
                    email_support: result.data.request.requestsupport.email,
                    fullname_support: result.data.request.requestsupport.fullname,
                    position_support: result.data.request.requestsupport.positon,
                });
            }
            if (Number(result.data.is_organization) === 1) {
                props.form.setFieldsValue({
                    organization_name: result.data.organization_name,
                    organization_department: result.data.organization_department,
                    organization_tax_code: result.data.organization_tax_code,
                    organization_position: result.data.organization_position,
                    organization_email: result.data.organization_email,
                    organization_phone: result.data.organization_phone,
                    organization_address: result.data.organization_address,
                });
            }
        }
        loading.stopRunLoading();
        return result;
    };

    const getProvince = async () => {
        const province = await RequestDigitalCertificatePersonalServices.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
    };
    const onChangeProvince = async (e) =>{
        if(e){
            const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(e);
            setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        }

    };
    useEffect(() => {
        getProvince();
        // eslint-disable-next-line
    }, []);
    return (
        <PageWrapper title="Tạo Yêu cầu CTS cá nhân ">
            <Form>
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
                    defaultValue={1}
                    hidden={true}
                />
                <Card className="m-r-15-i m-l-15-i"
                      title={<label>Trường hợp cá nhân thuộc tổ chức doanh nghiệp </label>} size="small">
                    <div className="input-group">
                        <div className=" input-group">
                            <RadioWithLabel
                                label={""}
                                options={{1: "Có", 2: "Không"}}
                                name="is_organization"
                                wrappedClass="col-md-4 radio-to-chuc"
                                form={props.form}
                                isRequired={true}
                                onChange={onChangeIsOrgan}
                            />
                        </div>
                        {props.form.getFieldValue("is_organization") === "1" ? (
                            <React.Fragment>
                                <div className="input-group">
                                    <InputWithLabel
                                        form={props.form}
                                        label="Tên tổ chức"
                                        name="organization_name"
                                        wrapClass="col-md-3"
                                        isRequired={true}
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
                                        label="MST tổ chức/doanh nghiệp"
                                        name="organization_tax_code"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={16}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Chức vụ"
                                        name="organization_position"
                                        wrapClass="col-md-3"
                                        maxLength={255}
                                    />

                                </div>
                                <div className="input-group">
                                    <InputWithLabel
                                        form={props.form}
                                        label="Email"
                                        name="organization_email"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Số điện thoại"
                                        name="organization_phone"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={16}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Địa chỉ tổ chức/doanh nghiệp"
                                        name="organization_address"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputFileUpload
                                        defaultLabel={props.defaultFileLabel}
                                        classWrapped="col-md-3"
                                        label="File xác nhận"
                                        name="organization_file"
                                        form={props.form}
                                        isRequired={!props.isUpdateForm}
                                        isDisabled={props.disable}
                                        onClickDownloadFile={props.onClickDownloadFile}
                                        extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                                        accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                                    />

                                </div>
                            </React.Fragment>
                        ) : (
                            ""
                        )}


                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Đăng ký dịch vụ chứng thư số</label>}
                      size="small">
                    <div className="input-group">
                        <div className="input-group">
                            <InputWithLabel
                                form={props.form}
                                label="Số CMND/Hộ chiếu cá nhân"
                                name="passport"
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
                                wrappedClass="col-md-4 select-doi-tuong pr-0"
                                form={props.form}
                                isRequired={true}
                                onChange={changeObject}
                                isDisabled={disableObject}
                            />
                            <RadioWithLabel
                                options={{1: "Token", 2: "HSM"}}
                                label="Loại thiết bị đầu cuối thuê bao"
                                name="type_device"
                                wrappedClass="col-md-2 select-doi-tuong nopadding-left"
                                form={props.form}
                                isRequired={true}
                                isDisabled={disableTypeDevice}
                                onChange={changeTypeDevice}
                            />
                            <SelectWithLabel
                                options={cateServicePackage}
                                name="package_id"
                                wrappedClass="col-md-2 nopadding-left"
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
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Thông tin cá nhân đăng ký</label>} size="small">
                    <div className="input-group">
                        <div className="input-group">
                            <InputWithLabel
                                form={props.form}
                                label="Nơi cấp"
                                name="passport_place"
                                isRequired={true}
                                wrapClass="col-md-2"
                                maxLength={255}
                            />
                            <SelectDateWithLabel
                                name="passport_date"
                                form={props.form}
                                isRequired={true}
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
                            />
                            <InputWithLabel
                                form={props.form}
                                label="MST (nếu có)"
                                name="tax_code"
                                wrapClass="col-md-2"
                                maxLength={16}
                            />
                            <InputFileUpload
                                defaultLabel={props.defaultFileLabel}
                                classWrapped="col-md-6"
                                label="File CMND/Hộ chiếu"
                                name="passport_file"
                                form={props.form}
                                isRequired={!props.isUpdateForm}
                                isDisabled={props.disable}
                                onClickDownloadFile={props.onClickDownloadFile}
                                extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                                accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                            />
                        </div>
                        <div className="input-group">
                            <InputWithLabel
                                form={props.form}
                                label="Họ tên cá nhân"
                                name="fullname"
                                wrapClass="col-md-4"
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
                            <InputWithLabel
                                form={props.form}
                                label="Email"
                                name="email"
                                wrapClass="col-md-4"
                                isRequired={true}
                                maxLength={255}
                            />
                        </div>
                        <div className="input-group">
                            <RadioWithLabel
                                options={{1: "Có đăng ký", 2: "Không đăng ký"}}
                                label="ĐK hỗ trợ khẩn cấp"
                                name="support_register"
                                wrappedClass="col-md-4 radio_register_support"
                                form={props.form}
                                isRequired={true}
                            />
                            <InputWithLabel
                                form={props.form}
                                label="Địa chỉ thường trú"
                                name="address"
                                wrapClass="col-md-4"
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
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4"
                      title={<label>Đăng ký sử dụng dịch vụ hỗ trợ trường hợp khẩn cấp (nếu cần) </label>} size="small">
                    {props.form.getFieldValue("support_register") === "1" ? (
                        <React.Fragment>
                            <div className="input-group">
                                <div className="input-group">
                                    <InputWithLabel
                                        form={props.form}
                                        label="Họ tên đầu mối"
                                        name="fullname_support"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Chức vụ"
                                        name="position_support"
                                        wrapClass="col-md-3"
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Email"
                                        name="email_support"
                                        wrapClass="col-md-3"
                                        isRequired={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Số điện thoại"
                                        name="phone_support"
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
                            <button onClick={() => generateFile(1)} className="btn btn-outline-success form-control">
                                Tải xuống DK-01.02
                            </button>

                        </div>
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() => generateFile(2)} className="btn btn-outline-primary form-control">
                                Tải xuống DK-02
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="invisible">11111998</label>
                            <button onClick={() => generateFile(3)} className="btn btn-outline-primary form-control">
                                Tải xuống DK-03
                            </button>
                        </div>
                    </div>
                    <div className='input-group'>
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-01.02 (Đã ký)"
                            name="file_register_paper"
                            form={props.form}
                            warning={true}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-02 (Nếu có)"
                            name="file_dk_02"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file DK-03 (Đã ký) (Nếu có)"
                            name="file_dk_03"
                            form={props.form}
                            extentionsAllow={['pdf', 'PDF', 'png', 'jpg']}
                            accept={[".pdf", ".png", ".jpg", ".jpeg"]}
                        />
                    </div>
                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-4">
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
                            props.history.push("/yeu-cau-cts-ca-nhan");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedRequestCTSPersonalCreate = Form.create<Props>({
    name: "RequestCTSPersonal"
})(RequestCTSPersonal);

export default WrappedRequestCTSPersonalCreate;
