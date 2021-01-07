import React, {useEffect, useState} from "react";
import {Card, Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import PageWrapper from "pages/wrapper/PageWrapper";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import {match} from "react-router";
import { CustomerServices } from './../../services/customer/CustomerServices';
import { STATUS_CERT_LABEL } from './Enum';
import {Table as AntTable} from "antd";
import ModalDeny from './../../components/common/form/ModalDeny';
import { onSuccessAction,onFailAction } from 'helpers/SwalCommon';
import moment from "moment";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import _ from "lodash";
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewOrganization: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [customerCert, setCustomerCert] = useState([]);
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});
    const [modalAction, setModalAction] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        id: "",
        type: "",
        reason: "",
        error_reason: "",
    });

    const fetchRequestPersonal = async () => {
        const result = await CustomerServices.getInfo(id,1);
        const province = await RequestDigitalCertificatePersonalServices.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
        const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(result.data.request.province_code);
        setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.code,
            fullname: result.data.fullname,
            type: 'Tổ chức',
            email: result.data.email,
            phone: result.data.phone,
            address: result.data.address,
            represent_fullname: result.data.represent_fullname,
            represen_passport: result.data.represen_passport,
            represen_passport_place: result.data.represen_passport_place,
            represen_position: result.data.represen_position,
            represen_phone: result.data.represen_phone,
            province_code: result.data.request.province_code.toString(),
            district_code: result.data.request.district_code.toString(),
        });
        setCustomerCert(result.data.list_cert);
    };

    useEffect(() => {
        fetchRequestPersonal();
        // eslint-disable-next-line
    }, []);

    const renderRowClass = () => {
        return "table-extra-info";
    };

    const renderStatusColumn = (text, record, index) => {
        return (
            <span className={`badge ${STATUS_CERT_LABEL[text].class}`}>
        {STATUS_CERT_LABEL[text].label}
      </span>
        );
    };

    const clickAction = (type,id) => {
        var title_modal = '';
        if(type === 1){
            title_modal = 'Lý do thu hồi chứng thư';
        }else if(type === 2){
            title_modal = 'Lý do hủy chứng thư';
        }else if(type === 3){
            title_modal = 'Lý do tạm dừng chứng thư';
        }
        setModalAction({...modalAction, 'visible_modal_deny': true, 'title_modal': title_modal, 'type': type, 'error_reason': '', 'id': id });
    };

    const handleModalActionCancel = () => {
        setModalAction({...modalAction, 'visible_modal_deny':false})
    };

    const confirmAction = async () => {
        var error_reason = '';
        if(Number(modalAction.type) === 1){
            error_reason = 'Lý do thu hồi chứng thư';
        }else if(Number(modalAction.type) === 2){
            error_reason = 'Lý do hủy chứng thư';
        }else if(Number(modalAction.type) === 3){
            error_reason = 'Lý do tạm dừng chứng thư';
        }
        error_reason = error_reason + ' không được trống';
        if (modalAction.reason.trim() === "") {
            setModalAction({...modalAction, 'error_reason': error_reason });
            return false;
        }

        const data = {reason:modalAction.reason, id:modalAction.id, type:modalAction.type};

        const result = await CustomerServices.actionCetificate(data);
        await setModalAction({...modalAction, 'visible_modal_deny': false });

        if (result && Number(result.status) === 200) {
            onSuccessAction("Gửi yêu cầu thành công!", () => {
                window.location.reload();
            });
        } else if (result && Number(result.status) === 422) {
            onFailAction("Có lỗi xảy ra trong quá trình yêu cầu!");
        } else {
            onFailAction(result.messages);
        }
    }
    const onChangeDataAction = ({ target: { value } }) => {
        setModalAction({...modalAction, 'reason': value});
    };

    const renderActionButton = (text, record, index) => {
        return (
            <React.Fragment>
                {Number(record.status) === 1 || Number(record.status) === 11 || Number(record.status) === 13  ? (
                    <React.Fragment>
                        <button className="pointer text-primary ml-1 mr-1" title="Thu hồi" onClick={()=>clickAction(1, record.id)}><i className="fas fa-reply-all fa-lg"></i></button>
                        <button className="pointer text-primary ml-1 mr-1" title="Hủy chứng thư" onClick={()=>clickAction(2, record.id)}><i className="fas fa-trash fa-lg"></i></button>
                        <button className="pointer text-primary ml-1 mr-1" title="Tạm dừng" onClick={()=>clickAction(3, record.id)}><i className="fas fa-stop-circle fa-lg"></i></button>
                    </React.Fragment>
                ): ''
                }
            </React.Fragment>
        );
    };
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };
    const columns = [
        {
            title: "SubjectDN",
            dataIndex: "subjectDN"
        },
        {
            title: "Serial CTS",
            dataIndex: "certificateSerial"
        },
        {
            title: 'Đối tượng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1){
                        return (<span className="badge badge-success">Cấp mới</span>);
                    }else if(Number(e.object) === 2){
                        return (<span className="badge badge-warning">Gia hạn</span>);
                    }else{
                        return (<span className="badge badge-primary">Thay đổi thông tin</span>);
                    }
                }
            }
        },
        {
            title: 'Loại  thiết bị',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.type) === 1){
                        return <p>Token</p>;
                    }else{
                        return <p>HSM</p>;
                    }
                }
            }
        },
        {
            title: "Ngày Hiệu lực",
            dataIndex: "certificateBegin",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "certificateEnd",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Trạng thái", dataIndex: "status",
            render: renderStatusColumn
        },
        {
            title: "Tác vụ",
            render: renderActionButton,
            width: '8%',
        }
    ];

    return (
        <PageWrapper title="Xem chi tiết khách hàng tổ chức">
            <Form>
                <Card className="m-r-15-i m-l-15-i" title={<label>Thông tin doanh nghiệp</label>} size="small">
                    {/*line 1*/}
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
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Tên khách hàng"
                            name="fullname"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Loại khách hàng"
                            name="type"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={255}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="email"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={16}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="phone"
                            wrapClass="col-md-3"
                            isDisabled={true}
                            maxLength={16}
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
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Địa chỉ"
                            name="address"
                            wrapClass="col-md-6"
                            maxLength={255}
                            isDisabled={true}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Người đại diện </label>} size="small">
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
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={16}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Nơi cấp"
                            name="represen_passport_place"
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={255}
                        />
                    </div>
                    <div className="input-group">
                        <InputWithLabel
                            form={props.form}
                            label="Chức vụ"
                            name="represen_position"
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Email"
                            name="represen_email"
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số điện thoại"
                            name="represen_phone"
                            wrapClass="col-md-4"
                            isDisabled={true}
                            maxLength={16}
                        />
                    </div>
                </Card>
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Danh sách chứng thư số của khách hàng </label>} size="small">
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
            </Form>

            <ModalDeny
                visible={modalAction.visible_modal_deny}
                handleCancel={handleModalActionCancel}
                handleDeny={confirmAction}
                value={modalAction.reason}
                onChange={onChangeDataAction}
                error={modalAction.error_reason}
                title={modalAction.title_modal}
                okText={'Xác nhận'}
            />
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
