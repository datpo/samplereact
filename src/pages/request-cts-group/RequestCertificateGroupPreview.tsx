import React, {useEffect, useState} from "react";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import _ from "lodash";
import {match} from "react-router";
import {onFailAction} from "helpers/SwalCommon";
import SelectDateWithLabel from "components/common/form/input-with-label/SelectDateWithLabel";
import moment from "moment";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import {RequestCertificateGroupService} from "../../services/request-certificate-group/RequestCertificateGroupServices";
import {loading} from "../../components/common/loading/Loading";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const RequestCTSPersonalUpdate: React.FC<Props> = props => {
    const id = props.match.params.id;

    const [provideDate, setProvideDate] = useState("");
    const [represenProvideDate, setRepresenProvideDate] = useState("");
    const [status, setStatus] = useState(0);
    const [reason, setReason] = useState("");
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [file, setFile] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [cateServicePackageAmount, setCateServicePackageAmount] = useState([]);
    const [statusReqGen, setStatusReqGen] = useState(false);

    const [isFileDk03, setIsFileDk3] = useState(false);
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

    const onChange = async value => {
        const selectdCate: any = _.find(cateServicePackageAmount, { id: parseInt(value) });
        if(selectdCate){
            props.form.setFieldsValue({ package_price: selectdCate.price });
        }
    };
    const fetchRequestPersonal = async () => {
        const result = await RequestCertificateGroupService.getRequestCertificate(id);

        const province = await RequestCertificateGroupService.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
        const district = await RequestCertificateGroupService.getDistrictByProvince(result.data.province_code);
        setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));

        if(Number(result.data.status) === 5 ){
            setStatusReqGen(true);
        }
        setProvideDate(result.data.organization.provide_date);
        setRepresenProvideDate(result.data.organization.represen_passport_date);
        setReason(result.data.reason);
        setStatus(result.data.status);
        setSecretCode(result.data.secret_code);
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
        });
        if (Number(result.data.object) === 2){
            props.form.setFieldsValue({
                serial_cts : result.data.serial_cts,
                token_type: result.data.token_type.toString()
            })
        }
        if (Number(result.data.support_register) === 1) {
            props.form.setFieldsValue({
                sp_fullname: result.data.requestsupport.fullname,
                sp_position: result.data.requestsupport.position,
                sp_email: result.data.requestsupport.email,
                sp_phone: result.data.requestsupport.phone,
            });
        }

        let arrAll:any = [];
        result.data.list_document.forEach(function (values) {
            arrAll[values.id] = values.type;
        });
        arrAll.forEach(function(item, index, array) {
            if(Number(item) === 7){
                setStatusReqGen(true);
            }
            if(Number(item) === 14){
                setIsFileDk3(true);
            }
        });

        const type_search = 4;
        const type = props.form.getFieldValue("object");
        const object = 3;
        const type_device = props.form.getFieldValue("type_device");
        const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackage(type_search, type, object, type_device);
        setCateServicePackageAmount(data.data);
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
    };
    useEffect(() => {
        fetchRequestPersonal();
        // eslint-disable-next-line
    }, []);
    const STATUS_TU_CHOI = 3;
    const STATUS_DA_DUYET = 4;
    const onViewFileDoc = async type => {
        loading.runLoadingBlockUI();
        try {
            let token = localStorage.getItem("currentUser");
            if (token){
                let obj = JSON.parse(token);
                let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/yeu-cau-chung-thu-so-to-chuc/getFileDoc/${id}/${type}?token=${obj.token}`;
                setFile(link);

            }
        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xem trước file!");
        }
        loading.stopRunLoading();

    };
    return (
        <PageWrapper title="Xem chi tiết yêu cầu chứng thư số đối với tổ chức">
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
                {status === STATUS_DA_DUYET ? (
                    <div className="input-group">
                        {" "}
                        <InputWithLabel
                            label="Mã bảo mật"
                            form={props.form}
                            name="secret_code"
                            isDisabled={true}
                            wrapClass="col-md"
                            defaultValue={secretCode}
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
                            wrapClass="col-md-2"
                            maxLength={16}
                            isDisabled={true}
                        />
                        <RadioWithLabel
                            options={{1: "Cấp mới", 2: "Gia hạn", 3: "Chuyển đổi"}}
                            label="Đối tượng"
                            name="object"
                            wrappedClass="col-md-4 select-doi-tuong"
                            form={props.form}
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
                            isDisabled={true}
                        />
                        <SelectWithLabel
                            options={cateServicePackage}
                            name="package_id"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Gói dịch vụ"}
                            isDisabled={true}
                            onChange={onChange}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Giá bán"
                            name="package_price"
                            wrapClass="col-md-2"
                            isDisabled={true}
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
                            isDisabled={true}
                        />
                        <div className="col-md-3">
                            <label className="hidden">12121</label>
                            <a href = {file} className={"btn btn-outline-primary form-control"} type={"button"} target={"_blank"} rel="noopener noreferrer" onClick={()=>onViewFileDoc(1)}>
                                Xem file pháp lý
                            </a>
                        </div>
                        <SelectDateWithLabel
                            name="provide_date"
                            form={props.form}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                            defaultValue={provideDate ? moment(provideDate) : null}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="provide_organization"
                            wrapClass="col-md-2"
                            maxLength={255}
                            isDisabled={true}
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
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên doanh nghiệp"
                            name="fullname"
                            wrapClass="col-md-4"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            wrapClass="col-md-2"
                            isDisabled={true}
                            maxLength={16}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={255}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-8"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <SelectWithLabel
                            options={province}
                            name="province_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Tỉnh thành"}
                            isDisabled={true}
                        />
                        <SelectWithLabel
                            options={district}
                            name="district_code"
                            wrappedClass="col-md-2"
                            form={props.form}
                            label={"Quận huyện"}
                            isDisabled={true}
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
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số CMND"
                            name="represen_passport"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={16}
                        />
                        <div className="col-md-3">
                            <label className="hidden">12121</label>
                            <a href = {file} className={"btn btn-outline-warning form-control"} type={"button"} target={"_blank"} rel="noopener noreferrer" onClick={()=>onViewFileDoc(2)}>
                                Xem file CMND/Hộ chiếu
                            </a>
                        </div>
                        <SelectDateWithLabel
                            name="represen_passport_date"
                            form={props.form}
                            isDisabled={true}
                            wrapClass="col-md-2"
                            label="Ngày cấp"
                            defaultValue={represenProvideDate ? moment(represenProvideDate) : null}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="represen_passport_place"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="represen_position"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="represen_email"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="represen_phone"
                            wrapClass="col-md-3"
                            isDisabled={true}
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
                            isDisabled={true}
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
                                        isDisabled={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Chức vụ"
                                        name="sp_position"
                                        wrapClass="col-md-3"
                                        isDisabled={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Email"
                                        name="sp_email"
                                        wrapClass="col-md-3"
                                        isDisabled={true}
                                        maxLength={255}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label="Số điện thoại"
                                        name="sp_phone"
                                        wrapClass="col-md-3"
                                        isDisabled={true}
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
                            isDisabled={true}
                        />
                        {status === STATUS_TU_CHOI ?
                            ("") : (
                                <React.Fragment>
                                    <div className="col-md-2">
                                        <label className="invisible">11111998</label>
                                        <a href = {file} className={"btn btn-outline-success form-control"} type={"button"} target={"_blank"} rel="noopener noreferrer" onClick={()=>onViewFileDoc(3)}>
                                            Tải xuống DK-01.01
                                        </a>
                                    </div>
                                </React.Fragment>
                            )
                        }
                        {statusReqGen ? (
                            <div className="col-md-2">
                                <label className="invisible">11111998</label>
                                <a href = {file} className={"btn btn-outline-primary form-control"} type={"button"} target={"_blank"} rel="noopener noreferrer" onClick={()=>onViewFileDoc(4)}>
                                    Tải xuống DK-02
                                </a>
                            </div>

                        ) : ("")
                        }
                        {isFileDk03 ? (
                            <div className="col-md-2">
                                <label className="invisible">11111998</label>
                                <a href = {file} className={"btn btn-outline-warning form-control"} type={"button"} target={"_blank"} rel="noopener noreferrer" onClick={()=>onViewFileDoc(5)}>
                                    Tải xuống DK-03
                                </a>
                            </div>
                        ) : ("")}
                    </div>

                </Card>
            </Form>
            <div className="input-group d-flex justify-content-center p-5 mt-4">
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

const WrappedRequestCTSPersonalUpdate = Form.create<Props>({
    name: "RequestCTSPersonalUpdate"
})(RequestCTSPersonalUpdate);

export default WrappedRequestCTSPersonalUpdate;
