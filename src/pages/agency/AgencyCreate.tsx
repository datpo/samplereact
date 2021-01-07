import React, { Component } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import AgencyFormCreate from "./form/create/AgencyFormCreate";
import { AgencyService } from "../../services/agency/AgencyServices";
import { onFailAction, onSuccessAction } from "../../helpers/SwalCommon";
import { History } from "history";
import { WrappedFormUtils } from "antd/lib/form/Form";
import _ from "lodash";
import { match } from "react-router";
import { loading } from "../../components/common/loading/Loading";

interface Props {
  location: Location;
  history: History;
  match: match;
}
interface State {
}

export default class AgencyCreate extends Component<Props, State> {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <PageWrapper title="Thêm mới đại lý">
        <AgencyFormCreate
          onDraftSave={this.onDraftSave}
          onConfirmSave={this.onConfirmSave}
        />
      </PageWrapper>
    );
  }

  onDraftSave = async (values, form: WrappedFormUtils) => {
    if (values) {
      const valuesForm = {
        ...values,
        contract_date: values.contract_date.format("l")
      };
      const agencyService = new AgencyService();
      try {
        loading.runLoadingBlockUI();
        const data = await agencyService.storeDraftAgency(valuesForm);
        if (data && data.status === 422) {
          _.forOwn(data.error, function(errors, key) {
            form.setFields({
              [key]: {
                errors: [new Error(errors.toString())]
              }
            });
          });
        } else if (data && data.status === 200) {
          onSuccessAction("Lưu nháp đại lý thành công", () => {
            this.props.history.push("/nhom-quyen");
          });
        }
      } catch (error) {
        onFailAction("Có lỗi xảy ra khi lưu nháp!");
      } finally {
        loading.stopRunLoading();
      }
    }
  };

  onConfirmSave = async (values, form: WrappedFormUtils) => {
    try {
      const valuesForm = {
        ...values,
        contract_date: values.contract_date.format("l")
      };
      const agencyService = new AgencyService();
      loading.runLoadingBlockUI();
      const data = await agencyService.storeConfirmAgency(valuesForm);
      if (data && data.status === 422) {
        _.forOwn(data.error, function(errors, key) {
          form.setFields({
            [key]: {
              errors: [new Error(errors.toString())]
            }
          });
        });
      } else if (data && data.status === 200) {
        onSuccessAction("Trình duyệt đại lý thành công", () => {
          this.props.history.push("/nhom-quyen");
        });
      }
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi trình duyệt!");
    } finally {
      loading.stopRunLoading();
    }
  };
}
