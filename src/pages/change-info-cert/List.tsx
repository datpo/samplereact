import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import SearchForm from "./search/SearchForm";
import { ChangeInfoCertServices } from './../../services/change-info-cert/ChangeInfoCertServices';
import { STATUS_REQUEST_CHANGE_CERT } from './Enum';
import { reloadPage } from './../../helpers/NewCaCrmHelper';
import moment from "moment";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const List: React.FC<Props> = props => {

    const onDeleteRequest = async id => {
        const {location, history} = props;
        try {
            await ChangeInfoCertServices.deleteRequest(id);
            reloadPage(location, history);
            onSuccessAction("Xóa yêu cầu thành công!");
        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xóa yêu cầu!");
        }
    };

    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickPreviewButton={() =>
                    (Number(record.type) === 1)
                        ? props.history.push(`danh-sach-dieu-chinh-thong-tin/chi-tiet-to-chuc/${record.id}`)
                        : props.history.push(`danh-sach-dieu-chinh-thong-tin/chi-tiet-ca-nhan/${record.id}`)
                }

                onClickUpdate={
                    Number(record.status) === 2 ?
                        Number(record.type) === 1
                            ? () => props.history.push(`danh-sach-dieu-chinh-thong-tin/cap-nhat-to-chuc/${record.id}`)
                            : () => props.history.push(`danh-sach-dieu-chinh-thong-tin/cap-nhat-ca-nhan/${record.id}`)
                    : ''}

                onClickDelete={
                    [2].indexOf(record.status) !== -1
                        ? () => onDeleteRequest(record.id)
                        : null
                }
            />
        );
    };
    // [1, 3, 6].indexOf(record.status) !== -1
    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST_CHANGE_CERT[text].class}`}>
        {STATUS_REQUEST_CHANGE_CERT[text].label}
      </Tag>
        );
    };
    const columns = [
        {
            title: "Mã khách hàng",
            dataIndex: "uid"
        },
        {
            title: "Tên khách hàng",
            dataIndex: "fullname"
        },
        {
            title: 'Mã định danh',
            dataIndex: "code",
        },
        {
            title: 'Loại khách hàng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(e.type === 1){
                        return <Tag color="green">Tổ chức</Tag>;
                    }else{
                        return <Tag color="geekblue">Cá nhân</Tag>;
                    }
                }
            }
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {title: "Trạng thái", dataIndex: "status", render: renderStatusColumn},
        {
            title: "Thời gian tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];
    const fetch = async (params = {}) => {
        try {
            var data = await ChangeInfoCertServices.getListIndex(params);
            return data;
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách yêu cầu điều chỉnh thông tin">
            <SearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
