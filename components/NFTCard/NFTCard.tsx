import styles from "./NFTCard.module.css";
import React, { useState, useEffect, FC } from "react";
import NFTHolder from "./NFTHolder/NFTHolder";
import useContracts from "../../utils/useContracts";
import { ethers } from "ethers";

interface Props {
  nft: any;
  name: string;
  description: string;
  price: string;
  fileUrl: string | null;
  buyNFT: any;
}

const NFTCard: FC<Props> = ({ nft, name, description, price, fileUrl }) => {
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  /* -------------------------------------------------------------------------- */
  const buyNFT = async (nft) => {
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await NFTMarketContract.createMarketSale(
      NFTAddress,
      nft.tokenId,
      { value: price }
    );
    await transaction.wait();
    // loadNFTs();
  };

  /* -------------------------------------------------------------------------- */
  if (name || description || price || fileUrl) {
    return (
      <div>
        <div className={styles.container0}>
          <div className={styles.container}>
            {fileUrl ? (
              <img src={fileUrl} className={styles.image} />
            ) : (
              <img
                src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg"
                className={styles.image}
              />
            )}
            {name ? (
              <h2 className={styles.title}>{name}</h2>
            ) : (
              <h2 className={styles.title}>Title Here</h2>
            )}

            {description ? (
              <p className={styles.description}>{description}</p>
            ) : (
              <p className={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                distinctio et itaque hic natus sed veniam, voluptatem asperiores
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                distinctio et itaque hic natus sed veniam, voluptatem asperiores
              </p>
            )}
            <div className={styles.price_Btn_Container}>
              {price ? (
                <p className={styles.price}>{price} ETH</p>
              ) : (
                <p className={styles.price}>0.0 ETH</p>
              )}
              {nft ? (
                <button className={styles.btn} onClick={() => buyNFT(nft)}>
                  Buy
                </button>
              ) : (
                <button className={styles.btn}>Buy</button>
              )}
            </div>
          </div>
          <NFTHolder />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container0}>
        <div className={styles.container}>
          <img
            src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg"
            className={styles.image}
          />
          <h2 className={styles.title}>Omar is Cool</h2>
          <div></div>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            distinctio et itaque hic natus sed veniam, voluptatem asperiores
          </p>
          <div className={styles.price_Btn_Container}>
            <p className={styles.price}>2.0 ETH</p>
            <button className={styles.btn}>Buy</button>
          </div>
        </div>
        <NFTHolder />
      </div>
    </div>
  );
};

export default NFTCard;

// <div className={styles.container}>
//       <img src={nft.image} />
//       <p> {nft.name}</p>
//       <p>{nft.description}</p>
//       <p>{nft.price} ETH</p>
//       <button onClick={() => buyNft(nft)}>Buy</button>
//     </div>
