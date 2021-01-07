import React, { Component } from "react";
import "../../common/css/dashboard.css";
import { List } from "antd";
import {NUMBER_COLOR} from "./enum/color";
import {DashboardService} from "../../services/dashboard/DashboardServices";
interface Props {
    dataSource?: any
}
interface State {
}
export default class ListTop extends Component<Props, State> {
    state = {
        dataSource: [{
            id:0,
            name:"",
            description: "",
            number:""
        }]
    };
    // handleInfiniteOnLoad = () => {
    //
    // };
    componentDidMount() {
        this.fetch()
    }
    fetch = async (params = {}) => {
        const resultTopOwner = await DashboardService.topOwner();
        this.setState({dataSource: resultTopOwner})
    };
    render() {
        return (
            <React.Fragment>
                <div className={"card-body col-md-12 pl-0 pt-0 pb-0"} style={{height: '95%'}}>
                        <div className="card-feeds"><span className="">Top Đại lý/ CTV</span></div>
                        <div className="p-2">
                            <List
                                dataSource={this.state.dataSource}
                                // loadMore={this.handleInfiniteOnLoad}
                                renderItem={item => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            avatar={
                                                <span className="fa-stack fa-3x" style={{color:`${NUMBER_COLOR[item.id]}`}}>
                                            <i className="fa fa-circle fa-stack-2x"></i>
                                            <strong className="fa-stack-1x">{item.id}</strong>
                                        </span>
                                            }
                                            title={item.name}
                                            description={item.description}
                                        />
                                        <div><i>{item.number} yêu cầu</i></div>
                                    </List.Item>
                                )}
                            />
                        </div>
                </div>
            </React.Fragment>
        );
    }
}