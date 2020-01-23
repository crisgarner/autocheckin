import React, { useState } from "react";
import "./App.scss";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { Main } from "./components/Main";
import { Container } from "reactstrap";
import Poap from "./contracts/Poap.json";
import AutoCheckIn from "./contracts/AutoCheckIn.json";

const App: React.FC = () => {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();

  let connect = async (provider: ethers.providers.Web3Provider) => {
    const accounts = await provider?.listAccounts();
    setAccount(accounts[0]);
  };

  if (account) {
    var signer = provider.getSigner();
    let poapContract = new ethers.Contract(
      process.env.REACT_APP_POAP_ADDRESS as string,
      Poap.abi,
      signer
    );
    let autoCheckInContract = new ethers.Contract(
      process.env.REACT_APP_AUTOCHECKIN_ADDRESS as string,
      AutoCheckIn.abi,
      signer
    );
    //TODO create components and pass account, signer and contracts
    return (
      <Main
        account={account}
        web3Provider={provider}
        poap={poapContract}
        autoCheckIn={autoCheckInContract}
      ></Main>
    );
  }

  return (
    <Container className="initial">
      <Web3Connect.Button
        network="localhost" // optional
        providerOptions={{}}
        onConnect={async (networkProvider: ethers.providers.Web3Provider) => {
          let provider = new ethers.providers.Web3Provider(networkProvider);
          setProvider(provider);
          connect(provider);
        }}
        onClose={() => {
          console.log("Web3Connect Modal Closed"); // modal has closed
        }}
      />
    </Container>
  );
};

export default App;
