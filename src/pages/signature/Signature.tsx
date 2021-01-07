import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import WrappedSignatureSearchForm from "../../components/request-token/search/SignatureSearchForm";
import Table from "../../components/common/table/Table";
import {onFailAction } from "helpers/SwalCommon";
import {SignatureService} from "services/signature/SignatureService";
import {RouteComponentProps} from "react-router";
import moment from "moment";

interface Props extends RouteComponentProps {
}

export const Signature: React.FC<Props> = () => {
    
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };
    
    const columns = [
        {title: "Serial", dataIndex: "chungthu_serial"},
        {title: "Sở hữu", dataIndex: "chungthu_sohuu"},
        {title: "Đơn vị cung cấp", dataIndex: "chungthu_ncc"},
        {title: "Mã số thuế", dataIndex: "doanhnghiep_mst"},
        {
            title: "Ngày bắt đầu",
            dataIndex: "chungthu_batdau",
            render: text => formatDateTime(text)
        },
        {
            title: "Ngày hết hiệu lực",
            dataIndex: "chungthu_ketthuc",
            render: text => formatDateTime(text)
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            render: text => formatDateTime(text)
        },
    ];
   
    const fetch = async (params = {}) => {
        try {
            const data = await SignatureService.getListIndex(params);
            return data;
        } catch (error) {
            onFailAction(error.message);
        }
    };
    
    return (
        <PageWrapper title="Cấu hình chứng thư số">
            <WrappedSignatureSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
