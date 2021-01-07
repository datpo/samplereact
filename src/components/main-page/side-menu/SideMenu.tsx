import React, {Component} from "react";
import { Layout, Menu, Icon } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import { checkPermission } from "../../../helpers/NewCaCrmHelper";
import { Location } from "history";
import _ from "lodash";
import { MENU_CONSTANT } from "../../routes/Menu";
import Badges from "../../common/badge/Badges";
import store from "../../../store/store";
const { Sider } = Layout;

interface Props {
  location: Location;
}
interface State {
  collapsed: boolean;
  typeUser: boolean;
}

export default class SideMenu extends Component<Props, State> {
  state = {
    collapsed: false,
    defaultOpenKey:"",
    typeUser: true,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {}

  getSelectedMenu = () => {
    const pathName = this.props.location.pathname;
    let selectedKey = "";
    let openKey = "";
    _.forEach(MENU_CONSTANT, function(o) {
      if (_.startsWith(pathName, o.link)) selectedKey = o.key;
      _.forEach(o.childMenu, function(child) {
        if (_.startsWith(pathName, child.link)) {
          selectedKey = child.key;
          openKey = o.key;
        }
      });
    });
    return {selectedKey,openKey};
  };
  render() {
    const user = store.getState().authReducer;
    return (
      <Sider
        collapsible
        width={277}
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
        className="menu-side-left"
      >
        <a href="/">
          <div className="logo cursor-pointer"></div>
        </a>
        <Menu
          theme="light"
          mode="inline"
          defaultOpenKeys={[this.getSelectedMenu().openKey]}
          defaultSelectedKeys={[this.getSelectedMenu().selectedKey]}
        >
          {MENU_CONSTANT.map(menu => {
            if (menu.childMenu.length > 0) {
              return checkPermission(menu.permission) ? (
                <SubMenu
                  key={menu.key}
                  title={
                    <span>
                      <Icon type={menu.icon} />
                      <span className="sider-label">{menu.displayName}</span>
                      {menu.link === 'manager-co-operate' && Number(user.number_total_manager_co_operate) > 0  ? <Badges count={Number(user.number_total_manager_co_operate)}></Badges>  : ''}
                      {menu.link === 'support-sale' && Number(user.number_total_support_sale) >0 && Number(user.type) === 6 ? <Badges count={Number(user.number_total_support_sale)}></Badges>  : '' }
                    </span>
                  }
                >
                  {menu.childMenu.map(subItem => {
                    return checkPermission(subItem.permission) ? (
                      <Menu.Item key={subItem.key} title={subItem.displayName}>
                        <Link to={subItem.link}></Link>
                        <Icon type={subItem.childIcon} />
                        <span className="sider-label">{subItem.displayName}</span>
                        {subItem.link === '/quan-ly-dai-ly' && Number(user.number_create_agency) && Number(user.type) === 6 ? <Badges count={Number(user.number_create_agency)}></Badges>  : ''}
                        {subItem.link === '/quan-ly-ctv' && Number(user.number_create_contributor) && Number(user.type) === 6 ? <Badges count={Number(user.number_create_contributor)}></Badges>  : ''}
                        {subItem.link === '/yeu-cau-token' && Number(user.number_create_acc_qlbh) && Number(user.type) === 6 ? <Badges count={Number(user.number_create_acc_qlbh)}></Badges> : ''}
                        {subItem.link === '/yeu-cau-dung-hop-tac' && Number(user.number_request_stop_owner) && Number(user.type) === 7 ? <Badges count={Number(user.number_request_stop_owner)}></Badges> : ''}
                        {subItem.link === '/yeu-cau-dung-hop-tac' && Number(user.number_request_stop_owner) && Number(user.type) === 8 ? <Badges count={Number(user.number_request_stop_owner)}></Badges> : ''}
                        {subItem.link === '/danh-sach-yeu-cau-dung-hop-tac' && Number(user.number_request_stop) && Number(user.type) === 6 ? <Badges count={Number(user.number_request_stop)}></Badges> : ''}

                        {subItem.link === '/yeu-cau-token-cts' && Number(user.number_create_doc_qlbh) && Number(user.type) === 6 ? <Badges count={Number(user.number_create_doc_qlbh)}></Badges> : ''}
                        {subItem.link === '/yeu-cau-dao-tao' && Number(user.number_request_training) && Number(user.type) === 6 ? <Badges count={Number(user.number_request_training)}></Badges> : ''}
                      </Menu.Item>
                    ) : (
                      ""
                    );
                  })}
                </SubMenu>
              ) : (
                ""
              );
            }else {
              return checkPermission(menu.permission) ? (
                <Menu.Item key={menu.key}>
                  <Link to={menu.link}></Link>
                  <Icon type={menu.icon}></Icon>
                  <span>{menu.displayName}</span>
                </Menu.Item>
              ) : (
                ""
              );
            }
          })}
        </Menu>
      </Sider>
    );
  }
}