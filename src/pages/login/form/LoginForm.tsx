import React, { Component } from "react";
import { Form, Icon, Input, Button, Alert } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { authenticationService } from "../../../services/authentication/AuthenticationService";
import { History } from "history";
import { onFailAction } from "../../../helpers/SwalCommon";
import { loading } from "../../../components/common/loading/Loading";
import { UserServices } from "services/user/UserServies";
import Axios from "axios";
import { permissionMenu } from "helpers/NewCaCrmHelper";

interface Props extends FormComponentProps {
  history: History;
  setUser: any;
}
interface State {
  message: string;
  isDisplayMessage: boolean;
}

class LoginForm extends Component<Props, State> {
  state = {
    message: "",
    isDisplayMessage: false
  };

  loginByCert = () => {
    Axios.get(window.location.origin + "/index.php").then(async res => {
      const info = res.data;
      if (info !== null && info.cert !== false && info.seri !== false) {
        const user = await authenticationService.loginByCert(
          info.cert,
          info.seri
        );
        if (user && user.token) {
          this.props.setUser(user.data);
          window.location.reload();

        } else if (user && user.status === 1) {
          this.setState({
            message: user.message,
            isDisplayMessage: true
          });
        }
      }
      else {
        this.setState({ message: "Thông tin chứng thư số không đầy đủ",isDisplayMessage: true });
      }
    }).catch(error => {
      this.setState({
        message: "Trình duyệt hiện tại không thể đăng nhập chứng thư số",
        isDisplayMessage: true
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { validateFields, getFieldValue } = this.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          loading.runLoadingBlockUI();
          const user = await authenticationService.login(
            getFieldValue("username"),
            getFieldValue("password")
          );
          if (user && user.token) {
            const userService = new UserServices();
            const userResult = await userService.getUserAuth();
            let perList = await permissionMenu(userResult.data.permission_list);
            userResult.data.permission_list = perList
            this.props.setUser(userResult.data);
            this.props.history.push("/");
            window.location.reload();
          } else if (user && user.status === 1) {
            this.setState({
              message: user.message,
              isDisplayMessage: true
            });
          }
        } catch (error) {
          onFailAction(error.message);
        } finally {
          loading.stopRunLoading();
        }
      }
    });
  };

  componentDidMount() {
    // this.loginByCert();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { message, isDisplayMessage } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <span className="login100-form-title p-b-32 text-center">
          <div className="text-center mt-1" >
            <img
                src={"/images/logo2.jpg"}
                width="auto"
                height="40"
                className="d-inline-block align-center"
                alt=""
            />
          </div>
        </span>
        <span className="txt1 p-b-11">Tài khoản</span>
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [
              { required: true, message: "Tài khoản không thể bỏ trống!" }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              className="form-control input100"
            />
          )}
        </Form.Item>
        <span className="txt1 p-b-11">Mật khẩu</span>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Mật khẩu không thể bỏ trống!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              className="form-control input100"
              autoComplete="off"
            />
          )}
        </Form.Item>
        <Form.Item>
          {isDisplayMessage ? (
            <Alert message={message} type="error" showIcon />
          ) : (
            ""
          )}
          {/* <Link className="login-form-forgot" to="/">
            Forgot password
          </Link> */}
          <div className="container-login100-form-btn text-center justify-content-center pt-1">
            <Button htmlType="submit" className="login100-form-btn">
              Login
            </Button>
            <Button htmlType="button" className="login100-form-btn" onClick={this.loginByCert}>
              Login by Token
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create<Props>({ name: "Login" })(LoginForm);

export default WrappedNormalLoginForm;
