import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartService } from '../../services/chart/chart.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  // taking all chart properties using inputs passed to this component
  @Input() chartTitle;
  @Input() chartSeries;
  @Input() chartType;
  @Input() chartLabel;
  @Input() chartClass;
  @Input() chartHeight;
  @Input() chartStack;
  @Input() chartYamin;
  @Input() chartLeftLabelChange
  chart;
  loading = true;
  constructor(private chartService: ChartService, private sharedService: SharedService) { }
  ngOnInit() {
    let yamin = 0;
    if (this.chartYamin !== undefined || this.chartYamin !== null) {
      yamin = this.chartYamin;
    }
    let stackChart = '';
    if (this.chartStack !== undefined || this.chartStack !== null) {
      stackChart = this.chartStack;
    } else {
      stackChart = null;
    }
    if (this.chartSeries) {
      const titleChart = this.chartTitle;
      const seriesChart = { series: this.chartService.getChartData(this.chartSeries) };
      let typeChart = this.chartType;
      if(typeChart=='line')typeChart='areaspline'
      const labelChart = this.chartLabel
      let height = this.chartService.getChartHeight(); // if we're not setting the height from API, it will be 60
      if (this.chartHeight) {
        // the height will be set if the chartHeight input is present, else it will use the 60 value
        height = this.chartHeight;
      }
      const color = this.chartService.getChartColor(this.chartType);
      const tooltip = this.chartService.getChartTooltip(true);
      let yAxis
      if (this.chartLeftLabelChange == 'data') {
        yAxis = this.chartService.getChartYAxis(yamin, labelChart, 'data')
      } else {
        yAxis = this.chartService.getChartYAxis(yamin, labelChart, 'number')
      }
      // generating the chart using the properties we got
      // let background;
      // this.sharedService.darkmmode.subscribe(state => {        
      //   if(state){
      //     background = '#121212'
      //   }else{
      //     background = '#fff'
      //   }
      // })

      this.chart = new Chart(<any>{
        chart: {
          zoomType: 'x',
          type: typeChart,
          // Read read the comment above if you want to change this.
          // Use the Input instead of change this.
          height: height + '%',
          // backgroundColor:background,
          style: {
            fontFamily: 'inherit',
          }
        },
        // this is the color variants of the chart elements
        colors: color,
        title: {
          text: '',
          // text: titleChart,
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
              distance: 0
            }
          },
          column: {
            stacking: stackChart
          },
          series: {
            fillOpacity: 0.3,
            marker: {
              enabled: false,
            }
          },
        },
        series: seriesChart.series,
        legend: {
          align: 'center',
          verticalAlign: 'top',
          layout: 'horizontal',
          useHTML: false,
        },
        tooltip: tooltip,
        yAxis: yAxis,
        xAxis: [{
          labels: {
            enabled: true,
            autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
          },
          gridLineColor: '#ccc',
          gridLineWidth: 0,
          title: {
            enabled: true,
            offset: 40,
            text: 'Y-axis: ' + labelChart.y + '<span style="word-spacing:20px"> X-axis:</span> ' + labelChart.x + '',
          },
          categories: labelChart.label,
          opposite: false
        }]
      });
    }

  }
  // add point to chart serie
  add() {
    this.chart.addPoint(Math.floor(Math.random() * 10));
  }
}
