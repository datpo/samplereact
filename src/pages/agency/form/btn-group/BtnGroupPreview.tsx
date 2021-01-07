import React, {Component} from "react";
import SelectWithLabel from "../../../../components/common/form/input-with-label/SelectWithLabel";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { CONTRACT_TYPE_OPTIONS, AgencyEnum } from "../../enum/AgencyEnum";
import { Modal, Button, Spin, Dropdown,Icon } from "antd";
import { AgencyService } from "../../../../services/agency/AgencyServices";
import { onFailAction } from "../../../../helpers/SwalCommon";
import MenuDropAddendum from "./menu-drop-addendum/MenuDropAddendum";
import InputWithLabel from "../../../../components/common/form/input-with-label/InputWithLabel";
import { loading } from "../../../../components/common/loading/Loading";
import InputFileUpload from './../../../../components/common/form/input-with-label/InputFileUpload';

interface Props {
  form: WrappedFormUtils;
  defaultContractTypeValue?: number;
  disabled?: boolean;
  contract?: any;
  file_contract_paper?: any;
  onClickDownloadFile?: any;
  id?: string;
  create?: boolean;
  update?: boolean;
}
interface State {
  visible: boolean;
  loading: boolean;
  file: string;
  contractNumberDisable:boolean;
}

export default class BtnGroupPreview extends Component<Props, State> {
  state = {
    visible: false,
    loading: false,
    file: "",
    contractNumberDisable:false,

  };

