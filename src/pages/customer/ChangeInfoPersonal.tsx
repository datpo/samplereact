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
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import _ from "lodash";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewPersonal: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [typeChange, setTypeChange] = useState(true);
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

    const fetchCustomer = async () => {
        const result = await CustomerServices.getInfo(id,2);
        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.passport,
            fullname: result.data.fullname,
            email: result.data.email,
            is_organization: result.data.is_organization.toString(),
        });

        if (Number(result.data.is_organization) === 1) {
            props.form.setFieldsValue({
                organization_name: result.data.organization_name,
                organization_position: result.data.organization_position,
                organization_department: result.data.organization_department
            });
        }
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
                    const data = await CustomerServices.requestChangeInfoPersonal(val);
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
        <PageWrapper title="Yêu cầu điều chỉnh thông tin CTS cá nhân">
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
                            wrapClass="col-md-5"
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
                            classWrapped="col-md-5"
                            label="Tải file CMND/Hộ chiếu"
                            name="file_passport"
                            form={props.form}
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                        <RadioWithLabel
                            label={"Trường hợp cá nhân thuộc tổ chức doanh nghiệp"}
                            options={{ 1: "Có", 2: "Không"}}
                            name="is_organization"
                            wrappedClass="col-md-4 radio-to-chuc"
                            form={props.form}
                            isRequired={true}
                        />
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
                            isRequired={true}
                            extentionsAllow={['pdf', 'PDF']}
                            accept={".pdf"}
                        />
                    </div>
                    </React.Fragment>
                    ) : (
                        ""
                    )}
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
                                DC 01.02
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

const WrappedPreviewPersonal = Form.create<Props>({
    name: "PreviewPersonal"
})(PreviewPersonal);

export default WrappedPreviewPersonal;
