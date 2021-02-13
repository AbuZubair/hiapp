export interface RevenueGroupChart {
  title: string,
  card: RevenueGroupChartCard[]
}
export interface RevenueGroupChartCard {
  title: string,
  subTitle: string,
  category: string,
  date: string,
  loading: boolean,
  data: RevenueChart
}
export interface RevenueChart {
  chartTitle: string,
  chartType: string,
  chartSeries: Yseries[],
  chartLabel: ChartLabel,
  chartMin: number
}
export interface VolumeChart {
  chartTitle: string,
  chartType: string,
  chartSeries: Yseries[],
  chartLabel: ChartLabel,
  chartMin: number
}
export interface DefaultChart {
  chartTitle: string,
  chartType: string,
  chartSeries: Yseries[],
  chartLabel: ChartLabel,
  chartMin: number
}
export interface Chart {
  name: string,
  xlabel: string,
  ylabel: string,
  xseries: string[],
  yseries: Yseries[]
};
export interface DefaultChart {
  data: number[],
  marker: Marker,
  name: string,
  zIndex: number
};
export interface ChartLabel {
  x: string,
  y: string,
  label: string[]
}
export interface Yseries {
  data: [number],
  name: string,
  zIndex: number
}

// Dual Axis
export interface ChartInterfaceDual {
  chartTitle: string,
  chartType: string,
  chartSeries: YAxisDual[],
  chartLabel: ChartLabelDual,
  chartMin: number
}
export interface YAxisDualTitle {
  text: string
}
export interface YAxisDualPush {
  min: number,
  title: YAxisDualTitle,
  opposite: boolean
}
export interface YAxisDual {
  type: string,
  ylabel: string,
  yseries: YseriesDualBefore[]
}
export interface YseriesDualBefore {
  data: number[],
  name: string,
  zindex: number
}
export interface YseriesDualAfter {
  data: number[],
  name: string,
  type: string,
  yAxis: number,
  zIndex: number,
  marker: Marker
}
export interface Marker {
  symbol: string,
  enabled: boolean
}
export interface ChartDual {
  name: string,
  xlabel: string,
  xseries: string[],
  yaxises: YseriesDualBefore[]
};

export interface ChartLabelDual {
  x: string,
  label: string[]
}