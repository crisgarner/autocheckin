import React, { useState } from "react";
import "./App.scss";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { Main } from "./components/Main";
import { Container } from "reactstrap";

const App: React.FC = () => {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();

  let setAccounts = async (provider: ethers.providers.Web3Provider) => {
    const accounts = await provider?.listAccounts();
    setAccount(accounts[0]);
  };

  if (account) {
    var signer = provider.getSigner();
    // let teaParty = new ethers.Contract(
    //   process.env.REACT_APP_TEA_ADDRESS as string,
    //   TeaParty.abi,
    //   signer
    // );
    //TODO create components and pass account, signer and contracts
    return <Main account={account} web3Provider={provider}></Main>;
  }

  return (
    <Container className="initial">
      <Web3Connect.Button
        network="ropsten" // optional
        providerOptions={{
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: process.env.REACT_APP_INFURA_ID // required
            }
          }
        }}
        onConnect={async (networkProvider: ethers.providers.Web3Provider) => {
          let provider = new ethers.providers.Web3Provider(networkProvider);
          setProvider(provider);
          setAccounts(provider);
        }}
        onClose={() => {
          console.log("Web3Connect Modal Closed"); // modal has closed
        }}
      />
    </Container>
  );
};

export default App;
