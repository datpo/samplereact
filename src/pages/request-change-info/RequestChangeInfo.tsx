import React, {useEffect, useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {formatDate, reloadPage} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {RequestChangeInfoService} from "../../services/request-change-info/RequestChangeInfoService";
import Store from "../../store/store";
import ButtonCreate from "../../components/common/form/button/ButtonCreate";
import {Form} from "antd";

interface Props extends RouteComponentProps {
}

export const RequestChangeInfo: React.FC<Props> = props => {
    const onDelete = async id => {
        const {location, history} = props;
        const result = await RequestChangeInfoService.del(id);
        if (result && result.status === 200){
            onSuccessAction("Xóa yêu cầu thành công!");
            reloadPage(location, history);
        }else{
            onFailAction("Có lỗi xảy ra!");
        }
    };
    const userType = Store.getState().authReducer.type;
    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                permissionUpdate=""
                permissionDelete={true}
                onClickUpdate={
                    [2].indexOf(record.status) !== -1
                        ? () => props.history.push(userType === 7 ? `yeu-cau-thay-doi-thong-tin/dai-ly/cap-nhat/${record.id}`:`yeu-cau-thay-doi-thong-tin/cap-nhat/${record.id}`)
                        : null
                }
                onClickDelete={
                    [2].indexOf(record.status) !== -1
                        ? () => onDelete(record.id)
                        : null
                }
                onClickPreviewButton={() =>
                    props.history.push(userType === 7 ? `yeu-cau-thay-doi-thong-tin/dai-ly/xem/${record.id}` : `yeu-cau-thay-doi-thong-tin/xem/${record.id}`)
                }
            />
        );
    };
    const [check, setCheck] = useState(1);
    const checkAddRequest = async () => {
        const result = await RequestChangeInfoService.checkAddRequest();
        if (result.status === 200) setCheck(1);
        else setCheck(2);
    };

    useEffect(() => {
        checkAddRequest();
        // eslint-disable-next-line
    }, []);
    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "code"
        },
        {
            title: "Trạng thái",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(e.status === 1){
                        return <span className="badge badge-warning">Chờ nghiệp vụ duyệt</span>;
                    }else if(e.status === 2){
                        return <span className="badge badge-danger">Nghiệp vụ từ chối</span>;
                    }else if(e.status === 3){
                        return <span className="badge badge-success">Hoàn thành</span>;
                    }else {
                        return <span className="badge badge-danger">Hủy</span>;
                    }
                }
            }
        },
        {
            title: "Lý do",
            dataIndex: "reason_customer"
        },
        {
            title: "Thời gian tạo",
            dataIndex: "",
            render: (text, record, index) => formatDate(text)
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        },
    ];

    const fetch = async () => {
        try {
            return await RequestChangeInfoService.index();
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách yêu cầu thay đổi thông tin">
            {check === 1 ? (
                <Form>
                    <div className="input-group">
                        <div className="form-group col-md-2 mt-1 nopadding-left">
                            <ButtonCreate
                                permission=""
                                toUrl={
                                    userType === 7 ?"/yeu-cau-thay-doi-thong-tin/dai-ly/them-moi"
                                        :"/yeu-cau-thay-doi-thong-tin/them-moi"
                                }
                                text="Thêm mới yêu cầu thay đổi thông tin"
                            />
                        </div>
                    </div>
                </Form>
                ) : ""
            }
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
