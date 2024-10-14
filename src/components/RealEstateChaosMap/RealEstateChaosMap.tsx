import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import NoDataMessage from '../NoDataMessage';
import PropertyModal from '../PropertyModal';
import { calculateAveragePrices } from '../../utils/calculateAveragePrices';
import { data, viewOptions, LOCAL_STORAGE_KEY } from '../../data';
import { PropertyData, ViewOption } from '../../types';
import Filters from './Filters';
import ScatterPlot from './ScatterPlot';
import PropertyList, { PropertyListRef } from './PropertyList';

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
  const [useRelativeSize, setUseRelativeSize] = useState(false);
  const [relativeSizeMetric, setRelativeSizeMetric] = useState<string>("価格(万円)");
  const propertyListRef = useRef<PropertyListRef>(null);

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
    if (propertyListRef.current) {
      propertyListRef.current.scrollToProperty(data.No);
    }
  }, []);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>不動産カオスマップ</CardTitle>
        <CardDescription>様々な観点での物件分布を確認できます</CardDescription>
      </CardHeader>
      <CardContent>
        <Filters
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          showAzamino4={showAzamino4}
          setShowAzamino4={setShowAzamino4}
          showAzamino3={showAzamino3}
          setShowAzamino3={setShowAzamino3}
          showContracted={showContracted}
          setShowContracted={setShowContracted}
          showOnSale={showOnSale}
          setShowOnSale={setShowOnSale}
          transactionTypes={transactionTypes}
          handleTransactionTypeChange={handleTransactionTypeChange}
          landAreaMin={landAreaMin}
          setLandAreaMin={setLandAreaMin}
          landAreaMax={landAreaMax}
          setLandAreaMax={setLandAreaMax}
          useRelativeSize={useRelativeSize}
          setUseRelativeSize={setUseRelativeSize}
          relativeSizeMetric={relativeSizeMetric}
          setRelativeSizeMetric={setRelativeSizeMetric}
          viewOptions={viewOptions}
        />
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
              <ScatterPlot
                filteredData={filteredData}
                selectedView={selectedView}
                hoveredItem={hoveredItem}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handlePointClick={handlePointClick}
                useRelativeSize={useRelativeSize}
                relativeSizeMetric={relativeSizeMetric}
              />
            </div>
            <div className="w-full md:w-1/3 pl-0 md:pl-4">
              <h3 className="text-lg font-semibold mb-2">表示中の物件リスト</h3>
              <PropertyList
                ref={propertyListRef}
                filteredData={filteredData}
                hoveredItem={hoveredItem}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handlePointClick={handlePointClick}
              />
            </div>
          </div>
        ) : (
          <NoDataMessage />
        )}
      </CardContent>
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default RealEstateChaosMap;