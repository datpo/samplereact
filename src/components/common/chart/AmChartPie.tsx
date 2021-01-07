import {Component} from 'react';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

interface Props {
    data: any,
}
interface State {

}

export default class AmChartPie extends Component<Props, State>{
    render() {
        am4core.useTheme(am4themes_kelly);
        am4core.useTheme(am4themes_animated);

        if(!document.getElementById('pieChart')){
            return false
        }
        let chart = am4core.create("pieChart", am4charts.PieChart);
        let title = chart.titles.create();
        title.text = "Yêu cầu chứng thư số";
        title.fontSize = 20;
        title.marginTop = 10;
        chart.logo.disabled = true;
        chart.data = this.props.data;
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "status";

        pieSeries.slices.template.propertyFields.fill = "color";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

pieSeries.labels.template.disabled = true;
pieSeries.ticks.template.disabled = true;
// chú thích
chart.legend = new am4charts.Legend();
// chart.legend.position = "right";
// This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        return (
            true
        );
    }
}