import { ethers } from "@nomiclabs/buidler";

async function main() {
  const poapFactory = await ethers.getContract("Poap");
  const AutoCheckInFactory = await ethers.getContract("AutoCheckIn");

  // If we had constructor arguments, they would be passed into deploy()
  let poapContract = await poapFactory.deploy("POAP Token", "POAP", "", []);
  let autoCheckInContract = await AutoCheckInFactory.deploy(poapContract.address);

  // The address the Contract WILL have once mined
  console.log("TCL: main -> poapContract.address", poapContract.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(
    "TCL: main -> poapContract.deployTransaction.hash",
    poapContract.deployTransaction.hash
  );

  // The address the Contract WILL have once mined
  console.log("TCL: main -> autoCheckInContract.address", autoCheckInContract.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(
    "TCL: main -> autoCheckInContract.deployTransaction.hash",
    autoCheckInContract.deployTransaction.hash
  );

  // The contract is NOT deployed yet; we must wait until it is mined
  await poapContract.deployed();

  // The contract is NOT deployed yet; we must wait until it is mined
  await autoCheckInContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
