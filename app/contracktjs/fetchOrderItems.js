import { init } from "../utils/init";

export async function fetchOrderItems() {
  const contrackt = await init();

  const orderCount = await contrackt.orderCount();

  const orderItems = [];
  for (let i = 0; i < orderCount; i++) {
    const item = await contrackt.orders(i);
    orderItems.push({
      orderId: item.orderId.toNumber(),
      saleItemId: item.saleItemId.toNumber(),
      quantity: item.quantity.toNumber(),
      seller: item.seller,
      buyer: item.buyer,
      status: item.status,
      intermediaries: item.intermediaries,
    });
  }
  return orderItems;
}
