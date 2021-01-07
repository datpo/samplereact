import {Component} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
interface Props {
    data: any,
    currentMonth: any,
    lastMonth: any,
    colorCurrentMonth: string,
    colorLastMonth: string,
}
interface State {
}
export default class AmChartColumn extends Component<Props, State>{
    render() {
        am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        if(!document.getElementById('columnChart')){
            return false
        }

        let chart = am4core.create('columnChart', am4charts.XYChart);

        chart.data = this.props.data;

        let title = chart.titles.create();
        title.text = "Số lượng yêu cầu CTS trong các tháng";
        title.fontSize = 20;
        title.marginBottom = 20;

        chart.colors.step = 2;
        chart.legend = new am4charts.Legend();
        chart.legend.position = 'bottom';
        chart.legend.labels.template.maxWidth = 95;
        chart.cursor = new am4charts.XYCursor();
        chart.logo.disabled = true;
        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = 'object';
        xAxis.renderer.cellStartLocation = 0.1;
        xAxis.renderer.cellEndLocation = 0.9;
        xAxis.renderer.grid.template.location = 0;

// xAxis.renderer.minGridDistance = 60;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

        yAxis.renderer.minWidth = 50;
        yAxis.cursorTooltipEnabled = false;

        function createSeries(value, name, color) {
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = value;
            series.dataFields.categoryX = 'object';
            series.name = name;
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.sequencedInterpolation = true;
            series.columns.template.fill = am4core.color(color);
            series.columns.template.strokeWidth = 0;
            series.columns.template.column.cornerRadiusTopLeft = 5;
            series.columns.template.column.cornerRadiusTopRight = 5;
            series.columns.template.column.fillOpacity = 0.8;

            let hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.cornerRadiusTopLeft = 0;
            hoverState.properties.cornerRadiusTopRight = 0;
            hoverState.properties.fillOpacity = 1;


            return series;
        }
        createSeries("lastMonth", this.props.lastMonth, this.props.colorLastMonth);
        createSeries("currentMonth", this.props.currentMonth, this.props.colorCurrentMonth);

        return (
            true
        );
    }
}