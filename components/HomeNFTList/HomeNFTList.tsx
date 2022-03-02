import styles from "./HomeNFTList.module.css";
import type { NextPage } from "next";
import React, { useState, useEffect, FC } from "react";
import NFTCard from "../NFTCard/NFTCard";

import useContracts from "../../utils/useContracts";
import { ethers } from "ethers";
import axios from "axios";
import { createClient } from "urql";

const APIURL = "https://api.thegraph.com/subgraphs/name/omarragab1219/nft";
const query = `
{
  marketItemCreateds {
    itemId
    nftContract
    tokenId
    owner
    seller
    price
  }
}
`;

const client = createClient({
  url: APIURL,
});

interface Props {
  buyNFT: any;
}
const HomeNFTList: FC<Props> = ({ buyNFT }) => {
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    NFTMarketContract && NFTContract ? [fetchData()] : null;
  }, [NFTMarketContract, NFTContract]);
  const fetchData = async () => {
    const response = await client.query(query).toPromise();
    console.log(response.data.marketItemCreateds);
    const items = await Promise.all(
      response.data.marketItemCreateds.map(async (i) => {
        const tokenUri = await NFTContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price: price,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    console.log("item here", items);
    setLoadingState("loaded");
  };

  // const loadNFTs = async () => {
  //   const data = await NFTMarketContract.fetchMarketItems();

  //   const items = await Promise.all(
  //     data.map(async (i) => {
  //       const tokenUri = await NFTContract.tokenURI(i.tokenId);
  //       const meta = await axios.get(tokenUri);
  //       const price = await ethers.utils.formatUnits(
  //         i.price.toString(),
  //         "ether"
  //       );
  //       let item = {
  //         price: price,
  //         seller: i.seller,
  //         owner: i.owner,
  //         image: meta.data.image,
  //         name: meta.data.name,
  //         description: meta.data.description,
  //       };
  //       return item;
  //     })
  //   );
  //   setNfts(items);
  //   console.log(items);
  //   setLoadingState("loaded");
  // };
  return (
    <div className={styles.container}>
      {nfts.map((nft, i) => {
        return (
          <div className={styles.item} key={i}>
            <NFTCard
              buyNFT={buyNFT}
              nft={nft}
              name={nft.name}
              description={nft.description}
              price={nft.price}
              fileUrl={nft.image}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HomeNFTList;
