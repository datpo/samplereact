import React, { Component } from "react";
import Chart from "react-apexcharts";

interface Props {
    data: any
}

interface State {
    options?: any,
}

export default class LinesChart extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    // width: [5, 7, 5],
                    // curve: 'straight',
                    // dashArray: [0, 8, 5]
                },
                legend: {
                    tooltipHoverFormatter: function(val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                    }
                },
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6
                    }
                },
                xaxis: {
                    categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
                    ],
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val;
                                }
                            }
                        }
                    ]
                },
                grid: {
                    borderColor: '#f1f1f1',
                }
            },


        };
    }

    render() {
        return (
            <div className={"card-body col-md-12 pl-0 pt-0 pb-0"} style={{height: '95%'}} id={"chart"}>
                <p className="col-md-12 text-center fs-20" style={{height: '10%'}}>Yêu cầu chứng thư số </p>
                <Chart options={this.state.options} series={this.props.data} type="line" height={'95%'} width={'95%'}/>
            </div>


        );
    }

}