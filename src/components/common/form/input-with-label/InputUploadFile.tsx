import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import { Input } from "antd";
import ValidateMessageError from "../validate-message-error/ValidateMessageError";
import {loading} from "../../loading/Loading";
import BaseServices from "../../../../services/base/BaseServices";

interface Props {
    classWrapped: string;
    label: string;
    onChanageFileUpload: any;
    form?: WrappedFormUtils;
    rules?: ValidationRule[];
    name: string;
    filename?: string;
    error?: any;
    onSetValue?: string;
    isRequired?:boolean;
    isDisabled?: boolean;
    onClickDownloadFile?: any;
    defaultLabel?: string;
    accept?: string;
    isHidden?:any;
    extentionsAllow?: string[];
}
interface State {
    labelOnInput: string;
    valuefile: string;
}

export default class InputUploadFile extends Component<Props, State> {
    state = {
        labelOnInput: "",
        valuefile: ""
    };

    onChangeFile = async e => {
        const files = e.target.files[0];
        const formData = new FormData();
        formData.append("file", files);
        loading.runLoadingBlockUI();
        const fileData = await BaseServices.axiosUpLoadFile(formData);
        this.setState({
            valuefile: fileData.file
        });

        loading.stopRunLoading();
        this.setState({
            labelOnInput: files.name
        });
    };

    render() {
        const {
            defaultLabel,
            isDisabled,
            onClickDownloadFile
        } = this.props;
        return (
            <div className={`form-group ${this.props.classWrapped}`} hidden={this.props.isHidden}>
                <LabelInput
                    nameFor={this.props.name}
                    label={this.props.label}
                    isRequired={this.props.isRequired}
                    additionText={
                        onClickDownloadFile ? (
                            <span
                                onClick={onClickDownloadFile}
                                className="cursor-pointer btn-link "
                            >
                                <small>
                                    <em>(Tải xuống file)</em>
                                </small>
                            </span>
                        ) : ("")
                    }
                    note={"  (Dung lượng file 2MB)"}
                />
                <div className="custom-file">
                    <input
                        disabled={isDisabled}
                        onChange={this.props.onChanageFileUpload}
                        type="file"
                        className="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        name={this.props.name}
                        accept={this.props.accept}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFile01">
                        {this.props.filename ? this.props.filename : defaultLabel}
                    </label>
                    <Input hidden={true} type={"text"} className="" name="file_name" value={this.state.valuefile} />
                    <ValidateMessageError error={this.props.error}/>
                </div>
            </div>
        )
    }
}
