import React, {Component} from 'react';
import { Table, Card, Input, Row, Col, Button, Tag, Icon } from 'antd';

class CardContent extends Component{
    constructor(props){
        super(props);
        this.state = {
            display:true
        }
    }

    xemthem = (e) =>{
        e.preventDefault();
        console.log("event: ", e.target)
        var currentDis = this.state.display;
        this.setState({ display: !currentDis });
    }

    render(){
        console.log("fuckkkkk:", this.props.item);
        return(
            <Card className="m-r-15-i m-l-15-i mt-1" style={{ marginLeft: 5 }} size="small">
                        <Row>
                            <Col span={6}><p>Loại: {this.props.item.type}</p></Col>
                            <Col span={6} offset={12}>
                                <Col span={2}><Icon type="setting" style={{ marginLeft: 80 }}></Icon></Col>

                                <Col span={2} offset={2}><Icon type={this.props.item.checkItem ? "home" : "info"} style={{ marginLeft: 80 }}></Icon></Col>
                            </Col>
                        </Row>                      
                            <p>Tên: {this.props.item.name}</p>                        
                        <button style={{ display: this.state.display === true ? "" : "none" }} onClick={this.xemthem}>{"Xem thêm"}</button>
                        <p style={{ display: this.state.display === true ? "none" : "" }}>Mô tả: {this.props.item.des}</p>
                        <p style={{ display: this.state.display === true ? "none" : "" }}>Người tạo: {this.props.item.creator}</p>
                        <p style={{ display: this.state.display === true ? "none" : "" }}>Ngày tạo: {this.props.item.date}</p>
                        <button style={{ display: this.state.display === true ? "none" : "" }} onClick={this.xemthem}><Icon type="up"></Icon></button>
                    </Card>
        )
    }
}

export default CardContent;