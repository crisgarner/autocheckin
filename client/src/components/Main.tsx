import React, { useState, useEffect } from "react";
import ethers from "ethers";
import { addressShortener, getEns } from "../utils/utils";
import { Container, Button, FormGroup, Label, Input } from "reactstrap";

type props = {
  web3Provider: ethers.providers.Web3Provider;
  account: string;
};

export const Main = ({ web3Provider, account }: props) => {
  const shortAddress = addressShortener(account);
  const [address, setAddress] = useState(shortAddress);
  useEffect(() => {
    async function fetchShortAddress() {
      const tempAddress = await getEns(account);
      if (tempAddress) {
        setAddress(tempAddress);
      }
    }
    fetchShortAddress();
  }, [address]);
  return (
    <Container className="main">
      <h1>{address}</h1>
      <div className="balances mt-4">
        <h3>Tokens</h3>
        {/* Mapear los tokens de poap */}
      </div>
    </Container>
  );
};
