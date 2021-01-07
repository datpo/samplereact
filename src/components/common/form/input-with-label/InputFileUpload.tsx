import React, { Component } from "react";
import LabelInput from "./label/LabelInput";
import { Input, Form } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import BaseServices from "../../../../services/base/BaseServices";
import { loading } from "../../loading/Loading";
import _ from "lodash";

interface Props {
  classWrapped: string;
  label: string;
  name: string;
  isRequired?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  defaultLabel?: string;
  isDisabled?: boolean;
  onClickDownloadFile?: any;
  extentionsAllow?: string[];
  accept?: any;
  warning?: boolean;
  note?: boolean;
}
interface State {
  labelOnInput: string;
}

export default class InputFileUpload extends Component<Props, State> {
  state = {
    labelOnInput: ""
  };

  onChangeFile = async e => {
    const files = e.target.files[0];
    const { extentionsAllow, form, name } = this.props;

    const fileSize = files.size/1024/1024;
    if(fileSize>2){
      form.setFields({
        [name]: {
          errors: [
            new Error(
             "File tải lên không thể lớn hơn 2MB"
            )
          ]
        }
      });
      return;
    }

    if (extentionsAllow) {
      const index = _.findIndex(extentionsAllow, function(o) {
        return _.endsWith(files.name, o);
      });
      if (index === -1) {
        form.setFields({
          [name]: {
            errors: [
              new Error(
                "File tải lên phải là " + extentionsAllow.toString()
              )
            ]
          }
        });
        return;
      }
    }
    const formData = new FormData();
    formData.append("file", files);
    loading.runLoadingBlockUI();
    const fileData = await BaseServices.axiosUpLoadFile(formData);
    form.setFieldsValue({
      [name]: fileData.file
    });
    loading.stopRunLoading();
    this.setState({
      labelOnInput: files.name
    });
  };

  render() {
    const {
      name,
      isRequired,
      form,
      defaultLabel,
      isDisabled,
      onClickDownloadFile,
    } = this.props;
    let rules = this.props.rules || [];
    const { getFieldDecorator } = form;
    return (
      <div className={`form-group ${this.props.classWrapped}`}>
        <LabelInput
          nameFor={this.props.name}
          label={this.props.label}
          isRequired={this.props.isRequired}
          warning={this.props.warning}
          additionText={
            onClickDownloadFile ? (
              <span
                onClick={onClickDownloadFile}
                className="cursor-pointer btn-link "
              >
                <small>
                  <em>(Xem file)</em>
                </small>
              </span>
            ) : (
              ""
            )
          }
          note={this.props.note ? ("  (Dung lượng file 2MB)"): ('')}

        />
        <div className="custom-file">
          <input
            disabled={isDisabled}
            onChange={this.onChangeFile}
            type="file"
            className="custom-file-input"
            id="inputGroupFile01"
            aria-describedby="inputGroupFileAddon01"
            name={this.props.name}
            accept={this.props.accept}
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            {this.state.labelOnInput ? this.state.labelOnInput : defaultLabel}
          </label>
          <Form.Item>
            {getFieldDecorator(name, {
              rules: [
                ...rules,
                {
                  required: isRequired,
                  message: `${this.props.label} không thể bỏ trống!`
                }
              ]
            })(<Input hidden={true} type="text" className="" name={name} />)}
          </Form.Item>
        </div>
      </div>
    );
  }
}
