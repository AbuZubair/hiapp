import { Injectable } from '@angular/core';
import { ChartInterfaceDual, YAxisDual, YseriesDualAfter, YAxisDualPush, DefaultChart } from '../../interfaces/interfaces';
import * as Highcharts from 'highcharts';
// import { High } from  'highcharts'

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  dummy = { "name": "Graph Name", "ylabel": "Label Y", "yseries": [{ "name": "Series 1", "data": [{ "name": "Product 1", "y": 62.74, "drilldown": "product1" }, { "name": "Product 2", "y": 2.74, "drilldown": "product2" }], "zindex": 1 }], "xlabel": "Label X", "drilldown": [{ "name": "Product 1", "id": "product1", "data": [["3gb", 70], ["4gb", 30]], "zindex": 1 }, { "name": "Product 2", "id": "product2", "data": [["2gb", 50], ["1gb", 50]], "zindex": 1 }] };
  dummy2 = { "name": "Graph Name", "extendedGraphs": [{ "name": "Bar 1", "xseries": ["2", "4", "6", "12", "15", "18"], "yseries": [{ "name": "Series 1", "data": [80871, 81243, 74006, 82719, 15713], "zindex": 1 }, { "name": "Series 2", "data": [26429, 57745, 31793, 17450, 91050, 50694], "zindex": 1 }], "xlabel": "Name 1" }, { "name": "Bar 1", "xseries": ["2", "6", "3", "8", "5"], "yseries": [{ "name": "Series 1", "data": [63559, 64583, 78288, 86270, 84505], "zindex": 1 }, { "name": "Series 2", "data": [13398, 98799, 90860, 92089, 60461], "zindex": 1 }, { "name": "Series 3", "data": [59214, 33363, 25942, 76783, 68757], "zindex": 1 }], "xlabel": "Name 2" }, { "name": "Bar 1", "xseries": ["2", "4", "3", "4", "10", "12", "14"], "yseries": [{ "name": "Series 1", "data": [14359, 32011, 78075, 24335, 92349], "zindex": 1 }, { "name": "Series 2", "data": [57287, 78791, 74334, 31558, 66139], "zindex": 1 }], "xlabel": "Name 3" }], "ylabel": "Label Y" };
  chartHeight = 80;
  

  initDataSeriesDual() {
    return <YseriesDualAfter>{ data: [], name: '', type: '', yAxis: 0, zIndex: 0, marker: { symbol: 'circle', enabled: true } };
  }
  initDataYAxisDual() {
    return <YAxisDualPush>{ min: 0, opposite: true, title: { text: '' } };
  }
  initDataChart() {
    return { "name": "No Data", "yaxises": [{ "type": "line", "ylabel": "", "yseries": [{ "name": "No Data", "data": [0], "zindex": 1 }] }], "xlabel": "", "xseries": [] };
  }
  noDataChartDrilldown() {
    const chart = { "name": "No Data", "extendedSeries": [{ "name": "No Data", "extendedGraphs": [{ "name": "No Data", "y": 0, "yseries": [{ "name": "No Data", "data": [] }], "xlabel": "", "xseries": [] }] }], "ylabel": "" }
    return {
      chartTitle: chart.name,
      chartType: 'column',
      chartSeries: chart.extendedSeries,
      chartLabel: { x: '', y: '' },
      chartMin: 0
    };
  }
  noDataChart() {
    return <DefaultChart>{
      chartTitle: 'No Data',
      chartType: 'line',
      chartSeries: [{ data: [0], name: 'No Data', zIndex: 0 }],
      chartLabel: { x: '', y: '', label: [] },
      chartMin: 0
    };
  }
  noDataChartDual() {
    const chart = this.initDataChart();
    return <ChartInterfaceDual>{
      chartTitle: chart.name,
      chartType: '',
      chartSeries: chart.yaxises,
      chartLabel: { x: chart.xlabel, label: chart.xseries },
      chartMin: 0
    };
  }
  getChartHeight() {
    return this.chartHeight;
  }
  getChart(data) {
    const chart = data.chart;
    let yaminvalue = [];
    chart.yseries.forEach(item => {
      yaminvalue = yaminvalue.concat(item.data)
    });
    return <DefaultChart>{
      chartTitle: chart.name,
      chartType: data.type.toLowerCase(),
      chartSeries: chart.yseries,
      chartLabel: { x: chart.xlabel, y: chart.ylabel, label: chart.xseries },
      chartMin: Math.min(...yaminvalue)
    };
  }
  getChartDual(chart) {
    return <ChartInterfaceDual>{
      chartTitle: chart.name,
      chartType: '',
      chartSeries: chart.yaxises,
      chartLabel: { x: chart.xlabel, label: chart.xseries },
      chartMin: 0
    };
  }
  getChartDrilldown(data) {
    const chart = data.chart;
    return {
      chartTitle: chart.name,
      chartType: 'column',
      chartSeries: chart.extendedSeries,
      chartLabel: { x: '', y: chart.ylabel },
      chartMin: 0
    };
  }

  seriesDualTemp: YseriesDualAfter;
  yAxisDualTemp: YAxisDualPush;
  getChartDualAxisData(seriesChart: YAxisDual[]) {
    let seriesDual = [];
    let yAxisDual = [];
    let zIndex = 0;
    let yaminvalue = [];
    for (let index = 0; index < seriesChart.length; index++) {

      for (let series = 0; series < seriesChart[index].yseries.length; series++) {
        zIndex++;
        yaminvalue = yaminvalue.concat(seriesChart[index].yseries[series].data);
        this.seriesDualTemp = this.initDataSeriesDual();
        this.seriesDualTemp.data = seriesChart[index].yseries[series].data;
        this.seriesDualTemp.name = seriesChart[index].yseries[series].name;
        this.seriesDualTemp.type = seriesChart[index].type.toLowerCase();
        this.seriesDualTemp.yAxis = index;
        this.seriesDualTemp.zIndex = zIndex;
        seriesDual.push(this.seriesDualTemp);
      }

      const opposite = index === 0 || (index && !(index % 2));
      this.yAxisDualTemp = this.initDataYAxisDual();
      this.yAxisDualTemp.min = Math.min(...yaminvalue);
      this.yAxisDualTemp.opposite = !opposite;
      this.yAxisDualTemp.title = { text: seriesChart[index].ylabel };
      yAxisDual.push(this.yAxisDualTemp);
    }
    return { seriesDual, yAxisDual };
  }

  getChartDrilldownData(data) {
    let series = [];
    let drilldown = {
      series: []
    };

    if (data) {
      data.forEach((chart, index) => {
        let seriesTemp = []
        chart.extendedGraphs.forEach((item, i) => {
          seriesTemp.push(
            {
              name: item.name,
              y: item.y,
              drilldown: item.name
            }
          );
        }); // End Chart
        series.push(
          {
            name: data[index].name,
            data: seriesTemp
          }
        );
      }); // End Data

      for (let i = 0; i < data.length; i++) {
        for (let e = 0; e < data[i].extendedGraphs.length; e++) {
          let ditem = [];
          data[i].extendedGraphs[e].yseries[0].data.forEach((value, idx) => {
            ditem.push(
              [
                data[i].extendedGraphs[e].xseries[idx],
                value
              ]
            )
          });
          drilldown.series.push(
            {
              name: data[i].extendedGraphs[e].name,
              id: data[i].extendedGraphs[e].name,
              data: ditem
            }
          )
        }
      }
    }

    // Dummy Data
    // series = [{ "name": "TOP 5 Product", "colorByPoint": true, "data": [{ "name": "D", "y": 8, "drilldown": "d" }, { "name": "D-1", "y": 10, "drilldown": "d1" }, { "name": "D-2", "y": 11, "drilldown": "d2" }, { "name": "D-3", "y": 9, "drilldown": "d3" }, { "name": "D-4", "y": 15, "drilldown": "d4" }, { "name": "D-5", "y": 13, "drilldown": "d5" }, { "name": "D-6", "y": 10, "drilldown": "d6" }, { "name": "D-7", "y": 12, "drilldown": "d7" }] }];
    // drilldown = { "series": [{ "name": "D-1", "id": "d1", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-2", "id": "d2", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-3", "id": "d3", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-4", "id": "d4", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-5", "id": "d5", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-6", "id": "d6", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }, { "name": "D-7", "id": "d7", "data": [["Product 1", 20], ["Product 2", 22], ["Product 3", 18], ["Product 4", 21], ["Product 5", 19]] }] };
    return { series: series, drilldown: drilldown };
  }

  getChartData(chart) {
    let array = [
      {linearGradient: [300, 0, 300, 200],
      stops: [
          [0, 'rgba(255,64,129,1)'],
          [1, Highcharts.color('rgba(255,64,129,0.1)').setOpacity(0.1).get('rgba')]
      ]},
      {linearGradient: [300, 0, 300, 200],
          stops: [
              [0, 'rgba(64,196,255,1)'],
              [1, Highcharts.color('rgba(64,196,255,0.1)').setOpacity(0.1).get('rgba')]
          ]
      },
      {linearGradient: [300, 0, 300, 200],
          stops: [
              [0, 'rgba(105, 240, 174,1)'],
              [1, Highcharts.color('rgba(105, 240, 174,0.1)').setOpacity(0.1).get('rgba')]
          ]
      },
    ]
    for (let index = 0; index < chart.length; index++) {
      chart[index].zIndex = (chart.length - index);
      chart[index].marker = { 
        // symbol: 'circle', 
        enabled: false 
      };
      chart[index].fillColor = array[index]
    }
    return chart;
  }

  getChartColor(type) {
    if(type=='column'){
      return [
        {linearGradient: [300, 0, 300, 200],
          stops: [
              [0, 'rgba(34, 185, 188,1)'],
              [1, Highcharts.color('rgba(34, 185, 188,0.1)').setOpacity(0.1).get('rgba')]
          ]},
          {linearGradient: [300, 0, 300, 200],
              stops: [
                  [0, 'rgba(64,196,255,1)'],
                  [1, Highcharts.color('rgba(64,196,255,0.1)').setOpacity(0.1).get('rgba')]
              ]
          },
          {linearGradient: [300, 0, 300, 200],
              stops: [
                  [0, 'rgba(105, 240, 174,1)'],
                  [1, Highcharts.color('rgba(105, 240, 174,0.1)').setOpacity(0.1).get('rgba')]
              ]
          },
      ]
    }else{
      return [
        'rgba(255,64,129,1)',
        'rgba(64,196,255,1)',
        'rgba(105, 240, 174,1)',
        '#795548',
        '#ff5722',
        '#e040fb',
        '#bdbdbd',
      ];
    }
    
  }

  getChartTooltipDrilldown(enabled: boolean) {
    return {
      enabled: enabled,
      shared: true,
      backgroundColor: '#ffffff',
      formatter: function () {
        let s = this.points[0].key + '<br>';
        for (let i = 0; i < this.points.length; i++) {
          s = s + '<span style="color:' + this.points[i].color + '">' + this.points[i].series.name + '</span> : <b>' + (this.points[i].y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '</b><br>';
        };
        return s;
      }
    }
  }

  getChartTooltip(enabled: boolean) {
    return {
      enabled: enabled,
      shared: true,
      backgroundColor: '#ffffff',
      formatter: function () {
        let s = this.x + '<br>';
        for (let i = 0; i < this.points.length; i++) {
          s = s + '<span style="color:' + this.points[i].color + '">' + this.points[i].series.name + '</span> : <b>' + (this.points[i].y).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '</b><br>';
        };
        return s;
      }
    }
  }

  getChartYAxis(yamin, labelChart, number) {
    switch (number) {
      case 'data':
        return [{
          min: yamin,
          labels: {
            align: 'left',
            x: 0,
            y: -3,
            enabled: true,
            step: 1,
            formatter: function () {
              function getValueByLevel(value: number, level: number) {
                const num = 1024
                if (value > num && level < 8) {
                  value = value / num
                  level++
                  return getValueByLevel(value, level)
                } else {
                  value = Math.floor(value*100)/100
                  return value + getLabeled(level)
                }
              }
              function getLabeled(level) {
                switch (level) {
                  case 0:
                    return " Byte";
                  case 1:
                    return " KB";
                  case 2:
                    return " MB";
                  case 3:
                    return " GB";
                  case 4:
                    return " TB";
                  case 5:
                    return " PB";
                  case 6:
                    return " EB";
                  case 7:
                    return " ZB";
                  case 8:
                    return " YB";
                  default:
                    return " ??";
                }
              }
              return getValueByLevel(this.value, 2)
            }
          },
          // tickPositioner: function () {
          //   var positions = [],
          //       tick = Math.floor(this.dataMin),
          //       increment = Math.ceil((this.dataMax - this.dataMin) / 2);
          //       console.log('325');
          //   if (this.dataMax !== null && this.dataMin !== null) {
          //       for (tick; tick - increment <= this.dataMax; tick += increment) {
          //           positions.push(tick);
          //       }
          //   }
          //   return positions;
          // },
          gridLineColor: '#ccc',
          gridLineWidth: 1,
          title: {
            enabled: false,
            // text: labelChart.y,
            // text: titleChart,
          },
          opposite: false,
        }]

      case 'number':
        return [{
          min: yamin,
          labels: {
            align: 'left',
            x: 0,
            y: -3,
            enabled: true,
            step: 1,
            formatter: function () {
              function getValueByLevel(value: number, level: number) {
                const num = 1000
                if (value > num && level < 8) {
                  value = value / num
                  level++
                  return getValueByLevel(value, level)
                } else {
                  value = Math.floor(value*100)/100
                  return value + getLabeled(level)
                }
              }
              function getLabeled(level) {
                switch (level) {
                  case 0:
                    return "";
                  case 1:
                    return " K";
                  case 2:
                    return " Mn";
                  case 3:
                    return " Bn";
                  case 4:
                    return " Tn";
                  case 5:
                    return " Pn";
                  case 6:
                    return " En";
                  case 7:
                    return " Zn";
                  case 8:
                    return " Yn";
                  default:
                    return " ??";
                }
              }
              return getValueByLevel(this.value, 0)
            }
          },
          // tickPositioner: function () {
          //   var positions = [],
          //       tick = Math.floor(this.dataMin),
          //       increment = Math.ceil((this.dataMax - this.dataMin) / 2);
          //   if (this.dataMax !== null && this.dataMin !== null) {
          //       for (tick; tick - increment <= this.dataMax; tick += increment) {
          //           positions.push(tick);
          //       }
          //   }
          //   return positions;
          // },
          gridLineColor: '#ccc',
          gridLineWidth: 0.8,
          title: {
            enabled: false,
            // text: labelChart.y,
            // text: titleChart,
          },
          opposite: false,
        }]

      default:
        break;
    }
  }
}
