import React, { Component } from "react";
import { WrappedFormUtils } from "antd/lib/form/Form";
import ButtonCancel from "../../../../components/common/form/button/ButtonCancel";

interface Props {
  form: WrappedFormUtils;
  onClickDraft: any;
  onClickConfirmSave: any;
}
interface State {}

export default class BtnGroupSave extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className="input-group d-flex justify-content-center p-5">
          <div className="">
              <button onClick={this.props.onClickDraft} className="btn btn-primary ml-1 mr-1 btn btn-primary btn-sm">
                  <i className="fas fa-save mr-2"></i>
                  Lưu nháp
              </button>
          </div>
          <div className="">
              <button
                  onClick={this.props.onClickConfirmSave}
                  className="btn btn-primary ml-1 mr-1 btn btn-success btn-sm"
              >
                  <i className="fas fa-save mr-2"></i>
                  Trình duyệt
              </button>
          </div>
          <div className="">
              <ButtonCancel toURL="/quan-ly-dai-ly" className="btn btn-primary ml-1 mr-1 btn btn-default btn-sm" />
          </div>{""}

      </div>
    );
  }
}
