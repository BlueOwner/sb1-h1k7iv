import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { PropertyData } from '../types';

interface PropertyModalProps {
  property: PropertyData | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{property.物件種目} (No. {property.No})</DialogTitle>
          <DialogDescription>{property.所在地}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">価格:</span>
            <span>{property["価格(万円)"]}万円</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">土地面積:</span>
            <span>{property["土地面積(㎡)"]}㎡</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">㎡単価:</span>
            <span>{property["㎡単価(万円)"]}万円</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">坪単価:</span>
            <span>{property["坪単価(万円)"]}万円</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">区分:</span>
            <span>{property.区分}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">取引態様:</span>
            <span>{property.取引態様}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">築年数:</span>
            <span>{property.築年数}年</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">駅からの距離:</span>
            <span>{property["交通(徒歩)"]}分</span>
          </div>
        </div>
        {property.リンク && (
          <div className="flex justify-end">
            <Button onClick={() => window.open(property.リンク, '_blank')}>
              詳細を見る
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;