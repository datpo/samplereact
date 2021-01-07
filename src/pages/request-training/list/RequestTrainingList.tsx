import React, {useState} from "react";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {reloadPage, checkPermission} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {UserServices} from "../../../services/user/UserServies";
import PageWrapper from "../../wrapper/PageWrapper";
import {STATUS_REQUEST_TRAINING} from "../enum/RequestTrainingEnum";
import Table from "../../../components/common/table/Table";
import WrappedRequestTrainingSearchForm from "../search/RequestTrainingSearch";
import {RequestTrainingServices} from "../../../services/request-training/RequestTrainingServices";
import moment from "moment";
import { Tag } from "antd";

const per_update = 'update-request-training'
const per_delete = 'delete-request-training'
interface Props extends RouteComponentProps {
}

export const RequestTraining: React.FC<Props> = props => {
    const [userID, setUserID] = useState(0);
    const onDeleteRequestTraining = async id => {
        const {location, history} = props;
        try {
            await RequestTrainingServices.deleteRequest(id);
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
                    [1, 3, 5].indexOf(record.status) !== -1  && [userID].indexOf(record.created_by)  !== -1 && checkPermission(per_update)
                        ? () => props.history.push(`yeu-cau-dao-tao/cap-nhat/${record.id}`)
                        : null
                }
                onClickDelete={
                    [1, 3, 5].indexOf(record.status) !== -1 && [userID].indexOf(record.created_by)  !== -1 && checkPermission(per_delete)
                        ? () => onDeleteRequestTraining(record.id)
                        : null
                }
                onClickPreviewButton={() =>
                    props.history.push(`yeu-cau-dao-tao/xem/${record.id}`)
                }
            />
        );
    };
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };
    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST_TRAINING[text].class}`}>
                {STATUS_REQUEST_TRAINING[text].label}
            </Tag>
        );
    };

    const columns = [
        {title: "Người yêu cầu", dataIndex: "user.fullname"},
        { title: "Tên đại lý/cộng tác viên",
            dataIndex: '',
            render: (e) => {
                if (e) {
                    if(Number(e.belong_to) === 1){
                        return <p>{e.owner_agency.fullname}</p>;
                    }else{
                        return <p>{e.owner_contributor.fullname}</p>;
                    }
                }
            }
        },
        {
            title: 'MST/Số CMND',
            dataIndex: '',
            render: (e) => {
                if (e) {
                    if(Number(e.belong_to) === 1){
                        return <p>{e.owner_agency.tax_code}</p>;
                    }else{
                        return <p>{e.owner_contributor.passport}</p>;
                    }
                }
            }
        },
        {
            title: "Nội dung đào tạo", dataIndex: "content_train"
        },
        {
            title: "Thời gian đào tạo",
            dataIndex: "training_date",
            render: (text, record, index) => formatDateTime(text)
        },
        {   title: "Ngày tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDateTime(text)},
        {title: "Trạng thái", dataIndex: "status", render: renderStatusColumn},
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
            if(Number(type) === 7 || Number(type) === 8){
                return await RequestTrainingServices.index(params);
            }
            if(Number(type) === 6){
                return await RequestTrainingServices.indexForStaff(params);
            }
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách yêu cầu đào tạo">
            <WrappedRequestTrainingSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
