import contracktV001 from "../abi/contracktV001.json";
import { ethers } from "ethers";

export async function init() {
  if (typeof window !== "undefined" && window.ethereum) {
    const { abi } = contracktV001;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractAddress = "0xe83D13b456F9F6BD26f50a9290dBB0c7eACF1EBe";
    const contrackt = new ethers.Contract(contractAddress, abi, signer);
    return contrackt;
  } else {
    throw new Error("This code must be executed in a browser environment with MetaMask installed.");
  }
}
