export interface PropertyData {
  No: number;
  物件番号: string;
  リンク: string;
  区分: string;
  物件種目: string;
  "土地面積(㎡)": number;
  "建物面積(㎡)": number;
  "価格(万円)": number;
  "㎡単価(万円)": number;
  "坪単価(万円)": number;
  "交通(徒歩)": number;
  築年: number;
  築年数: number;
  所在地: string;
  取引態様: string;
}

export interface ViewOption {
  label: string;
  xAxis: keyof PropertyData;
  yAxis: keyof PropertyData;
  xAxisLabel: string;
  yAxisLabel: string;
}