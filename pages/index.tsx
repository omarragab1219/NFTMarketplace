import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Practice from "../components/Practice/Practice";
import { useState, useEffect } from "react";
import useContracts from "../utils/useContracts";
import { ethers } from "ethers";
import HomeNFTList from "../components/HomeNFTList/HomeNFTList";

const Home = () => {
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  const [nfts, setNfts] = useState<any>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {}, [NFTMarketContract, NFTContract]);

  const buyNFT = async (nft) => {
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await NFTMarketContract.createMarketSale(
      NFTAddress,
      nft.tokenId,
      { value: price }
    );
    await transaction.wait();
    loadNFTs();
  };

  if (loadingState === "loaded" && !nfts.length) {
    return <div>No items in marketplace</div>;
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>NFT MarketPlace</h1>
      </div>
      <div className={styles.itemsSale}>
        <h2>Items For Sale</h2>
      </div>
      <div className={styles.HomeNFTList}>
        {<HomeNFTList buyNft={buyNFT} />}
      </div>
    </div>
  );
};

export default Home;
