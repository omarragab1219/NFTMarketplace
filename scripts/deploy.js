const hre = require("hardhat");
/* -------------------------------------------------------------------------- */

const main = async () => {
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy(
  //   "omar is coool",
  //   "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
  // );
  // await greeter.deployed();
  // console.log("greeter deployed to: ", greeter.address);
  /* -------------------------------------------------------------------------- */
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);
  /* -------------------------------------------------------------------------- */
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);
};
/* -------------------------------------------------------------------------- */
//   const Test = await hre.ethers.getContractFactory("Test");
//   const test = await Test.deploy("0x31693EF9c287B6eE591837C47e41e1de2B7fF8FC");
//   await test.deployed();
//   console.log("test deployed to:", test.address);
// };

/* -------------------------------------------------------------------------- */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
