import React from 'react';
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Slider } from "../../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ViewOption } from '../../types';

interface FiltersProps {
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  showAzamino4: boolean;
  setShowAzamino4: (show: boolean) => void;
  showAzamino3: boolean;
  setShowAzamino3: (show: boolean) => void;
  showContracted: boolean;
  setShowContracted: (show: boolean) => void;
  showOnSale: boolean;
  setShowOnSale: (show: boolean) => void;
  transactionTypes: string[];
  handleTransactionTypeChange: (type: string) => void;
  landAreaMin: number;
  setLandAreaMin: (value: number) => void;
  landAreaMax: number;
  setLandAreaMax: (value: number) => void;
  useRelativeSize: boolean;
  setUseRelativeSize: (use: boolean) => void;
  relativeSizeMetric: string;
  setRelativeSizeMetric: (metric: string) => void;
  viewOptions: ViewOption[];
}

const Filters: React.FC<FiltersProps> = ({
  selectedView,
  setSelectedView,
  showAzamino4,
  setShowAzamino4,
  showAzamino3,
  setShowAzamino3,
  showContracted,
  setShowContracted,
  showOnSale,
  setShowOnSale,
  transactionTypes,
  handleTransactionTypeChange,
  landAreaMin,
  setLandAreaMin,
  landAreaMax,
  setLandAreaMax,
  useRelativeSize,
  setUseRelativeSize,
  relativeSizeMetric,
  setRelativeSizeMetric,
  viewOptions,
}) => {
  return (
    <div className="space-y-6 mb-4">
      <div>
        <Label htmlFor="view-select" className="text-lg font-semibold">表示する観点を選択:</Label>
        <Select value={selectedView.label} onValueChange={(value) => setSelectedView(viewOptions.find(option => option.label === value) || viewOptions[0])}>
          <SelectTrigger id="view-select" className="w-full mt-1">
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

      <div>
        <h3 className="text-lg font-semibold mb-2">地域</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="azamino4" checked={showAzamino4} onCheckedChange={(checked) => setShowAzamino4(checked as boolean)} />
            <Label htmlFor="azamino4">あざみ野4丁目</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="azamino3" checked={showAzamino3} onCheckedChange={(checked) => setShowAzamino3(checked as boolean)} />
            <Label htmlFor="azamino3">あざみ野3丁目</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">物件種目</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="contracted" checked={showContracted} onCheckedChange={(checked) => setShowContracted(checked as boolean)} />
            <Label htmlFor="contracted">成約</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="onSale" checked={showOnSale} onCheckedChange={(checked) => setShowOnSale(checked as boolean)} />
            <Label htmlFor="onSale">売出中</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">取引態様</h3>
        <div className="flex flex-wrap gap-4">
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
        <h3 className="text-lg font-semibold mb-2">土地面積範囲 (㎡)</h3>
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

      <div>
        <h3 className="text-lg font-semibold mb-2">プロットサイズ設定</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-relative-size"
            checked={useRelativeSize}
            onCheckedChange={(checked) => setUseRelativeSize(checked as boolean)}
          />
          <Label htmlFor="use-relative-size">相対的なプロットサイズを使用</Label>
        </div>
        {useRelativeSize && (
          <div className="mt-2">
            <Label htmlFor="relative-size-metric">サイズ基準:</Label>
            <Select value={relativeSizeMetric} onValueChange={setRelativeSizeMetric}>
              <SelectTrigger id="relative-size-metric" className="w-full mt-1">
                <SelectValue placeholder="サイズ基準を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="土地面積(㎡)">土地面積</SelectItem>
                <SelectItem value="価格(万円)">価格</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;