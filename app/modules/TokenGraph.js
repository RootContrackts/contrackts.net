import { Spinner } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartJS from "chart.js/auto";
import { ArcElement, Tooltip, Legend } from "chart.js";
import { fetchSaleItems } from "../contracktjs/fetchSaleItems";
import { getInventory } from "../contracktjs/getInventory";

ChartJS.register(ArcElement, Tooltip, Legend);

const TokenGraph = () => {
  const [inventory, setInventory] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [tokenQuantityData, setTokenQuantityData] = useState(null);

  useEffect(() => {
    fetchTokenQuantityData();
  }, []);

  useEffect(() => {
    extractTokenQuantityData();
  }, [inventory,saleItems]);

  const fetchTokenQuantityData = async () => {
    try {
      const inventoryItems = await getInventory();
      setInventory(inventoryItems);
      const fetchedItems = await fetchSaleItems();
      setSaleItems(fetchedItems)
    } catch (error) {
      console.error("Error fetching token quantity data:", error);
    }
  };

  const extractTokenQuantityData = () => {
    console.log("Inventory items", inventory);
    const labels = saleItems.map((item) => inventory[item?.itemId].name);
    const data = saleItems.map((item) => item.quantity.toString());
    console.log(labels);
    const tokenQuantityData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: generateGrayscaleColors(saleItems.length),
        },
      ],
    };
    setTokenQuantityData(tokenQuantityData)
  };

  const generateGrayscaleColors = (count) => {
    const colors = [];
    const increment = Math.floor(255 / count); // Adjust the increment value as needed

    for (let i = 0; i < count; i++) {
      const shade = 255 - i * increment;
      const color = `rgba(${shade}, ${shade}, ${shade}, 1)`;
      colors.push(color);
    }
    return colors;
  };

  return (
    <div>
      {tokenQuantityData ? (
        <Doughnut data={tokenQuantityData} />
      ) : (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
    </div>
  );
};

export default TokenGraph;
