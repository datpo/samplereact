import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {CustomerServices} from "../../services/customer/CustomerServices";
import SearchForm from "./search/SearchForm";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const List: React.FC<Props> = props => {

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickChangeInfoCustomer={ record.accept_change === true ? (() =>
                    (record.passport)
                        ? props.history.push(`danh-sach-khach-hang/thay-doi-thong-tin-ca-nhan/${record.id}`)
                        : props.history.push(`danh-sach-khach-hang/thay-doi-thong-tin-to-chuc/${record.id}`)
                    ) : '' }
                onClickPreviewButton={() =>
                    (record.passport)
                        ? props.history.push(`danh-sach-khach-hang/chi-tiet-ca-nhan/${record.id}`)
                        : props.history.push(`danh-sach-khach-hang/chi-tiet-to-chuc/${record.id}`)
                }
            />
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
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(e.passport){
                        return <p>{e.passport}</p>;
                    }else{
                        return <p>{e.code}</p>;
                    }
                }
            }
        },
        {
            title: 'Loại khách hàng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(e.passport){
                        return <Tag color="cyan">Cá nhân</Tag>;
                    }else{
                        return <Tag color="geekblue">Tổ chức</Tag>;
                    }
                }
            }
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];
    const fetch = async (params = {}) => {
        try {
            var data = await CustomerServices.getListIndex(params);
            return data;
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách khách hàng">
            <SearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
