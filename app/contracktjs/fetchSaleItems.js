import { init } from "../utils/init";

export async function fetchSaleItems() {
  const contrackt = await init();
  const saleItemCount = await contrackt.saleItemCount();

  const saleItems = [];
  for (let i = 0; i < saleItemCount; i++) {
    const item = await contrackt.saleItems(i);
    saleItems.push({
      itemId: item.itemId.toNumber(),
      quantity: item.quantity.toNumber(),
      price: item.price.toNumber(),
      uri: item.uri,
      seller: item.seller,
    });
  }
  return saleItems;
}
