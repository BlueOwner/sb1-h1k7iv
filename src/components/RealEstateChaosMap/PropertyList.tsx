import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from "../../ui/button";
import { PropertyData } from '../../types';

interface PropertyListProps {
  filteredData: PropertyData[];
  hoveredItem: { no: number; source: 'list' | 'map' } | null;
  handleMouseEnter: (data: PropertyData, source: 'list') => void;
  handleMouseLeave: () => void;
  handlePointClick: (event: any, data: PropertyData) => void;
}

export interface PropertyListRef {
  scrollToProperty: (propertyNo: number) => void;
}

const PropertyList = forwardRef<PropertyListRef, PropertyListProps>(({
  filteredData,
  hoveredItem,
  handleMouseEnter,
  handleMouseLeave,
  handlePointClick,
}, ref) => {
  const listRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToProperty: (propertyNo: number) => {
      const element = document.getElementById(`property-${propertyNo}`);
      if (element && listRef.current) {
        listRef.current.scrollTop = element.offsetTop - listRef.current.offsetTop;
      }
    }
  }));

  return (
    <div ref={listRef} className="h-[400px] w-full rounded-md border p-4 overflow-y-auto">
      {filteredData.map((item) => (
        <div 
          key={item.No}
          id={`property-${item.No}`}
          className={`mb-2 p-2 rounded ${hoveredItem?.no === item.No ? 'bg-primary/10' : ''}`}
          onMouseEnter={() => handleMouseEnter(item, 'list')}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => handlePointClick(e, item)}
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
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.リンク, '_blank');
              }}
            >
              詳細を見る
            </Button>
          )}
        </div>
      ))}
    </div>
  );
});

PropertyList.displayName = 'PropertyList';

export default PropertyList;