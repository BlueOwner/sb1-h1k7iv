import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import NoDataMessage from './NoDataMessage';
import PropertyModal from './PropertyModal';
import { calculateAveragePrices } from '../utils/calculateAveragePrices';
import { data, viewOptions, LOCAL_STORAGE_KEY } from '../data';
import { PropertyData, ViewOption } from '../types';

const RealEstateChaosMap: React.FC = () => {
  const [selectedView, setSelectedView] = useState<ViewOption>(viewOptions[0]);
  const [showAzamino4, setShowAzamino4] = useState(true);
  const [showAzamino3, setShowAzamino3] = useState(true);
  const [showContracted, setShowContracted] = useState(true);
  const [showOnSale, setShowOnSale] = useState(true);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [landAreaMin, setLandAreaMin] = useState<number>(0);
  const [landAreaMax, setLandAreaMax] = useState<number>(400);
  const [hoveredItem, setHoveredItem] = useState<{ no: number; source: 'list' | 'map' } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSelectedView(parsedSettings.selectedView || viewOptions[0]);
      setShowAzamino4(parsedSettings.showAzamino4 ?? true);
      setShowAzamino3(parsedSettings.showAzamino3 ?? true);
      setShowContracted(parsedSettings.showContracted ?? true);
      setShowOnSale(parsedSettings.showOnSale ?? true);
      setTransactionTypes(parsedSettings.transactionTypes || []);
      setLandAreaMin(parsedSettings.landAreaMin || 0);
      setLandAreaMax(parsedSettings.landAreaMax || 400);
    }
  }, []);

  useEffect(() => {
    const settings = {
      selectedView,
      showAzamino4,
      showAzamino3,
      showContracted,
      showOnSale,
      transactionTypes,
      landAreaMin,
      landAreaMax,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [selectedView, showAzamino4, showAzamino3, showContracted, showOnSale, transactionTypes, landAreaMin, landAreaMax]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (selectedView.xAxis === "築年数" && item.物件種目 === "売地") {
        return false;
      }
      if (!showAzamino4 && item.所在地.includes("あざみ野４丁目")) {
        return false;
      }
      if (!showAzamino3 && item.所在地.includes("あざみ野３丁目")) {
        return false;
      }
      if (!showContracted && item.区分 === "成約") {
        return false;
      }
      if (!showOnSale && item.区分 === "売出中") {
        return false;
      }
      if (transactionTypes.length > 0 && !transactionTypes.includes(item.取引態様)) {
        return false;
      }
      if (item["土地面積(㎡)"] < landAreaMin || item["土地面積(㎡)"] > landAreaMax) {
        return false;
      }
      return true;
    });
  }, [selectedView.xAxis, showAzamino4, showAzamino3, showContracted, showOnSale, transactionTypes, landAreaMin, landAreaMax]);

  const handleMouseEnter = (data: PropertyData, source: 'list' | 'map') => {
    setHoveredItem({ no: data.No, source });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleTransactionTypeChange = (type: string) => {
    setTransactionTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handlePointClick = useCallback((event: any, data: PropertyData) => {
    setSelectedProperty(data);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>不動産カオスマップ</CardTitle>
        <CardDescription>様々な観点での物件分布を確認できます</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="view-select">表示する観点を選択:</Label>
            <Select value={selectedView.label} onValueChange={(value) => setSelectedView(viewOptions.find(option => option.label === value) || viewOptions[0])}>
              <SelectTrigger id="view-select" className="w-full">
                <SelectValue placeholder="表示する観点を選択" />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="azamino4" checked={showAzamino4} onCheckedChange={(checked) => setShowAzamino4(checked as boolean)} />
              <Label htmlFor="azamino4">あざみ野4丁目</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="azamino3" checked={showAzamino3} onCheckedChange={(checked) => setShowAzamino3(checked as boolean)} />
              <Label htmlFor="azamino3">あざみ野3丁目</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="contracted" checked={showContracted} onCheckedChange={(checked) => setShowContracted(checked as boolean)} />
              <Label htmlFor="contracted">成約</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="onSale" checked={showOnSale} onCheckedChange={(checked) => setShowOnSale(checked as boolean)} />
              <Label htmlFor="onSale">売出中</Label>
            </div>
          </div>
          <div>
            <Label>取引態様:</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["専任", "専属", "売主"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transaction-${type}`}
                    checked={transactionTypes.includes(type)}
                    onCheckedChange={() => handleTransactionTypeChange(type)}
                  />
                  <Label htmlFor={`transaction-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>土地面積範囲 (㎡):</Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="land-area-min">下限:</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="land-area-min"
                    min={0}
                    max={400}
                    step={1}
                    value={[landAreaMin]}
                    onValueChange={(value) => setLandAreaMin(value[0])}
                    className="w-[200px]"
                  />
                  <input
                    type="number"
                    value={landAreaMin}
                    onChange={(e) => setLandAreaMin(Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="land-area-max">上限:</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="land-area-max"
                    min={0}
                    max={400}
                    step={1}
                    value={[landAreaMax]}
                    onValueChange={(value) => setLandAreaMax(value[0])}
                    className="w-[200px]"
                  />
                  <input
                    type="number"
                    value={landAreaMax}
                    onChange={(e) => setLandAreaMax(Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">平均価格</h3>
          <div className="flex space-x-4">
            <div>
              <span className="font-medium">売出中: </span>
              <span>{filteredData.length > 0 ? Math.round(calculateAveragePrices(filteredData).avgOnSale).toLocaleString() : 0}万円</span>
            </div>
            <div>
              <span className="font-medium">成約: </span>
              <span>{filteredData.length > 0 ? Math.round(calculateAveragePrices(filteredData).avgContracted).toLocaleString() : 0}万円</span>
            </div>
          </div>
        </div>
        {filteredData.length > 0 ? (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
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
                  <ZAxis type="category" dataKey="物件種目" name="物件種目" />
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
                  <Scatter 
                    name="売地" 
                    data={filteredData.filter(item => item.物件種目 === "売地")} 
                    fill="#8884d8" 
                    shape="circle" 
                    onMouseEnter={(_, index) => handleMouseEnter(filteredData.filter(item => item.物件種目 === "売地")[index], 'map')}
                    onMouseLeave={handleMouseLeave}
                    onClick={(event, data) => handlePointClick(event, data as PropertyData)}
                  />
                  <Scatter 
                    name="中古戸建" 
                    data={filteredData.filter(item => item.物件種目 === "中古戸建")} 
                    fill="#82ca9d" 
                    shape="triangle" 
                    onMouseEnter={(_, index) => handleMouseEnter(filteredData.filter(item => item.物件種目 === "中古戸建")[index], 'map')}
                    onMouseLeave={handleMouseLeave}
                    onClick={(event, data) => handlePointClick(event, data as PropertyData)}
                  />
                  <Scatter 
                    name="新築戸建" 
                    data={filteredData.filter(item => item.物件種目 === "新築戸建")} 
                    fill="#ffc658" 
                    shape="square" 
                    onMouseEnter={(_, index) => handleMouseEnter(filteredData.filter(item => item.物件種目 === "新築戸建")[index], 'map')}
                    onMouseLeave={handleMouseLeave}
                    onClick={(event, data) => handlePointClick(event, data as PropertyData)}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/3 pl-0 md:pl-4">
              <h3 className="text-lg font-semibold mb-2">表示中の物件リスト</h3>
              <div ref={listRef} className="h-[400px] w-full rounded-md border p-4 overflow-y-auto scroll-smooth">
                {filteredData.map((item) => (
                  <div 
                    key={item.No}
                    id={`property-${item.No}`}
                    className={`mb-2 p-2 rounded ${hoveredItem?.no === item.No ? 'bg-primary/10' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item, 'list')}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handlePointClick(null, item)}
                  >
                    <h4 className="font-medium">{item.物件種目} (No. {item.No})</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.所在地}<br />
                      価格: {item["価格(万円)"]}万円, 
                      面積: {item["土地面積(㎡)"]}㎡<br />
                      ㎡単価: {item["㎡単価(万円)"]}万円, 
                      坪単価: {item["坪単価(万円)"]}万円<br />
                      区分: {item.区分}, 
                      取引態様: {item.取引態様}<br />
                      物件番号: {item.物件番号}
                    </p>
                    {item.リンク && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(item.リンク, '_blank')}
                      >
                        詳細を見る
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <NoDataMessage />
        )}
      </CardContent>
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
};

export default RealEstateChaosMap;