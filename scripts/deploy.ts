import { ethers } from "@nomiclabs/buidler";
require("dotenv").config();

async function main() {
  try {
    const poapFactory = await ethers.getContract("Poap");
    const AutoCheckInFactory = await ethers.getContract("AutoCheckIn");

    // If we had constructor arguments, they would be passed into deploy()
    //  let poapContract = await poapFactory.deploy("POAP Token", "POAP", "");
    let autoCheckInContract = await AutoCheckInFactory.deploy(
      "0x50C5CA3e7f5566dA3Aa64eC687D283fdBEC2A2F2"
    );

    // The address the Contract WILL have once mined
    // console.log("TCL: main -> poapContract.address", poapContract.address);

    // The transaction that was sent to the network to deploy the Contract
    // console.log(
    //   "TCL: main -> poapContract.deployTransaction.hash",
    //   poapContract.deployTransaction.hash
    // );

    // The address the Contract WILL have once mined
    console.log("TCL: main -> autoCheckInContract.address", autoCheckInContract.address);

    // The transaction that was sent to the network to deploy the Contract
    console.log(
      "TCL: main -> autoCheckInContract.deployTransaction.hash",
      autoCheckInContract.deployTransaction.hash
    );

    // // The contract is NOT deployed yet; we must wait until it is mined
    // await poapContract.deployed();

    // The contract is NOT deployed yet; we must wait until it is mined
    await autoCheckInContract.deployed();
  } catch (error) {
    console.log("TCL: main -> error", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
