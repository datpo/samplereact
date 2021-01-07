import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import moment from "moment";
import WrappedSearchForm from "./search/SearchFormDocument";
import { SupportServices } from './../../services/support/SupportServices';

interface Props extends RouteComponentProps {
}

export const Document: React.FC<Props> = props => {

    const renderActionButton = (text, record, index) => {
        return (
            <a href ="#/" className="pointer text-primary ml-1 mr-1" title="File document" onClick={() => onClickDownload(record.id)}>
				<i className=" fa fa-download fa-lg"></i>
            </a>
        );
    };
    const onClickDownload = (id) => {
    	try{
			var token = localStorage.getItem("currentUser");
			if(token){
			   let obj = JSON.parse(token);
			   let link = `${process.env.REACT_APP_BASE_API_URL}cate/document-get-download/${id}?token=${obj.token}`;
			   window.open(link);
			}
    	}catch (error){
    		onFailAction("Có lỗi xảy ra!");
    	}
    }

    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };

    const columns = [
        {
            title: "Tên tài liệu",
            dataIndex: "name"
        },
        {
            title: "Số tài liệu",
            dataIndex: "number"
        },
        {
            title: "Ngày hiệu lực",
            dataIndex: "valid_at",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Thời gian tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Tác vụ",
            render: renderActionButton,
            className: 'text-center'
        }
    ];
    const fetch = async (params = {}) => {
        try {
            return await SupportServices.getListDocument({...params,...{type: 1}});
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách văn bản">
            <WrappedSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
