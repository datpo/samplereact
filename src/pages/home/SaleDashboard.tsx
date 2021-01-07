import React, {Component} from 'react'
import { Statistic, Icon } from 'antd';
import AmChartColumn from "../../components/common/chart/AmChartColumn";
import {DashboardService} from "../../services/dashboard/DashboardServices";
import ListTop from "./ListTop";
import '../../public/js/index';
import $ from "jquery";
import moment from "moment";
interface Props {

}
interface State {

}

export default class SaleDashboard extends Component<Props, State> {
    state = {
        dataSourceColumnChart: [{
            object: 0,
            currentMonth: 0,
            lastMonth: 0,
        }],
        currentMonth: '',
        lastMonth: '',
        totalAgency: 0,
        totalContributor: 0,
        totalReqDigitalCert: 0,
        totalReqTokenCTS: 0,
        colorCurrentMonth: '',
        colorLastMonth: '',
    };

    fetchData = async () => {
        const resultTotalReqByObject = await DashboardService.totalByObject();
        const totalDataForSale = await DashboardService.totalDataForSale();
        this.setState({
            dataSourceColumnChart: resultTotalReqByObject.dataForSale,
            currentMonth: resultTotalReqByObject.currentMonth,
            lastMonth: resultTotalReqByObject.lastMonth,
            colorCurrentMonth: resultTotalReqByObject.colorCurrentMonth,
            colorLastMonth: resultTotalReqByObject.colorLastMonth,
            totalAgency: totalDataForSale.totalAgency,
            totalContributor: totalDataForSale.totalContributor,
            totalReqDigitalCert: totalDataForSale.totalReqDigitalCert,
            totalReqTokenCTS: totalDataForSale.totalReqTokenCTS,
        });
    };
    componentDidMount() {
        this.fetchData();
    }
    componentDidUpdate(){
        var listDiv = $( "#root" ).nextAll();
        listDiv.each(function( index ) {
            if($(this).prop("tagName") === 'DIV'){
                listDiv[index].setAttribute('hidden','hidden')
            }
        });
    }
    formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };

    render() {
        return (
            <div className="col-md-12 pl-0 pr-0 h-full card_background" style={{flexDirection: "column", height: '815px'}}>
                <div className="card col-md-12 pl-0 pr-0 card_background" style={{flexDirection: 'row', width:'100%', height:'20%'}}>
                    <div className="card col-md-12 card-dashboard pl-0 card_background pr-0" style={{flexDirection: 'row', height: '100%'}}>
                            <div className="card-body col-md-3 pl-0">
                                <div className={"box-shadow"} style={{
                                    background: 'linear-gradient(to right, #FE9365, #FEB697)',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: '5px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(to right, #FE9365, #FEB697)',
                                        padding: '15px',
                                        height: '65%',
                                        borderRadius: '5px'
                                    }}>
                                        <Statistic
                                            title="Số lượng đại lý"
                                            value={this.state.totalAgency}
                                            valueStyle={{ color: '#fff', fontSize: '20px', fontWeight:'bold'}}
                                            style={{color: '#fff'}}
                                        />
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(to right, #FE9365, #FEB697)',
                                        borderTop: '1px solid rgb(236, 236, 236)',
                                        height: '15%',
                                        padding: '5px 0 0 15px'
                                    }}>
                                        <Statistic
                                            value={'update: ' + moment(new Date()).format("DD/MM/YYYY").toLocaleString()}
                                            valueStyle={{ color: '#fff', fontSize:'13px'}}
                                            prefix={<Icon type="clock-circle" />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body col-md-3 pl-0">
                                <div className={"box-shadow"} style={{
                                    background: 'linear-gradient(to right, #0AC282, #0DF2A3)',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: '5px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(to right, #0AC282, #0DF2A3)',
                                        padding: '15px',
                                        height: '65%',
                                        borderRadius: '5px'
                                    }}>
                                        <Statistic
                                            title="Số lượng cộng tác viên"
                                            value={this.state.totalContributor}
                                            valueStyle={{ color: '#fff', fontSize: '20px',fontWeight:'bold' }}
                                            style={{color: '#fff'}}
                                        />
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(to right, #0AC282, #0DF2A3)',
                                        borderTop: '1px solid rgb(236, 236, 236)',
                                        height: '15%',
                                        padding: '5px 0 0 15px'
                                    }}>
                                        <Statistic
                                            value={'update: ' + moment(new Date()).format("DD/MM/YYYY").toLocaleString()}
                                            valueStyle={{ color: '#fff', fontSize:'13px'}}
                                            prefix={<Icon type="clock-circle" />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body col-md-3 pl-0">
                                <div className={"box-shadow"} style={{
                                    background: 'linear-gradient(to right, #FE5E71, #FE8F9C)',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: '5px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(to right, #FE5E71, #FE8F9C)',
                                        padding: '15px',
                                        height: '65%',
                                        borderRadius: '5px'
                                    }}>
                                        <Statistic
                                            title="Số lượng yêu cầu chứng thư số"
                                            value={this.state.totalReqDigitalCert}
                                            valueStyle={{ color: '#fff', fontSize: '20px', fontWeight:'bold' }}
                                            style={{color: '#fff'}}
                                        />
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(to right, #FE5E71, #FE8F9C)',
                                        borderTop: '1px solid rgb(236, 236, 236)',
                                        height: '15%',
                                        padding: '5px 0 0 15px'
                                    }}>
                                        <Statistic
                                            value={'update: ' + moment(new Date()).format("DD/MM/YYYY").toLocaleString()}
                                            valueStyle={{ color: '#fff', fontSize:'13px'}}
                                            prefix={<Icon type="clock-circle" />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body col-md-3 pl-0 pr-0">
                                <div className={"box-shadow"} style={{
                                    background: 'linear-gradient(to right, #2E64FE, #00BFFF)',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: '5px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(to right, #2E64FE, #00BFFF)',
                                        padding: '15px',
                                        height: '65%',
                                        borderRadius: '5px'
                                    }}>
                                        <Statistic
                                            title="Số lượng yêu cầu tài liệu bán hàng"
                                            value={this.state.totalReqTokenCTS}
                                            valueStyle={{ color: '#fff', fontSize: '20px', fontWeight:'bold'}}
                                            style={{color: '#fff'}}
                                        />
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(to right, #2E64FE, #00BFFF)',
                                        borderTop: '1px solid rgb(236, 236, 236)',
                                        height: '15%',
                                        padding: '5px 0 0 15px'
                                    }}>
                                        <Statistic
                                            value={'update: ' + moment(new Date()).format("DD/MM/YYYY").toLocaleString()}
                                            valueStyle={{ color: '#fff', fontSize:'13px'}}
                                            prefix={<Icon type="clock-circle" />}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="card col-md-12 card-dashboard pl-0 pt-4 pr-0 card_background" style={{flexDirection: 'row' , height:'47%'}}>
                    <div className="card card-dashboard box-shadow mr-4" style={{borderRadius:'10px',float:'left', width:'36%', height: '100%'}}>
                        <div className={"card-body col-md-12 pl-0 pt-0 pb-0"} style={{height:'105%'}} id={"columnChart"} />
                        <AmChartColumn data={this.state.dataSourceColumnChart} currentMonth={this.state.currentMonth} lastMonth={this.state.lastMonth} colorLastMonth={this.state.colorLastMonth} colorCurrentMonth={this.state.colorCurrentMonth}/>
                    </div>
                    <div className="card card-dashboard box-shadow mr-4" style={{borderRadius:'10px',float:'left', width:'36%', height: '100%'}}>
                        <ListTop />
                    </div>
                    <div className="card card-dashboard pl-0 box-shadow card_background" style={{borderRadius:'5px',height: '100%', width:'25%'}}>
                            <img
                                src={"/images/ctkm.png"}
                                width="100%"
                                height="100%"
                                className="d-inline-block align-center"
                                alt=""
                                style={{borderRadius: '10px'}}
                            />
                    </div>
                </div>
            </div>
        )
    }
}

