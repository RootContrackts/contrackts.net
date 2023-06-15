import { ethers } from "ethers";

const supportedNetworks = [
  { name: "Ethereum Mainnet", chainId: 1 },
  { name: "Mumbai Testnet", chainId: 80001 },
  { name: "Ethereum 2.0 Testnet (Goerli)", chainId: 5 },
];

export async function authenticate() {
  // Check if MetaMask is installed
  if (typeof window !== "undefined") {
    if (!window.ethereum) {
      throw new Error(
        "MetaMask not detected. Please install MetaMask and try again."
      );
    }

    // Request account access if needed
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Get the connected wallet address
    const address = accounts[0];

    // Check if the user is on a supported network
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const supportedNetwork = supportedNetworks.find(
      (n) => n.chainId === network.chainId || n.name === network.name
    );
    if (!supportedNetwork) {
      throw new Error(
        `Unsupported network: ${network.name} (${network.chainId})`
      );
    }

    // Return the connected wallet address
    return address;
  } else {
    throw new Error("This code must be executed in a browser environment.");
  }
}
