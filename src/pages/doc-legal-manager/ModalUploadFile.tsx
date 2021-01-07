import React, { Component } from "react";
import {Modal} from 'antd';
import InputUploadFile from "../../components/common/form/input-with-label/InputUploadFile";

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
    filename1?: string;
    filename2?: string;
    filename3?: string;
    filename4?: string;
    filename5?: string;
    filename6?: string;
    filename7?: string;
    filename8?: string;
    filename9?: string;
    filename10?: string;
    filename11?: string;
    filename12?: string;
    filename13?: string;
    fileDoc1?: boolean;
    fileDoc2?: boolean;
    fileDoc3?: boolean;
    fileDoc4?: boolean;
    fileDoc5?: boolean;
    fileDoc6?: boolean;
    fileDoc7?: boolean;
    fileDoc8?: boolean;
    fileDoc9?: boolean;
    fileDoc10?: boolean;
    fileDoc11?: boolean;
    fileDoc12?: boolean;
    fileDoc13?: boolean;
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
                    {
                        this.props.fileDoc1 ?
                            <InputUploadFile
                                name="1"
                                classWrapped="col-md-12"
                                label="CMND/Hộ chiếu"
                                filename={this.props.filename1}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc2 ?
                            <InputUploadFile
                                name="2"
                                classWrapped="col-md-12"
                                label="File xác nhận của doanh nghiệp"
                                filename={this.props.filename2}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc3 ?
                            <InputUploadFile
                                name="3"
                                classWrapped="col-md-12"
                                label="Mẫu DK-01.01"
                                filename={this.props.filename3}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc4 ?
                            <InputUploadFile
                                name="4"
                                classWrapped="col-md-12"
                                label="Mẫu DK-01.02"
                                filename={this.props.filename4}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc5 ?
                            <InputUploadFile
                                name="5"
                                classWrapped="col-md-12"
                                label="File giấy tờ pháp lý"
                                filename={this.props.filename5}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc6 ?
                            <InputUploadFile
                                name="6"
                                classWrapped="col-md-12"
                                label="File cmnd/hộ chiếu người đại diện"
                                filename={this.props.filename6}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc7 ?
                            <InputUploadFile
                                name="7"
                                classWrapped="col-md-12"
                                label="Mẫu ký xác nhận DK-02"
                                filename={this.props.filename7}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc8 ?
                            <InputUploadFile
                                name="8"
                                classWrapped="col-md-12"
                                label="CMND/Hộ chiếu (Điều chỉnh)"
                                filename={this.props.filename8}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc9 ?
                            <InputUploadFile
                                name="9"
                                classWrapped="col-md-12"
                                label="File xác nhận của doanh nghiệp (Điều chỉnh)"
                                filename={this.props.filename9}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc10 ?
                            <InputUploadFile
                                name="10"
                                classWrapped="col-md-12"
                                label="File giấy tờ pháp lý (Điều chỉnh)"
                                filename={this.props.filename10}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc11 ?
                            <InputUploadFile
                                name="11"
                                classWrapped="col-md-12"
                                label="File cmnd/hộ chiếu người đại diện (Điều chỉnh)"
                                filename={this.props.filename11}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc12 ?
                            <InputUploadFile
                                name="12"
                                classWrapped="col-md-12"
                                label="Mẫu ký xác nhận DC-01.01(Tổ chức - điều chỉnh)"
                                filename={this.props.filename12}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.fileDoc13 ?
                            <InputUploadFile
                                name="13"
                                classWrapped="col-md-12"
                                label="Mẫu ký xác nhận DC-01.02(Cá nhân - điều chỉnh)"
                                filename={this.props.filename13}
                                onChanageFileUpload={this.props.onchangeFileUpload}
                                extentionsAllow={['pdf']}
                                accept={".pdf"}
                            />
                            : ""
                    }
                    {
                        this.props.error ? <div className="col-md-12 text-center"><p className="text-danger">{this.props.error}</p></div>  : ""
                    }
                </Modal>
            </div>
        );
    }
}
