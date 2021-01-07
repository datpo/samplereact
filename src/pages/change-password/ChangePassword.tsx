import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import {FormComponentProps} from "antd/lib/form";
import {Form} from "antd";
import {match} from "react-router";
import InputWithLabel from "../../components/common/form/input-with-label/InputWithLabel";
import ButtonOnSave from "../../components/common/form/button/ButtonOnSave";
import {ChangePassWordService} from "../../services/change-password/ChangePassWordService";
import {loading as loadingHelper} from "components/common/loading/Loading";
import {onFailAction, onSuccessAction} from "../../helpers/SwalCommon";


interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    user: any;
    history: any;
}
export const ChangePasswordForm: React.FC<Props> = props => {
    const update = status => {
        const { validateFields } = props.form;
        validateFields (async (errors,values) => {
            if (!errors) {
                loadingHelper.runLoadingBlockUI();
                const val = {
                    ...values,
                    status
                };
                const data = await ChangePassWordService.changePassword(val);
                if (data && Number(data.status)===1) {
                    if (data.errors.password) {
                        onFailAction('' + data.errors.password)
                    }
                    if (data.errors.reNewPassword) {
                        onFailAction('' + data.errors.reNewPassword)
                    }
                }
                if (Number(data.status)===200) {
                    onSuccessAction("Đổi mật khẩu thành công", ()=>{
                        props.history.push("/logout")
                    })
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        })
    };
    return (<PageWrapper title={"Đổi Mật Khẩu"}>
        <Form>
            <div className="input-group">
                <InputWithLabel
                    wrapClass={"col-md-4"}
                    name={"password"}
                    type={"password"}
                    label={"Mật khẩu cũ"}
                    isRequired={true}
                    maxLength={255}
                    form={props.form}>
                </InputWithLabel>
                <InputWithLabel
                    wrapClass={"col-md-4"}
                    name={"newPassword"}
                    type={"password"}
                    label={"Mật khẩu mới"}
                    isRequired={true}
                    maxLength={255}
                    rules={[
                        {
                            validator: function(rule, value, callback) {
                                if(value && value.length<6){
                                    callback("Mật khẩu mới phải lớn hơn 6 ký tự");
                                } else {
                                    callback();
                                }
                            },
                            message: "Mật khẩu mới phải lớn hơn 6 ký tự"
                        }
                    ]}
                    form={props.form}>
                </InputWithLabel>
                <InputWithLabel
                    wrapClass={"col-md-4"}
                    name={"reNewPassword"}
                    type={"password"}
                    label={"Nhập lại mật khẩu mới"}
                    isRequired={true}
                    maxLength={255}
                    form={props.form}>
                </InputWithLabel>
            </div>
        </Form>
        <div className="input-group d-flex justify-content-center">
                <ButtonOnSave
                    onClick={() => {update(1)}}
                    label="Lưu thay đổi"
                    className={"btn-sm"}
                />
        </div>
    </PageWrapper>);
};
const ChangePassword = Form.create<Props>({name: "ChangePasswordForm"})(ChangePasswordForm);
export default ChangePassword;