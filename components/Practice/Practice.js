import styles from "./Practice.module.css";
import React, { useState, useEffect } from "react";
import useWeb3 from "../../utils/useIPFS";
import useContracts from "../../utils/useContracts";
import { ethers } from "ethers";
import Greeter from "../../artifacts/contracts/Greeter.sol/Greeter.json";

import Web3Modal from "web3modal";

const Practice = () => {
  const { web3Modal_address_abi } = useWeb3();
  const { GreeterContract, signer, provider } = useContracts();
  const [balance, setBalance] = useState("");
  const [account, setAccount] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    // console.log(GreeterContract);
    signer
      ? [
          signer
            .getBalance()
            .then((res) => setBalance(ethers.utils.formatEther(res))),
          signer.getAddress().then((res) => setAccount(res)),
        ]
      : null;

    // callFunction();
    // GreeterContract
    //   ? GreeterContract.greet().then((res) => console.log(res))
    //   : null;
    GreeterContract ? callFunction() : null;
  }, [GreeterContract]);

  useEffect(() => {
    // GreeterContract ? callFunction() : null;
    if (loading === false) {
      callFunction();
      [
        signer
          .getBalance()
          .then((res) => setBalance(ethers.utils.formatEther(res))),
        signer.getAddress().then((res) => setAccount(res)),
      ];
    }
  }, [loading]);

  const callFunction = async () => {
    // setLoading(true);
    GreeterContract
      ? await GreeterContract.greet().then((res) => [
          setText(res),
          console.log(res),
        ])
      : console.log("bad");
    //   .then(setLoading(false));
  };

  const changeGreeting = async () => {
    setLoading(true);
    const data = await GreeterContract.setGreeting("bro90");
    await data.wait();
    setLoading(false);
  };

  const sendMoneyToOwner = async () => {
    setLoading(true);
    const transaction = await GreeterContract.transferMoney({
      value: ethers.utils.parseEther("2.0"),
    });
    await transaction.wait();
    setLoading(false);
  };
  return (
    <div className={styles.container}>
      {text}
      <br />
      {account.slice(0, 5)}...{account.slice(account.length - 4)}
      <br />$ {balance}
      <br />
      <button onClick={() => changeGreeting()}>Chnage</button>
      <button onClick={() => sendMoneyToOwner()}>send money</button>
    </div>
  );
};

export default Practice;
