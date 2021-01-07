import React, {useEffect,useState} from "react";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {match} from "react-router";
import { CustomerServices } from '../../services/customer/CustomerServices';
import InputFileUpload from '../../components/common/form/input-with-label/InputFileUpload';
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";
import { FILE_TYPE_OPTIONS } from "./Enum";
import {loading as loadingHelper} from "components/common/loading/Loading";
import ButtonOnSave from 'components/common/form/button/ButtonOnSave';
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import _ from "lodash";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewOrganization: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [typeChange, setTypeChange] = useState(true);
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});
    const fetchCustomer = async () => {
        const result = await CustomerServices.getInfo(id,1);
        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.code,
            fullname: result.data.fullname,
            email: result.data.email,
            address: result.data.address,
            represent_fullname: result.data.represent_fullname,
        });
    };

    const onChangeContractType = async value =>{
        if (value === "1") {
            setTypeChange(true);
        } else {
            setTypeChange(false);
        }
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
        fetchCustomer();
        getProvince();
        // eslint-disable-next-line
    }, []);
    const onDisplayContractFile = async () => {
        // const agencyService = new AgencyService();
        // const valuesForm = this.props.form.getFieldsValue();
        // this.setState({ loading: true, visible: true });
        // try {
        //   let contract = await agencyService.getAgencyContract(valuesForm);
        //   this.setState({
        //     file: contract.data.file
        //   });
        // } catch (error) {
        //   onFailAction("Có lỗi xảy ra khi xem hợp đồng!");
        // } finally {
        //   this.setState({
        //     loading: false
        //   });
        // }
    };
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
                    const data = await CustomerServices.requestChangeInfoOrganization(val);
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
                            props.history.push("/danh-sach-khach-hang");
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
        <PageWrapper title="Yêu cầu điều chỉnh thông tin CTS tổ chức">
            <Form>
                <Card className="m-r-15-i m-l-15-i" title={<label>Thông tin điều chỉnh</label>} size="small">
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Mã khách hàng"
                            name="uid"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Mã định danh"
                            name="code"
                            wrapClass="col-md-3"
                            maxLength={16}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Người đại diện"
                            name="represent_fullname"
                            wrapClass="col-md-3"
                            isDisabled={false}
                            maxLength={255}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên khách hàng"
                            name="fullname"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={false}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-3"
                            isDisabled={false}
                            maxLength={16}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-3"
                            isDisabled={false}
                            maxLength={255}
                            isRequired={true}
                        />
                        <InputFileUpload
                            classWrapped="col-md-3"
                            label="Tải file CMND/Hộ chiếu người đại diện"
                            name="file_deputy_passport"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
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
                                    onClick={onDisplayContractFile}
                                    className="btn ml-5 mt-4 btn-primary btn-small"
                                    disabled={!typeChange}
                                    hidden={typeChange}
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
                                isRequired={!typeChange}
                                extentionsAllow={['pdf', 'PDF']}
                                accept={".pdf"}
                                isDisabled={typeChange}
                            />
                        }
                    </div>
                </Card>
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
