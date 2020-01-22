const ethers = require("ethers");
require("dotenv").config();
import { ethers as ethersBuidler } from "@nomiclabs/buidler";
import { Poap } from "../typechain/Poap";

async function main() {
  console.log("Minting tokens");
  let POAPFactory = await ethersBuidler.getContract("Poap");
  let abi = POAPFactory.interface;
  let contractAddress = process.env.POAP_ADDRESS;
  if (contractAddress) {
    let poapContract = new ethers.Contract(contractAddress, abi, POAPFactory.signer) as Poap;
    await poapContract.mintToken(1, process.env.ACCOUNT_1 as string);
    await poapContract.mintToken(2, process.env.ACCOUNT_1 as string);
    await poapContract.mintToken(3, process.env.ACCOUNT_1 as string);
    await poapContract.mintToken(1, process.env.ACCOUNT_2 as string);
    await poapContract.mintToken(1, process.env.ACCOUNT_3 as string);
  } else {
    console.log("POAP Contract Address not defined");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
