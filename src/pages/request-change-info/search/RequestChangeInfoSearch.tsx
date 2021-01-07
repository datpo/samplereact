import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import Store from "../../../store/store";

interface Props extends FormComponentProps {}

const userType = Store.getState().authReducer;

const RequestChangeInfoSearchForm: React.FC<Props> = () => {
    return (
        <Form>
            <div className="input-group">
                <div className="form-group col-md-2 mt-1">
                    <ButtonCreate
                        permission=""
                        toUrl={
                            userType === 7 ?"/yeu-cau-thay-doi-thong-tin/them-moi"
                            :"/yeu-cau-thay-doi-thong-tin/dai-ly/them-moi"
                        }
                        text="Thêm mới yêu cầu thay đổi thông tin"
                    />
                </div>
            </div>
        </Form>
    );
};

const RequestChangeInfoSearch = Form.create<Props>({
    name: "WrappedRequestCTSGroupSearchForm"
})(RequestChangeInfoSearchForm);

export default RequestChangeInfoSearch;
