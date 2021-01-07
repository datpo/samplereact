import React, { Component } from "react";
import { Modal } from 'antd';
import { Input } from 'antd';
import ValidateMessageError from "./validate-message-error/ValidateMessageError";


interface Props {
    handleCancel?: any;
    handleDeny?: any;
    value?: string;
    visible: boolean;
    loading?: boolean;
    title?: string;
    onChange?: any;
    error? : string;
}
interface State {
    visible: boolean;
}

export default class ModalEnterPin extends Component<Props, State> {

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <Modal
                    title={'Nhập mã pin'}
                    visible={this.props.visible}
                    onOk={this.props.handleDeny}
                    onCancel={this.props.handleCancel}
                    destroyOnClose={true}
                    okText="Đồng ý"
                    cancelText="Đóng"
                    className="modal-lg"
                    width = '23%'
                    closable={false}
                >
                    <Input
                        placeholder={"Nhập mã pin"}
                        className={"form-control"}
                        required={true}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        type={"password"}
                    />
                    <ValidateMessageError error={this.props.error}></ValidateMessageError>
                </Modal>
            </div>
        );
    }
}
