import React, { Component } from "react";
import { Modal } from 'antd';
import { Input } from 'antd';
import ValidateMessageError from "./validate-message-error/ValidateMessageError";

const { TextArea } = Input;

interface Props {
    handleCancel?: any;
    handleDeny?: any;
    value?: string;
    visible: boolean;
    loading?: boolean;
    title?: string;
    onChange?: any;
    error? : string;
    okText? : string;
}
interface State {
    visible: boolean;
}

export default class ModalDeny extends Component<Props, State> {

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <Modal
                    title={this.props.title ? this.props.title :'Lý do từ chối'}
                    visible={this.props.visible}
                    onOk={this.props.handleDeny}
                    onCancel={this.props.handleCancel}
                    destroyOnClose={true}
                    okText={this.props.okText ? this.props.okText :'Từ chối'}
                    cancelText="Đóng"
                    className="modal-lg"
                    width="auto"
                    closable={false}
                    // bodyStyle={}
                >
                    <TextArea
                        placeholder={this.props.title ? this.props.title :'Nhập Lý do từ chối'}
                        // autoSize={{ minRows: 4, maxRows: 10 }}
                        className="form-control"
                        required={true}
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />
                    <ValidateMessageError error={this.props.error}></ValidateMessageError>
                </Modal>
            </div>
        );
    }
}
