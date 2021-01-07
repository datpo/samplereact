import React from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {formatDate} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import WrappedTransferBusinessEmployeeSearchForm from "./search/TransferBusinessEmployeeSearchForm";
import {TransferBusinessEmployeeServices} from "../../services/transfer-business-employee/TransferBusinessEmployeeServices";

interface Props extends RouteComponentProps {
}

export const TransferBusinessEmployee: React.FC<Props> = props => {

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickPreviewButton={() =>
                    props.history.push(`yeu-cau-chuyen-nguoi-quan-ly/xem-chi-tiet/${record.id}`)
                }
            />
        );
    };

    const columns = [
        {title: "NVKD chuyển", dataIndex: "usertransfer.fullname"},
        {
            title: "Yêu cầu khóa tài khoản",
            dataIndex: "is_lock_account",
            render: (text, record, index) =>
                text === 1 ? "Có" : "Không"
        },
        { title: "Người tạo yêu cầu", dataIndex: "user.fullname" },
        {
            title: "Thời gian tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDate(text)
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];

    const fetch = async (params = {}) => {
        try {
            return await TransferBusinessEmployeeServices.getListIndex(params);
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách yêu cầu thay đổi người quản lý ">
            <WrappedTransferBusinessEmployeeSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
