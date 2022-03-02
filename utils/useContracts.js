import React, { useEffect, useRef, useState, useCallback } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

// const GreeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const NFTAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const NFTMarketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const useContracts = () => {
  // const GreeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const NFTAddress = "0x07c7Df7BDA9dfcf98CC664862d80E54Af07365de";
  const NFTMarketAddress = "0xD8547A6fc0C2b903F303F55807AfC494e5cDC423";
  /* -------------------------------------------------------------------------- */
  const [GreeterContract, setGreeterContract] = useState(null);
  const [NFTMarketContract, setNFTMarketContract] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initiateContracts = async () => {
      // const greeter = await web3Modal_address_abi(GreeterAddress, Greeter.abi);
      // setGreeterContract(greeter);
      const nft = await web3Modal_address_abi(NFTAddress, NFT.abi);
      setNFTContract(nft);
      const nftMarket = await web3Modal_address_abi(
        NFTMarketAddress,
        NFTMarket.abi
      );
      setNFTMarketContract(nftMarket);
    };
    // web3Modal_address_abi(GreeterAddress, Greeter.abi).then((res) =>
    //   setGreeterContract(res)
    // );
    initiateContracts();
    // web3Modal_address_abi(GreeterAddress, Greeter.abi);
  }, []);

  const web3Modal_address_abi = async (address, abi) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    setProvider(provider);
    // const accounts = await provider.listAccounts();
    // console.log(accounts);
    const signer = provider.getSigner();
    setSigner(signer);
    const contract = new ethers.Contract(address, abi, signer);
    // const data = await contract.greet();
    // console.log(data);
    return contract;
  };

  return {
    GreeterContract,
    NFTContract,
    NFTAddress,
    NFTMarketContract,
    signer,
  };
};

export default useContracts;
