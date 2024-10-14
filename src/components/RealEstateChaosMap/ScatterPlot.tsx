import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PropertyData, ViewOption } from '../../types';

interface ScatterPlotProps {
  filteredData: PropertyData[];
  selectedView: ViewOption;
  hoveredItem: { no: number; source: 'list' | 'map' } | null;
  handleMouseEnter: (data: PropertyData, source: 'map') => void;
  handleMouseLeave: () => void;
  handlePointClick: (event: any, data: PropertyData) => void;
  useRelativeSize: boolean;
  relativeSizeMetric: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  filteredData,
  selectedView,
  hoveredItem,
  handleMouseEnter,
  handleMouseLeave,
  handlePointClick,
  useRelativeSize,
  relativeSizeMetric,
}) => {
  const getMarkerSize = (data: PropertyData) => {
    if (!useRelativeSize) return 64;
    const value = data[relativeSizeMetric as keyof PropertyData] as number;
    const maxValue = Math.max(...filteredData.map(item => item[relativeSizeMetric as keyof PropertyData] as number));
    return ((value / maxValue) * 180) + 20; // Adjust the multiplier and base size as needed
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis 
          type="number" 
          dataKey={selectedView.xAxis} 
          name={selectedView.xAxisLabel} 
          unit={selectedView.xAxis === "交通(徒歩)" ? "分" : selectedView.xAxis === "築年数" ? "年" : "㎡"} 
        />
        <YAxis 
          type="number" 
          dataKey={selectedView.yAxis} 
          name={selectedView.yAxisLabel} 
          unit="万円" 
        />
        <ZAxis type="number" range={[20, 200]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if ((active && payload && payload.length) || hoveredItem) {
              const data = (payload && payload[0]?.payload as PropertyData) || filteredData.find(item => item.No === hoveredItem?.no);
              if (data) {
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-bold">{`${data.物件種目} (No. ${data.No})`}</p>
                    <p>{`価格: ${data["価格(万円)"]}万円`}</p>
                    <p>{`面積: ${data["土地面積(㎡)"]}㎡`}</p>
                    <p>{`㎡単価: ${data["㎡単価(万円)"]}万円`}</p>
                    <p>{`取引態様: ${data.取引態様}`}</p>
                  </div>
                );
              }
            }
            return null;
          }}
        />
        <Legend />
        {["売地", "中古戸建", "新築戸建"].map((type, index) => (
          <Scatter 
            key={type}
            name={type} 
            data={filteredData.filter(item => item.物件種目 === type)} 
            fill={["#8884d8", "#82ca9d", "#ffc658"][index]}
            shape={(props) => {
              const { cx, cy, payload } = props;
              const size = getMarkerSize(payload as PropertyData);
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={Math.sqrt(size / Math.PI)}
                  fill={["#8884d8", "#82ca9d", "#ffc658"][["売地", "中古戸建", "新築戸建"].indexOf(payload.物件種目)]}
                  stroke="none"
                />
              );
            }}
            onMouseEnter={(_, index) => handleMouseEnter(filteredData.filter(item => item.物件種目 === type)[index], 'map')}
            onMouseLeave={handleMouseLeave}
            onClick={(event, data) => handlePointClick(event, data as PropertyData)}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;