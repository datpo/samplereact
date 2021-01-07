import React, { Component } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import { AgencyService } from "../../services/agency/AgencyServices";
import { onFailAction, onSuccessAction } from "../../helpers/SwalCommon";
import { match, RouteComponentProps } from "react-router";
import { History, Location, LocationState } from "history";
import AgencyFormUpdate from "./form/update/AgencyFormUpdate";
import { WrappedFormUtils } from "antd/lib/form/Form";
import _ from "lodash";
import { loading } from "../../components/common/loading/Loading";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  location: Location;
  history: History<LocationState>;
  match: match<MatchParams>;
}
interface State {
  dataBeforeUpdate: any;
  agencyModel: any;
  loading: boolean;
}

class AgencyUpdate extends Component<Props, State> {
  state = {
    dataBeforeUpdate: { data: {}, status: 1 },
    agencyModel: {},
    loading: true
  };

  getModelBeforeUpdate = async (form: WrappedFormUtils) => {
    try {
      const agencyService = new AgencyService();
      const agencyModel = await agencyService.getModelToUpdate(
        this.props.match.params.id
      );
      form.setFieldsValue({ contract_type: agencyModel.data.type.toString(),
        product: agencyModel.data.product ? agencyModel.data.product : '',
      });
      this.setState({ agencyModel: agencyModel.data, loading: false });
    } catch (error) {
      this.props.history.push("/404", null);
    }
  };

  onDraftSave = async (values, form: WrappedFormUtils) => {
    const valuesForm = {
      ...values,
      contract_date: values.contract_date.format("l")
    };
    const agencyService = new AgencyService();
    try {
      loading.runLoadingBlockUI();
      const data = await agencyService.updateAgencyAsDraft(
        this.props.match.params.id,
        valuesForm
      );
      if (data && data.status === 422) {
        _.forOwn(data.error, function(errors, key) {
          form.setFields({
            [key]: {
              errors: [new Error(errors.toString())]
            }
          });
        });
      } else if (data && data.status === 200) {
        onSuccessAction("Cập nhật đại lý thành công!", () => {
          this.props.history.push("/quan-ly-dai-ly");
        });
      }
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi cập nhật!");
    } finally {
      loading.stopRunLoading();
    }
  };

  render() {
    return (
      <PageWrapper title="Cập nhật đại lý" loading={this.state.loading}>
        <AgencyFormUpdate
          onDraftSave={this.onDraftSave}
          onConfirmSave={this.onConfirmSave}
          history={this.props.history}
          agencyModel={this.state.agencyModel}
          fetchData={this.getModelBeforeUpdate}
        />
      </PageWrapper>
    );
  }

  onConfirmSave = async (values, form: WrappedFormUtils) => {
    const valuesForm = {
      ...values,
      contract_date: values.contract_date.format("l")
    };
    const agencyService = new AgencyService();
    try {
      loading.runLoadingBlockUI();
      const data = await agencyService.updateAgencyAsConfirm(
        this.props.match.params.id,
        valuesForm
      );
      if (data && data.status === 422) {
        _.forOwn(data.error, function(errors, key) {
          form.setFields({
            [key]: {
              errors: [new Error(errors.toString())]
            }
          });
        });
      } else if (data && data.status === 200) {
        onSuccessAction("Cập nhật đại lý thành công!", () => {
          this.props.history.push("/quan-ly-dai-ly");
        });
      }
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi cập nhật!");
    } finally {
      loading.stopRunLoading();
    }
  };
}

export default AgencyUpdate;
