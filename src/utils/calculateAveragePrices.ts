import { PropertyData } from '../types';

export const calculateAveragePrices = (data: PropertyData[]) => {
  const onSale = data.filter(item => item.区分 === "売出中");
  const contracted = data.filter(item => item.区分 === "成約");

  const avgOnSale = onSale.length > 0
    ? onSale.reduce((sum, item) => sum + item["価格(万円)"], 0) / onSale.length
    : 0;

  const avgContracted = contracted.length > 0
    ? contracted.reduce((sum, item) => sum + item["価格(万円)"], 0) / contracted.length
    : 0;

  return { avgOnSale, avgContracted };
};