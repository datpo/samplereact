import React, { Component } from "react";
import PageWrapper from "../../wrapper/PageWrapper";
import { match } from "react-router";
import { History, Location } from "history";
import { AgencyService } from "../../../services/agency/AgencyServices";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import AgencyApproveForm from "./form/AgencyApproveForm";
import moment from "moment";
import AgencyApproveButtonGroupSave from "./button-group/AgencyApproveButtonGroupSave";
import { loading } from "../../../components/common/loading/Loading";
import { onSuccessAction, onFailAction } from "../../../helpers/SwalCommon";
import AgencyApproveFormModalReason from "./form/modal/AgencyApproveFormModalReason";
import InputWithLabel from "./../../../components/common/form/input-with-label/InputWithLabel";

interface Props extends FormComponentProps {
  location: Location;
  history: History;
  match: match<{
    id: string;
  }>;
  user: any;
}
interface State {
  loading: boolean;
  agencyModel: any;
  modalVisible: boolean;
  reason: string;
  status: string;
  loadingButtonModal: boolean;
  reason_manager: string;
  reason_htkd: string;
}

class AgencyPreview extends Component<Props, State> {
  state = {
    loading: true,
    agencyModel: {} as any,
    modalVisible: false,
    reason: "",
    status: "",
    reason_manager: "",
    reason_htkd: "",
    loadingButtonModal: false,
  };

  componentDidMount() {
    this.getModelBeforeUpdate();
  }

  async getModelBeforeUpdate() {
    const agencyService = new AgencyService();
    try {
      const agencyModel = await agencyService.getAgencyToPreview(
        this.props.match.params.id
      );
      const data = agencyModel.data;
      this.setState({
        loading: false,
        reason_manager: data.history_deny_manager ? data.history_deny_manager.content: '',
        reason_htkd: data.history_deny_h_t_k_d ? data.history_deny_h_t_k_d.content : '',
        status: String(data.status),
        agencyModel: data,
      });
      this.props.form.setFieldsValue({
        name: data.fullname,
        tax_code: data.tax_code,
        sortname: data.sortname,
        code: data.code,
        phone: data.phone,
        email: data.email,
        deputy: data.deputy,
        deputy_position: data.deputy_position,
        address: data.address,
        office_address: data.office_address,
        field_id: data.field_id,
        personnal_scale: data.personnal_scale,
        supply_capacity: data.supply_capacity,
        competitive_area: data.competitive_area,
        bank_number: data.bank_number,
        bank_branch: data.bank_branch,
        contract_date: moment(data.contract.contract_date),
        contract_number: data.contract.code,
        discount: parseInt(data.discount_rate.value),
        contract_type: data.type.toString(),
        is_cooperate: data.is_cooperate,
        product: data.product,
      });
      this.setLeaderShipdata(data);
    } catch (error) {
      // TODO Anhnt
      // this.props.history.push("/404", null);
    }
  }

  setLeaderShipdata = (data) => {
    const { setFieldsValue } = this.props.form;
    const leaderShip = data.leaderShip;
    if (leaderShip)
      setFieldsValue({
        directorName: leaderShip.name,
        directorEmail: leaderShip.email,
        directorPhone: leaderShip.phone,
        directorPosition: leaderShip.position,
      });
    const arrayKey = [
      "business",
      "businessSkill",
      "supportCustomer",
      "accountant",
    ];
    arrayKey.forEach(function (key) {
      let dataContact = data[key];
      if (dataContact) {
        setFieldsValue({
          [`${key}Name`]: dataContact.name,
          [`${key}Email`]: dataContact.email,
          [`${key}Phone`]: dataContact.phone,
          [`${key}Position`]: dataContact.position,
        });
      }
    });
  };

  render() {
    const { agencyModel, loadingButtonModal } = this.state;
    return (
      <PageWrapper title="Xem chi tiết đại lý" loading={this.state.loading}>
        {this.state.reason_manager && this.state.status === '5' ? (
          <InputWithLabel
            form={this.props.form}
            label="Lý do từ chối của giám đốc"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={this.state.reason_manager}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        {this.state.reason_htkd && this.state.status === '3' ? (
          <InputWithLabel
            form={this.props.form}
            label="Lý do từ chối của HTKD"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={this.state.reason_htkd}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        <AgencyApproveForm form={this.props.form} agencyModel={agencyModel} />
        <AgencyApproveButtonGroupSave
          onAcceptAgency={this.onAcceptAgency}
          onClickDecline={this.onClickDecline}
          agencyStatus={agencyModel.status}
          user={this.props.user}
        />
        <AgencyApproveFormModalReason
          modalVisible={this.state.modalVisible}
          onCancelModelDecline={this.onCancelModelDecline}
          onOkModalDecline={this.onOkModalDecline}
          loading={loadingButtonModal}
        />
      </PageWrapper>
    );
  }

  onOkModalDecline = async (value) => {
    try {
      const agencyService = new AgencyService();
      const result = await agencyService.declineAgency(
        this.props.match.params.id,
        { reason: value }
      );
      this.setState({ loadingButtonModal: true });
      if (result && result.status === 200) {
        onSuccessAction("Từ chối yêu cầu thành công!", () =>
          this.props.history.push("/quan-ly-dai-ly")
        );
      }
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi từ chối!");
    } finally {
      this.setState({ loadingButtonModal: false });
    }
  };

  onCancelModelDecline = () => {
    this.setState({
      modalVisible: false,
    });
  };

  onClickDecline = () => {
    this.setState({ modalVisible: true });
  };

  onAcceptAgency = async () => {
    try {
      const agencyService = new AgencyService();
      loading.runLoadingBlockUI();
      const result = await agencyService.acceptAgency(
        this.props.match.params.id
      );
      if (result && result.status === 200) {
        onSuccessAction("Duyệt yêu cầu thành công!", () =>
          this.props.history.push("/quan-ly-dai-ly")
        );
      }
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi duyệt hồ sơ!");
    } finally {
      loading.stopRunLoading();
    }
  };
}

const WrappedComponent = Form.create<Props>({
  name: "AgencyFormPreview",
})(AgencyPreview);

export default WrappedComponent;
