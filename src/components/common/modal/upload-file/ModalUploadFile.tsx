import React, { Component } from "react";
import { Modal } from 'antd';
import InputUploadFile from "../../form/input-with-label/InputUploadFile";

interface Props {
    handleCancel?: any;
    handleImport?: any;
    value?: string;
    visible: boolean;
    loading?: boolean;
    title?: string;
    onChange?: any;
    error? : string;
    onchangeFileUpload?: any;
    filename?: string;
}
interface State {
    visible: boolean;
}

export default class ModalUploadFile extends Component<Props, State> {
    render() {
        return (
            <div>
                <Modal
                    title={'Tải file hồ sơ'}
                    visible={this.props.visible}
                    onOk={this.props.handleImport}
                    onCancel={this.props.handleCancel}
                    destroyOnClose={true}
                    okText="Tải lên"
                    cancelText="Đóng"
                    className="modal-xs"
                    width="40%"
                    closable={false}
                >
                    <InputUploadFile
                        name="file"
                        classWrapped="col-md-12"
                        label="Tải hồ sơ (Chỉ chấp nhận file zip, rar)"
                        filename={this.props.filename}
                        onChanageFileUpload={this.props.onchangeFileUpload}
                        isRequired={true}
                        error={this.props.error}
                        extentionsAllow={['rar', 'zip']}
                        accept={".zip,.rar"}
                    />
                </Modal>
            </div>
        );
    }
}