  onRenderPreviewButton = () => {
    const formValue = this.props.form.getFieldValue("contract_type");

    if (parseInt(formValue) === AgencyEnum.DIGITAL_CONTRACT) {
      return (
          <div className="col form-group nopadding">
            <button
                onClick={this.onDisplayContractFile}
                className="btn ml-5 mt-4 btn-primary"
            >
              Hợp đồng điện tử
            </button>
            <Dropdown
                overlay={
                  <MenuDropAddendum
                      onClick={this.onDisplayAddendumFile}
                      addendum1={!!(this.props.form.getFieldValue("product") && this.props.form.getFieldValue("product").includes("1"))}
                      addendum2={!!(this.props.form.getFieldValue("product") && this.props.form.getFieldValue("product").includes("2"))}
                      addendum3={!!(this.props.form.getFieldValue("product") && this.props.form.getFieldValue("product").includes("3"))}
                  />
                }
                trigger={["click"]}
                placement="bottomLeft"
            >
              <button className="btn ml-5 mt-4 btn-primary ">Phụ lục <Icon type="down" /></button>
            </Dropdown>
            <button
                onClick={this.onDisplayAgencyReport}
                className="btn ml-5 mt-4 btn-primary"
            >
              Tờ trình
            </button>
          </div>
      );
    } else if (parseInt(formValue) === AgencyEnum.PAPER_CONTRACT) {
      const { form, file_contract_paper,contract} = this.props;
      return (
          <div className="col form-group nopadding input-group">
            <InputFileUpload
                classWrapped="col-md-6"
                label="File Hợp đồng"
                name="file_contract_paper"
                form={form}
                defaultLabel={file_contract_paper ? file_contract_paper.name : contract ? contract.code : ''}
                onClickDownloadFile={this.onDisplayFileContractPaper}
                extentionsAllow={['pdf', 'PDF']}
                accept={".pdf"}
            />
            <div className="col-md-6">
              <button
                  onClick={this.onDisplayAgencyReport}
                  className="btn ml-5 mt-4 btn-primary"
              >
                Tờ trình
              </button>
            </div>

          </div>
      );
    }else {
      return (
          ""
      );
    }
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  onChangeContractType = async value =>{
    if (value === "2") {
      this.setState({contractNumberDisable :true});
      try{
        loading.runLoadingBlockUI();
        const agencyService = new AgencyService();
        const contractCode = await agencyService.nextContractCode();
        this.props.form.setFieldsValue({
          contract_number: contractCode
        });
      }finally{
        loading.stopRunLoading();
      }

    } else {
      this.props.form.setFieldsValue({
        contract_number: '',
      });
      this.setState({contractNumberDisable:false});
    }
  }

  render() {
    const { form, defaultContractTypeValue } = this.props;
    const { loading } = this.state;
    return (

        <div className="input-group">
          <SelectWithLabel
              options={CONTRACT_TYPE_OPTIONS}
              form={form}
              label="Loại hợp đồng"
              name="contract_type"
              isRequired={true}
              wrappedClass="col-md-2"
              defaultValue={defaultContractTypeValue ? defaultContractTypeValue.toString() : ""}
              isDisabled={this.props.disabled}
              placeholder="Chọn loại hợp đồng"
              onChange={this.onChangeContractType}
          />
          <InputWithLabel
              form={this.props.form}
              label="Số hợp đồng"
              name="contract_number"
              isRequired={true}
              wrapClass="col-md-4"
              defaultValue={this.props.contract ? this.props.contract.code : ""}
              isDisabled={this.props.disabled ? this.props.disabled : this.state.contractNumberDisable}
          />
          {this.onRenderPreviewButton()}
          <Modal
              title={false}
              visible={this.state.visible}
              footer={[
                <Button
                    key={1}
                    type="primary"
                    onClick={this.handleOk}
                    loading={loading}
                >
                  OK
                </Button>
              ]}
              className="w-75 h-75"
              bodyStyle={{ height: "700px" }}
              style={{ top: "20px" }}
          >
            {loading ? (
                <div className="custom-spin">
                  <Spin size="large" />
                </div>
            ) : (
                <iframe
                    title="Quản lý hợp đồng"
                    src={`data:application/pdf;base64,${this.state.file}`}
                    height="100%"
                    width="100%"
                ></iframe>
            )}
          </Modal>
        </div>
    );
  }

  onDisplayAddendumFile = async index => {
    this.setState({ loading: true, visible: true });
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        const valuesForm = this.props.form.getFieldsValue();
        const agencyService = new AgencyService();
        try {
          const addendum = await agencyService.getAgencyAddendum(valuesForm, index);
          this.setState({
            file: addendum.data.file
          });
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem trước phụ lục!");
        } finally {
          this.setState({
            loading: false
          });
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
        this.setState({
          visible: false
        });
      }
    });

  };

  onDisplayContractFile = async () => {
    const agencyService = new AgencyService();
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        const valuesForm = this.props.form.getFieldsValue();
        this.setState({ loading: true, visible: true });
        try {
          let contract = await agencyService.getAgencyContract(valuesForm);
          this.setState({
            file: contract.data.file
          });
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem hợp đồng!");
        } finally {
          this.setState({
            loading: false
          });
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
        this.setState({
          visible: false
        });
      }
    });
  };
  onDisplayFileContractPaper = async () => {
    const agencyService = new AgencyService();
    this.setState({ loading: true, visible: true });
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        const valuesForm = this.props.form.getFieldsValue();
        try {
          if(this.props.create === false && this.props.update === true){
            let contract = await agencyService.getDocument(this.props.id, 2, 0);
            this.setState({
              file: contract.file
            });
          }
          if(this.props.create === true && this.props.update === false){
            let contract = await agencyService.getAgencyContract(valuesForm);
            this.setState({
              file: contract.data.file
            });
          }

        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem hợp đồng!");
        } finally {
          this.setState({
            loading: false
          });
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
        this.setState({
          visible: false
        });
      }
    });
  };

  onDisplayAgencyReport = async () => {
    const agencyService = new AgencyService();
    const { validateFields } = this.props.form;
    validateFields(async (errors, values) => {
      if (!errors) {
        const valuesForm = this.props.form.getFieldsValue();
        if(!valuesForm['name'] || !valuesForm['tax_code'] || !valuesForm['deputy']){
          onFailAction("Cần điền đầy đủ thông tin để xem tờ trình!");
          return false;
        }
        this.setState({ loading: true, visible: true });

        try {
          let addendum = await agencyService.getAgencyReport(valuesForm);
          this.setState({
            file: addendum.data.file
          });
        } catch (error) {
          onFailAction("Có lỗi xảy ra khi xem tờ trình!");
        } finally {
          this.setState({
            loading: false
          });
        }
      }else {
        onFailAction("Bạn chưa điền đủ thông tin!");
        this.setState({
          visible: false
        });
      }
    });
  };
}
