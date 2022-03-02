import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import useContracts from "../utils/useContracts";

export default function MyAssets() {
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (NFTMarketContract) {
      loadNFTs();
    }
  }, [NFTMarketContract]);
  /* -------------------------------------------------------------------------- */
  async function loadNFTs() {
    const data = await NFTMarketContract.fetchMyNFTs();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await NFTContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  /* -------------------------------------------------------------------------- */
  if (loadingState === "loaded" && !nfts.length)
    return <h1>No assets owned</h1>;
  return (
    <div>
      <div className="">
        <div className="">
          {nfts.map((nft, i) => (
            <div key={i} className="">
              <img src={nft.image} className="" />
              <div className="">
                <p className="">Price - {nft.price} Eth</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
