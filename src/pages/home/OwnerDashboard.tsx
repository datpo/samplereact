import React, {Component} from 'react'
import { Statistic, Icon } from 'antd';
import LinesChart from "../../components/common/chart/LinesChart";
import AmChartPie from "../../components/common/chart/AmChartPie";
import AmChartColumn from "../../components/common/chart/AmChartColumn";
import AmChartDonut from "../../components/common/chart/AmChartDonut";
import {DashboardService} from "../../services/dashboard/DashboardServices";
import $ from "jquery";
import moment from "moment";
interface Props {

}
interface State {

}

export default class OwnerDashboard extends Component<Props, State> {
    state = {
        totalReqDigitalCert: '',
        totalReqTokenCTS: '',
        totalCustomer: '',
        dataSourcePieChart: [{
            status:"",
            value: 0,
        }],
        dataSourceColumnChart: [{
            object: 0,
            currentMonth: 0,
            lastMonth: 0,
        }],
        colorCurrentMonth: '',
        colorLastMonth: '',
        currentMonth: '',
        lastMonth: '',
        dataSourceDonutChart: [{
            status: "",
            value: 0,
        }],
        dataSourceLineChart: [{
            name: '',
            data: [],
        }]
    };

    fetchData = async () => {
        const resultTotal = await DashboardService.totalByUser();
        const resultTotalReqByMonth = await DashboardService.totalByMonth();
        const resultTotalReqByObject = await DashboardService.totalByObject();
        const resultTotalReqTokenCTS = await DashboardService.totalReqTokenCTS();
        const resultDigitalByYear = await DashboardService.totalDigitalByYear();
        this.setState({
            totalReqDigitalCert: resultTotal.totalReqDigCert,
            totalReqTokenCTS: resultTotal.totalReqTokenCTS,
            totalCustomer: resultTotal.totalCustomer,
            dataSourcePieChart: resultTotalReqByMonth.data,
            dataSourceColumnChart: resultTotalReqByObject.data,
            currentMonth: resultTotalReqByObject.currentMonth,
            lastMonth: resultTotalReqByObject.lastMonth,
            dataSourceDonutChart: resultTotalReqTokenCTS.data,
            dataSourceLineChart: resultDigitalByYear.data,
            colorCurrentMonth: resultTotalReqByObject.colorCurrentMonth,
            colorLastMonth: resultTotalReqByObject.colorLastMonth,
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

    render() {
        return (
            <div className="col-md-12 pl-0 pr-0 h-full card_background" style={{flexDirection: "column", height: '815px'}}>
                <div className="card col-md-12 pl-0 pr-0 card_background" style={{flexDirection: 'row', width:'100%', height:'58%'}}>
                    <div className="col-md-9 card-dashboard pl-0 card_background " style={{flexDirection: 'row', height: '100%'}}>
                        <div className="card col-md-12 card-dashboard pl-0 card_background pr-0" style={{flexDirection: 'row', height: '35%'}}>
                            <div className="card-body col-md-4 pl-0">
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
                                            title="Số lượng yêu cầu chứng thư số"
                                            value={this.state.totalReqDigitalCert}
                                            valueStyle={{ color: '#fff', fontSize: '18px', fontWeight:'bold'}}
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
                            <div className="card-body col-md-4 pl-0">
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
                                            title="Số lượng yêu cầu tài liệu bán hàng"
                                            value={this.state.totalReqTokenCTS}
                                            valueStyle={{ color: '#fff', fontSize: '18px',fontWeight:'bold' }}
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
                            <div className="card-body col-md-4 pl-0">
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
                                            title="Số lượng khách hàng"
                                            value={this.state.totalCustomer}
                                            valueStyle={{ color: '#fff', fontSize: '18px', fontWeight:'bold', paddingBottom:'5px' }}
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
                        </div>
                        <div className="card col-md-12 card-dashboard pl-0 pb-4 card_background pr-0" style={{flexDirection: 'row', height: '67%'}}>
                            <div className="card card-dashboard box-shadow" style={{ borderRadius:'10px',float:'left', width:'47%', height: '100%'}}>
                                <div className={"card-body col-md-12 pl-0 pt-0 pb-0"} id={"pieChart"}/>
                                <AmChartPie data={this.state.dataSourcePieChart}/>
                            </div>
                            <div className="card card-dashboard ml-5 box-shadow" style={{borderRadius:'10px', float:'right', width:'47%', height: '100%'}}>
                                <div className={"card-body col-md-12 pl-0 pt-0 pb-0"} style={{height:'105%'}} id={"columnChart"} />
                                <AmChartColumn data={this.state.dataSourceColumnChart} currentMonth={this.state.currentMonth} lastMonth={this.state.lastMonth} colorCurrentMonth={this.state.colorCurrentMonth} colorLastMonth={this.state.colorLastMonth}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 card-dashboard pl-0 pr-0 box-shadow card_background" style={{borderRadius:'5px',height: '97%'}}>
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
                <div className="card col-md-12 card-dashboard pl-0 pt-3 pr-0 card_background" style={{flexDirection: 'row' , height:'42%'}}>
                    <div className="card card-dashboard box-shadow " style={{borderRadius:'10px',float:'left', width:'36%', height: '100%'}}>
                        <div className={"card-body col-md-12 pl-0 pt-0 pb-4"} id={"donutChart"}/>
                        <AmChartDonut data={this.state.dataSourceDonutChart}/>
                    </div>
                    <div className="card card-dashboard ml-5 box-shadow" style={{borderRadius:'10px', float:'right', width:'64%', height: '100%'}}>
                        <LinesChart data={this.state.dataSourceLineChart}/>
                    </div>
                </div>
            </div>
        )
    }
}

