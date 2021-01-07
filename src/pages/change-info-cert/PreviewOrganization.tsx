import React, {useEffect,useState} from "react";
import {Card, Form, Tag} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {match} from "react-router";
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";
import { FILE_TYPE_OPTIONS } from "./Enum";
import {onFailAction,} from "helpers/SwalCommon";
import { ChangeInfoCertServices } from './../../services/change-info-cert/ChangeInfoCertServices';
import AntModal from "components/common/modal/AntModal";
import {Table as AntTable} from "antd";
import TableActionButton from './../../components/common/table/action-button/TableActionButton';
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import _ from "lodash";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewOrganization: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [file, setFile] = useState("");
    const [customerCert, setCustomerCert] = useState([]);
    const [status, setStatus] = useState(0);
    const [reason, setReason] = useState("");
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});

    const fetchCustomer = async () => {
        const result = await ChangeInfoCertServices.getInfo(id);

        const province = await RequestDigitalCertificatePersonalServices.getProvince();
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
        setCustomerCert(result.data.list_change_cert_by_user);

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

    const onOkModal = () => {
        setVisibleModal(false);
    };
    useEffect(() => {
        fetchCustomer();
        // eslint-disable-next-line
    }, []);

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickGenCert={
                    () => props.history.push(`info-certificate/gen/${record.id}`)
                }
            />
        );
    };

    const columns = [
        {
            title: "SubjectDN",
            dataIndex: "cert.subjectDN"
        },
        {
            title: "Serial CTS",
            dataIndex: "cert.certificateSerial"
        },
        {
            title: 'Đối tượng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.cert.object) === 1){
                        return <p>Cấp mới</p>;
                    }else if(Number(e.cert.object) === 2){
                        return <p>Gia hạn</p>;
                    }else{
                        return <p>Thay đổi thông tin</p>;
                    }
                }
            }
        },
        {
            title: 'Loại  thiết bị',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.cert.type) === 1){
                        return <p>Token</p>;
                    }else{
                        return <p>HSM</p>;
                    }
                }
            }
        },
        {
            title: "Mã bảo mật",
            dataIndex: "secret_code"
        },
        {
            title: 'Trạng thái',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.status) === 1){
                        return <Tag color="green">Chờ Gen Cert</Tag>;
                    }else{
                        return <p>Đã gen</p>;
                    }
                }
            }
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];

    const renderRowClass = () => {
        return "table-extra-info";
    };

    return (
        <PageWrapper title="Xem chi tiết Yêu cầu điều chỉnh thông tin tổ chức">
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
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Mã định danh"
                            name="code"
                            wrapClass="col-md-2"
                            maxLength={16}
                            isDisabled={true}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Người đại diện"
                            name="represent_fullname"
                            wrapClass="col-md-2"
                            isDisabled={true}
                            maxLength={255}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên khách hàng"
                            name="fullname"
                            wrapClass="col-md-5"
                            maxLength={255}
                            isDisabled={true}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={16}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                            isRequired={true}
                        />
                        <div className="col-md-3">
                            <label className="hidden">label</label>
                            <button className="btn btn-outline-primary form-control" onClick={()=>onViewFileDoc(1)}>Xem file CMND/Hộ chiếu người đại diện</button>
                        </div>
                        <div className="col-md-3">
                            <label className="hidden">label</label>
                            <button className="btn btn-outline-primary form-control" onClick={()=>onViewFileDoc(2)}>Xem file giấy tờ pháp lý</button>
                        </div>
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
                            isDisabled={true}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="contact_position"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="contact_phone"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số di động"
                            name="contact_mobile"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="contact_email"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                            isRequired={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Fax"
                            name="contact_fax"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <SelectWithLabel
                            options={province}
                            name="province_code"
                            wrappedClass="col-md-3"
                            form={props.form}
                            label={"Tỉnh thành"}
                            isDisabled={true}
                        />
                        <SelectWithLabel
                            options={district}
                            name="district_code"
                            wrappedClass="col-md-3"
                            form={props.form}
                            label={"Quận huyện"}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="contact_address"
                            wrapClass="col-md-6"
                            maxLength={255}
                            isDisabled={true}
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
                            isDisabled={true}
                            placeholder="Chọn loại điều chỉnh"
                        />
                        <div className="col-md-3">
                            <label className="hidden">label</label>
                            <button className="btn btn-outline-primary form-control" onClick={()=>onViewFileDoc(3)}>File yêu cầu điều chỉnh thông tin</button>
                        </div>
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Danh sách chứng thư số cần gen Cert</label>} size="small">
                    <AntTable
                        columns={columns}
                        style={{width: "100%"}}
                        dataSource={customerCert}
                        pagination={false}
                        rowKey={'id'}
                        rowClassName={renderRowClass}
                        bordered
                    />
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
