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
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import _ from "lodash";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

export const PreviewPersonal: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [customerCert, setCustomerCert] = useState([]);
    const [province, setProvince] = useState({});
    const [district, setDistrict] = useState({});
    const [modalDestroy, setModalDestroy] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        id: "",
        type: "",
        reason: "",
        error_reason: "",
    });

    const fetchRequestPersonal = async () => {
        const result = await CustomerServices.getInfo(id,2);
        const province = await RequestDigitalCertificatePersonalServices.getProvince();
        setProvince(_.mapValues(_.keyBy(province, "newtel_code"), "fullname"));
        const district = await RequestDigitalCertificatePersonalServices.getDistrictByProvince(result.data.province_code);
        setDistrict(_.mapValues(_.keyBy(district, "newtel_district_code"), "fullname"));
        props.form.setFieldsValue({
            uid: result.data.uid.toString(),
            code: result.data.passport,
            fullname: result.data.fullname,
            type: 'Cá nhân',
            gender: Number(result.data.gender) === 1 ? "Nam" : "Nữ",
            email: result.data.email,
            phone: result.data.phone,
            address: result.data.address,
        });
        setCustomerCert(result.data.list_cert);
    };

    useEffect(() => {
        fetchRequestPersonal();
        // eslint-disable-next-line
    }, []);

    const renderStatusColumn = (text, record, index) => {
        return (
            <span className={`badge ${STATUS_CERT_LABEL[text].class}`}>
        {STATUS_CERT_LABEL[text].label}
      </span>
        );
    };

    const clickDestroy = (type,id) => {
        var title_modal = '';
        if(type === 1){
            title_modal = 'Lý do hủy chứng thư';
        }else if(type === 2){
            title_modal = 'Lý do thu hồi chứng thư';
        }else if(type === 3){
            title_modal = 'Lý do tạm dừng chứng thư';
        }
        setModalDestroy({...modalDestroy, 'visible_modal_deny': true, 'title_modal': title_modal, 'type': type, 'error_reason': '', 'id': id });
    };

    const handleModalDenyCancel = () => {
        setModalDestroy({...modalDestroy, 'visible_modal_deny':false})
    };

    const confirmDeny = async () => {
        var error_reason = '';
        if(Number(modalDestroy.type) === 1){
            error_reason = 'Lý do hủy chứng thư';
        }else if(Number(modalDestroy.type) === 2){
            error_reason = 'Lý do thu hồi chứng thư';
        }else if(Number(modalDestroy.type) === 3){
            error_reason = 'Lý do tạm dừng chứng thư';
        }
        error_reason = error_reason + ' không được trống';
        if (modalDestroy.reason.trim() === "") {
            setModalDestroy({...modalDestroy, 'error_reason': error_reason });
            return false;
        }

        const data = {reason:modalDestroy.reason, id:modalDestroy.id, type:modalDestroy.type};

        const result = await CustomerServices.actionCetificate(data);
        await setModalDestroy({...modalDestroy, 'visible_modal_deny': false });

        if (result && Number(result.status) === 200) {
            onSuccessAction("Gửi yêu cầu thành công!", () => {
                window.location.reload();
            });
        } else if (result && Number(result.status) === 422) {
            onFailAction("Có lỗi xảy ra trong quá trình yêu cầu!");
        } else {
            onFailAction(result.error);
        }
    }
    const onChangeDataDeny = ({ target: { value } }) => {
        setModalDestroy({...modalDestroy, 'reason': value});
    };

    const renderActionButton = (text, record, index) => {
        return (
            <React.Fragment>
                {Number(record.status) === 1 ? (
                    <React.Fragment>
                        <button className="pointer text-primary ml-1 mr-1" title="Hủy chứng thư" onClick={()=>clickDestroy(1, record.id)}><i className="fas fa-trash fa-lg"></i></button>
                        <button className="pointer text-primary ml-1 mr-1" title="Thu hồi" onClick={()=>clickDestroy(2, record.id)}><i className="fas fa-reply-all fa-lg"></i></button>
                        <button className="pointer text-primary ml-1 mr-1" title="Tạm dừng" onClick={()=>clickDestroy(3, record.id)}><i className="fas fa-stop-circle fa-lg"></i></button>
                    </React.Fragment>
                ): ''
                }
            </React.Fragment>
        );
    };
    const renderRowClass = () => {
        return "table-extra-info";
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
                        return <p>Cấp mới</p>;
                    }else if(Number(e.object) === 2){
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
        <PageWrapper title="Xem chi tiết khách hàng cá nhân">
            <Form>
                <Card className="m-r-15-i m-l-15-i" title={<label>Thông tin cá nhân</label>} size="small">
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
                            label="Tên khách hàng"
                            name="fullname"
                            wrapClass="col-md-3"
                            maxLength={255}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Số CMND/Hộ chiếu"
                            name="code"
                            wrapClass="col-md-2"
                            maxLength={16}
                            isDisabled={true}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Loại khách hàng"
                            name="type"
                            wrapClass="col-md-2"
                            isDisabled={true}
                            maxLength={255}
                        />
                        <InputWithLabel
                            form={props.form}
                            label="Giới tính"
                            name="gender"
                            wrapClass="col-md-2"
                            maxLength={255}
                            isDisabled={true}
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
                            // onChange={onchange}
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
                <Card className="m-r-15-i m-l-15-i mt-4" title={<label>Danh sách chứng thư số của khách hàng </label>} size="small">
                    <AntTable
                        columns={columns}
                        style={{width: "100%"}}
                        dataSource={customerCert}
                        pagination={false}
                        rowClassName={renderRowClass}
                        bordered
                        key={'certTable'}
                        rowKey='id'
                    />
                </Card>
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
            <ModalDeny
                visible={modalDestroy.visible_modal_deny}
                handleCancel={handleModalDenyCancel}
                handleDeny={confirmDeny}
                value={modalDestroy.reason}
                onChange={onChangeDataDeny}
                error={modalDestroy.error_reason}
                title={modalDestroy.title_modal}
                okText={'Xác nhận'}
            />
        </PageWrapper>
    );
};

const WrappedPreviewPersonal = Form.create<Props>({
    name: "PreviewPersonal"
})(PreviewPersonal);

export default WrappedPreviewPersonal;
