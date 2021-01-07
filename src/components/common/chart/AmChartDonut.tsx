import {Component} from 'react';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

interface Props {
    data: any,
}
interface State {

}
export default class AmChartDonut extends Component<Props, State>{
    render() {
        am4core.useTheme(am4themes_frozen);
        am4core.useTheme(am4themes_animated);

        if(!document.getElementById('donutChart')){
            return false
        }
        let chart = am4core.create("donutChart", am4charts.PieChart);
        chart.data = this.props.data;
        chart.logo.disabled = true;
        let title = chart.titles.create();
        title.text = "Yêu cầu thiết bị bán hàng";
        title.fontSize = 20;
        title.marginTop = 10;

        chart.legend = new am4charts.Legend();

        chart.innerRadius = am4core.percent(50);

// Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "status";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template.propertyFields.fill = "color";

        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
// This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        return (
            true
        );
    }
}