import React from "react";
import { Form} from "antd";
import {FormComponentProps} from "antd/lib/form";
import InputWithoutLabel from "../../common/form/input-with-label/input/InputWithoutLabel";
import ButtonSearch from "../../common/form/button/ButtonSearch";
import {SignatureService} from "services/signature/SignatureService";
import Store from "store/store";
import axios from "axios";
import {onFailAction, onSuccessAction} from "../../../helpers/SwalCommon";

interface Props extends FormComponentProps {
}

const RequestTokenSearchForm: React.FC<Props> = props => {
    const onClickAddSignature = async () => {
        const userId = Store.getState().authReducer.id;
        const taxcode = await SignatureService.getTaxcode(userId);
        if (taxcode.status === 400) {
            onFailAction("Không tìm thấy mã số thuế!", '', 'warning')
        }
        if (taxcode.status ===200){
            axios.get(`http://localhost:6706/api/certificate/getcert?mst=${taxcode.data}`)
            .then((response) => {
                const data = response.data;
                data.mst = taxcode.data;
                senDataSignatureToStore(response.data);
            })
            .catch((error) => {
                onFailAction('Bạn chưa cài đặt đặt NewCa Plugin');
            });
        }
    };

    const senDataSignatureToStore = async (data) => {
        const result = await SignatureService.sendDataSignature(data);
        if (result.status === 200) {
            onSuccessAction("Thêm mới thành công", () => {
                window.location.reload();
            });
        } else  {
            onFailAction(result.error);
        }
    };

    return (
        <Form>
            <div className="input-group">
                <div className="form-group col-md-3 nopadding-left">
                    <InputWithoutLabel
                        form={props.form}
                        name="chungthu_serial"
                        label="Serial"
                        placeholder="Serial number"
                        onChange=""
                    />
                </div>
                <div className="form-group col-md-9 mt-1">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                    <button className="btn btn-success btn-sm ml-2" onClick={onClickAddSignature}><i className="fas fa-plus mr-1"/>Thêm</button>
                </div>
            </div>
        </Form>
    );
};

const WrappedRequestSearchForm = Form.create<Props>({
    name: "RequestTokenSearchForm"
})(RequestTokenSearchForm);

export default WrappedRequestSearchForm;
