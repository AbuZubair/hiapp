export interface DefaultDataDashboard {
  data: Data[],
  date: string,
  lastRefresh: string,
  route: string,
  title: string
}

export interface Data {
  name: string,
  compare: string,
  stat: number,
  value: string
}