import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { addressShortener } from "../utils/utils";
import { Container, Button, FormGroup, Label, Input } from "reactstrap";

type props = {
  web3Provider: ethers.providers.Web3Provider;
  account: string;
  poap: ethers.Contract;
  autoCheckIn: ethers.Contract;
};

export const Main = ({ web3Provider, account, poap, autoCheckIn }: props) => {
  const shortAddress = addressShortener(account);
  const [address, setAddress] = useState(shortAddress);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState();

  let approve = async (tokenId: string) => {
    await poap.approve(process.env.REACT_APP_AUTOCHECKIN_ADDRESS, tokenId);
  };

  let open = async (tokenId: string) => {
    await autoCheckIn.openEvent(tokenId);
  };

  let checkIn = async (tokenId: string) => {
    await autoCheckIn.checkIn(tokenId);
  };

  useEffect(() => {
    async function fetchTokens() {
      if (account) {
        let balance = await poap.balanceOf(account);
        setBalance(balance.toString());
        let tokens: Array<Array<string>> = [];
        for (let i = 0; i < balance; i++) {
          let token: Array<string> = await fetchToken(i.toString());
          tokens.push(token);
        }
        setTokens(tokens);
      }
    }

    async function isApproved(tokenId: string) {
      let approved = await poap.getApproved(tokenId);
      return approved == process.env.REACT_APP_AUTOCHECKIN_ADDRESS;
    }

    async function isOpen(tokenEvent: string) {
      let open = await autoCheckIn.eventOpeningTime(tokenEvent);
      return open.toString() != "0";
    }

    async function fetchToken(index: string) {
      let tokenId = await poap.tokenOfOwnerByIndex(account, index);
      let tokenEvent = await poap.tokenEvent(tokenId);
      let approved: boolean = await isApproved(tokenId);
      let open: boolean = await isOpen(tokenEvent);
      return [tokenId.toString(), tokenEvent.toString(), approved, open];
    }

    fetchTokens();
  }, [address, tokens]);
  return (
    <Container className="main">
      <h1>{address}</h1>
      <div>
        <Button color="primary" className="ml-4 primary">
          List Attendees
        </Button>
      </div>
      <div className="balances mt-4">
        <h3>Poap Tokens: {balance}</h3>
        {tokens && tokens.length > 0 && (
          <ul>
            {tokens.map((token: any, index: any) => (
              <li key={index}>
                <p>
                  <b>Event Id:</b> {token[0]}
                </p>
                <p>
                  <b>Token Id:</b> {token[1]}
                </p>
                <div className="mb-4">
                  {!token[3] ? (
                    <Button
                      color="primary"
                      className="primary"
                      onClick={() => {
                        open(token[1]);
                      }}
                    >
                      Open Event
                    </Button>
                  ) : (
                    <Button color="primary" className="primary" disabled>
                      Is Open!
                    </Button>
                  )}
                  {!token[2] ? (
                    <Button
                      color="primary"
                      className="ml-4  primary"
                      onClick={() => {
                        approve(token[1]);
                      }}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button color="primary" className="ml-4  primary" disabled>
                      Approved!
                    </Button>
                  )}
                  {token[3] && token[2] ? (
                    <Button
                      color="primary"
                      className=" ml-4 primary"
                      onClick={() => {
                        checkIn(token[1]);
                      }}
                    >
                      Check In
                    </Button>
                  ) : (
                    <Button color="primary" className="ml-4 primary" disabled>
                      Check In
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
};
