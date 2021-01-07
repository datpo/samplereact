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
import AntModal from "components/common/modal/AntModal";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import {RequestCertificateGroupService} from "../../services/request-certificate-group/RequestCertificateGroupServices";
import InputFileUpload from "../../components/common/form/input-with-label/InputFileUpload";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import moment from "moment";
import { handleDateData } from '../../helpers/NewCaCrmHelper';

interface Props extends FormComponentProps {
    user: any;
    history: any;
}

const objectDate = {
    1: 'represen_passport_date',
    2: 'provide_date'
};

export const Create: React.FC<Props> = props => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [file, setFile] = useState("");
    const [loadingModal, setLoadingModal] = useState(false);
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [cateServicePackageAmount, setCateServicePackageAmount] = useState([]);
    const [disableCode, setDisableCode] = useState(false);
    const [disableObject, setDisableObject] = useState(true);
    const [disableTypeDevice, setDisableTypeDevice] = useState(false);
    const [typeObject, setTypeObject] = useState(Number);

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
                    }
                    const valuesConvert = handleDateData(val, objectDate);
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

    const onPreviewFile = () => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    setVisibleModal(true);
                    setLoadingModal(true);
                    const val= {
                        ...values,
                        typeFile: 1
                    };
                    const valuesConvert = handleDateData(val, objectDate);
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
    };

    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    const changeObject = async (e)=>{
        setTypeObject(e.target.value);
        if(Number(e.target.value) === 2) {
            setDisableCode(true);
            setDisableTypeDevice(true);
        }else{
            setDisableCode(false);
            setDisableTypeDevice(false);
        }
        let code = props.form.getFieldValue('code');
        const object = e.target.value;
        let result = await fetchInfo(code, object);
        if (Number(e.target.value) === 2 && !result.data){
            onFailAction("Mã số doanh nghiệp chưa tồn tại trong hệ thống!", () => {
                props.form.setFieldsValue({object:`1`.toString()});
                setDisableCode(false);
                setDisableTypeDevice(false);
            }, "warning", "");
        }
    };
    const changeTypeDevice = async (e) =>{
        const type_search = 4;
        const type = typeObject;
        let obj = 3;
        const type_device = e.target.value;
        const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, obj,type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
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
        if (result && result.data){
            props.form.setFieldsValue({
                type_legal: result.data.type_legal.toString(),
                code: result.data.code,
                provide_organization: result.data.provide_organization,
                provide_date: moment(result.data.provide_date),
                tax_code: result.data.tax_code,
                fullname: result.data.fullname,
                address: result.data.address,
                email: result.data.email,
                phone: result.data.phone,
                type_device: result.data.request.type_device.toString(),
                represent_fullname: result.data.represent_fullname,
                represen_passport: result.data.represen_passport,
                represen_passport_date: moment(result.data.represen_passport_date),
                represen_passport_place: result.data.represen_passport_place,
                represen_position: result.data.represen_position,
                represen_email: result.data.represen_email,
                represen_phone: result.data.represen_phone,
                support_register: result.data.request.support_register.toString(),

            });
            if(Number(result.data.request.support_register) === 1){
                props.form.setFieldsValue({
                    sp_fullname: result.data.request.requestsupport.fullname,
                    sp_position: result.data.request.requestsupport.position,
                    sp_email: result.data.request.requestsupport.email,
                    sp_phone: result.data.request.requestsupport.phone,
                });
            }
        }
        loading.stopRunLoading();
        return result;
    };
    return (
        <PageWrapper title="Yêu cầu chứng thư số tổ chức ">
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
                        <RadioWithLabel
                            options={{1: "Token", 2: "HSM"}}
                            label="Thiết bị đầu cuối thuê bao"
                            name="type_device"
                            wrappedClass="col-md-2 select-doi-tuong"
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
                            label="Tải file giấy tờ pháp lý"
                            name="file_legal"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                        <SelectDateWithLabel
                            name="provide_date"
                            form={props.form}
                            isRequired={true}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="provide_organization"
                            isRequired={true}
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
                            label="Số điện thoại"
                            name="phone"
                            wrapClass="col-md-2"
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
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-12"
                            isRequired={true}
                            maxLength={255}
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
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                        <SelectDateWithLabel
                            name="represen_passport_date"
                            form={props.form}
                            isRequired={true}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                        />
                        
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="represen_passport_place"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="represen_position"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="represen_email"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="represen_phone"
                            wrapClass="col-md-3"
                            isRequired={true}
                            maxLength={16}
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
                        <div className="col-md-2" hidden>
                            <label className="invisible">label</label>
                            <button onClick={onPreviewFile} className="btn btn-primary btn-sm form-control">
                                Mẫu DK-01.01
                            </button>
                            <AntModal
                                visible={visibleModal}
                                loading={loadingModal}
                                className="w-75 h-75"
                                bodyStyle={{height: "700px"}}
                                style={{top: "20px"}}
                                onCLickOk={onOkModal}
                            >
                                <iframe
                                    title="Quản lý hợp đồng"
                                    src={`data:application/pdf;base64,${file}`}
                                    height="100%"
                                    width="100%"
                                />
                            </AntModal>
                        </div>
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file đăng ký (DK 01.01)"
                            name="file_register_paper"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
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

const WrappedCreate = Form.create<Props>({
    name: "RequestCreate"
})(Create);

export default WrappedCreate;
