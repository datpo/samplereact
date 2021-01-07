import React, {useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {reloadPage, checkPermission} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {RequestTokenCTSService} from "../../services/request-token-cts/RequestTokenCTSServices";
import {STATUS_REQUEST_TOKEN_LABEL} from "../../helpers/enum/request-token/RequestTokenEnums";
import WrappedRequestCTSSearchForm from "./search/RequestTokenCTSSearchForm";
import {UserServices} from "../../services/user/UserServies";
import { Tag } from "antd";
import moment from "moment";

const per_update = 'update-request-document'
const per_delete = 'delete-request-document'
interface Props extends RouteComponentProps {
}

export const RequestTokenCTS: React.FC<Props> = props => {
    const [userID, setUserID] = useState(0);
    const onDeleteRequestToken = async id => {
        const {location, history} = props;
        try {
            await RequestTokenCTSService.deleteRequest(id);
            reloadPage(location, history);
            onSuccessAction("Xóa yêu cầu thành công!");
        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xóa yêu cầu!");
        }
    };

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                permissionUpdate=""
                permissionDelete={true}
                onClickUpdate={
                    [1, 3, 6].indexOf(record.status) !== -1  && [userID].indexOf(record.created_by)  !== -1 && checkPermission(per_update)
                        ? () => props.history.push(`yeu-cau-token-cts/cap-nhat/${record.id}`)
                        : null
                }
                onClickDelete={
                    [1, 3, 6].indexOf(record.status) !== -1 && [userID].indexOf(record.created_by)  !== -1 && checkPermission(per_delete)
                        ? () => onDeleteRequestToken(record.id)
                        : null
                }
                onClickPreviewButton={() =>
                    props.history.push(`yeu-cau-token-cts/xem/${record.id}`)
                }
            />
        );
    };

    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST_TOKEN_LABEL[text].class}`}>
                {STATUS_REQUEST_TOKEN_LABEL[text].label}
            </Tag>
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
        {title: "Người yêu cầu", dataIndex: "user.fullname"},
        {
            title: "Tên đại lý/CTV/NVKD",
            render: (e) =>{
                if(e){
                    if(Number(e.belong_to) === 1 || Number(e.belong_to) === 2){
                        return <p>{e.owner.fullname}</p>;
                    }else {
                        return <p>{e.user.fullname}</p>;
                    }
                }
            }
        },
        {
            title: 'Mã số thuế/Chứng minh thư',
            dataIndex: '',
            render: (e) => {
                if (e) {
                    if(Number(e.belong_to) === 1){
                        return <p>{e.owner.tax_code}</p>;
                    }else if(Number(e.belong_to) === 2){
                        return <p>{e.owner.passport}</p>;
                    }
                }
            }
        },

        {
            title: "Hình thức nhận",
            dataIndex: "receive_type",
            render: (text, record, index) =>
                text === 1 ? "Nhận tại văn phòng" : "Nhận qua chuyển phát nhanh"
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "type_pay",
            render: (text, record, index) =>
                text === 1 ? "Chuyển khoản" : "Tiền mặt"
        },
        {title: "Tên người nhận", dataIndex: "receive_fullname"},
        {title: "Trạng thái", dataIndex: "status", render: renderStatusColumn},
        {title: "Ngày tạo", dataIndex: "created_at", render: (text, record, index) => formatDateTime(text)},
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];
    const fetch = async (params = {}) => {
        try {
            const user = new UserServices();
            const userInfo = await user.getUserAuth();
            const type = userInfo.data.type;
            setUserID(userInfo.data.id);
            if(type === TYPE_BUSINESS_EMPLOYEE ){
                return await RequestTokenCTSService.getListIndexStaff(params);
            }else {
                return await RequestTokenCTSService.getListIndex(params);
            }
        } catch (error) {
            onFailAction(error.message);
        }
    };
    const TYPE_BUSINESS_EMPLOYEE = 5;

    return (
        <PageWrapper title="Danh sách yêu cầu tài liệu bán hàng">
            <WrappedRequestCTSSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
