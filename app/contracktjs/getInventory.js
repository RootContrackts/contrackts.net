import { init } from "../utils/init";

export async function getInventory() {
  const contrackt = await init();
  const itemCount = await contrackt.itemCount();

  const items = [];
  for (let i = 0; i < itemCount; i++) {
    const item = await contrackt.items(i);
    items.push({
      itemId: item.itemId.toNumber(),
      quantity: item.quantity.toNumber(),
      name: item.name,
      uri: item.uri,
      seller: item.seller,
    });
  }
  console.log("Items", items);
  return items;
}
