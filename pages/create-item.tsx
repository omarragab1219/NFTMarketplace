// import styles from "./create-item.module.css"
import React, { useState, useEffect } from "react";
import useIPFS from "../utils/useIPFS";
import useContracts from "../utils/useContracts";
import styles from "../styles/create-item.module.css";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import { useRouter } from "next/router";
import CreateNFT from "../components/CreateNFT/CreateNFT";

const createItem = () => {
  const router = useRouter();
  const { uploadToIPFS, captureFileAndUploadToIPFS } = useIPFS();
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  const { captureFile, ipfsSubmit } = useIPFS();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onChange(e) {
    const url = await captureFileAndUploadToIPFS(e);
    setFileUrl(url);
  }

  async function createFinalNFTAndPutForSale() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      // const added = await client.add(data);
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const url = await uploadToIPFS(data);

      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createMarketItemAndPutForSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarketItemAndPutForSale(url: string) {
    /* next, create the item */

    let transaction = await NFTContract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether"); //turns basic number into larger number thats ready

    /* then list the item for sale on the marketplace */

    let listingPrice = await NFTMarketContract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await NFTMarketContract.createMarketItem(
      NFTAddress,
      tokenId,
      price,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <CreateNFT />
    </div>
  );
};

export default createItem;
