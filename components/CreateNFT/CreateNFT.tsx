import styles from "./CreateNFT.module.css";
import React, { useState, useEffect } from "react";
import useContracts from "../../utils/useContracts";
import NFTCard from "../NFTCard/NFTCard";
import { create as ipfsHttpClient } from "ipfs-http-client";
import useIPFS from "../../utils/useIPFS";
import { useRouter } from "next/router";
import { ethers } from "ethers";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const CreateNFT = () => {
  const router = useRouter();
  const { uploadToIPFS, captureFileAndUploadToIPFS } = useIPFS();
  const { NFTMarketContract, NFTContract, NFTAddress } = useContracts();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [formInput, updateFormInput] = useState({
    price: "0.00",
    name: "",
    description: "",
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [descriptionLimitExceded, setDescriptionLimitExceded] = useState(false);

  useEffect(() => {
    console.log(formInput.description.length);
    setCharacterCount(formInput.description.length);
    if (formInput.description.length > 10) {
      setDescriptionLimitExceded(true);
    } else {
      setDescriptionLimitExceded(false);
    }
  }, [formInput.description]);

  /* -------------------------------------------------------------------------- */
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  /* -------------------------------------------------------------------------- */
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
  /* -------------------------------------------------------------------------- */
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
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.formContainer0}>
        <div className={styles.title}>Create Digital Asset</div>
        <div className={styles.formContainer}>
          <input
            placeholder="Asset Name"
            className={styles.input}
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <div className={styles.description_count_container}>
            <div className={styles.characterCount}>{characterCount}/10</div>
            <textarea
              placeholder="Asset Description"
              className={`${styles.description} ${
                descriptionLimitExceded ? styles.limitError : null
              }`}
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </div>
          <div className={styles.priceContainer}>
            <input
              value={formInput.price}
              placeholder="0.00"
              className={styles.priceInput}
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
            <p className={styles.eth}>ETH</p>
          </div>
          <label className={styles.fileButtonLabel}>
            <input
              type="file"
              className={styles.fileButton}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
            />
            Upload Picture
          </label>

          <button onClick={createFinalNFTAndPutForSale} className={styles.btn}>
            Create Digital Asset
          </button>
        </div>
      </div>

      <div className={styles.NFTCard0}>
        <div className={styles.NFTCard}>
          <NFTCard
            name={formInput.name}
            description={formInput.description}
            price={formInput.price}
            fileUrl={fileUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
