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

type token = {
  tokenId: string;
  tokenEvent: string;
  approved: boolean;
  open: boolean;
  reedemable: boolean;
};

export const Main = ({ web3Provider, account, poap, autoCheckIn }: props) => {
  const shortAddress = addressShortener(account);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState();
  const [contractTokens, setContractTokens] = useState();

  let listAccounts = async (tokenEvent: string) => {
    let accounts = await autoCheckIn.listAttendees(tokenEvent);
    if (accounts.length > 0) {
      let text = "";
      accounts.forEach((account: string, index: string) => {
        text += `${index} -> ${account} \n`;
      });
      alert(text);
    } else {
      alert("There are no Auto Check Ins");
    }
  };

  let approve = async (tokenId: string) => {
    await poap.approve(process.env.REACT_APP_AUTOCHECKIN_ADDRESS, tokenId);
  };

  let open = async (tokenId: string) => {
    await autoCheckIn.openEvent(tokenId);
  };

  let checkIn = async (tokenId: string) => {
    console.log("TCL: checkIn -> tokenId", tokenId);
    await autoCheckIn.checkIn(tokenId);
  };

  useEffect(() => {
    async function isApproved(tokenId: string) {
      let approved = await poap.getApproved(tokenId);
      return approved == process.env.REACT_APP_AUTOCHECKIN_ADDRESS;
    }

    async function isOpen(tokenEvent: string) {
      let open = await autoCheckIn.eventOpeningTime(tokenEvent);
      return open.toString() != "0";
    }

    async function isTokenOwner(tokenEvent: string, tokenId: string, address: string) {
      let eventTokenId = await autoCheckIn.tokenToOwner(tokenEvent, address);
      return tokenId == eventTokenId.toString();
    }

    async function fetchOpeningTime(tokenEvent: string) {
      let openingTimeUnix = await autoCheckIn.eventOpeningTime(tokenEvent.toString());
      if (openingTimeUnix.toString() == "0") {
        return false;
      }
      let openingtime = new Date(openingTimeUnix.toString() * 1000);
      openingtime.setDate(openingtime.getDate() + 1);
      let now = new Date();
      return openingtime < now;
    }

    async function fetchBalance(address: string) {
      if (address) {
        let balance = await poap.balanceOf(address);
        return balance;
      }
    }

    async function fetchToken(index: string, address: string) {
      let tokenId = await poap.tokenOfOwnerByIndex(address, index);
      let tokenEvent = await poap.tokenEvent(tokenId);
      let approved: boolean = await isApproved(tokenId);
      let open: boolean = await isOpen(tokenEvent);
      let reedemable = await fetchOpeningTime(tokenEvent);
      let token = {
        tokenId: tokenId.toString(),
        tokenEvent: tokenEvent.toString(),
        approved,
        open,
        reedemable
      };
      return token;
    }

    async function _fetchTokens(address: string, isContract: boolean) {
      if (address) {
        let balance = await fetchBalance(address);
        let tokens: Array<token> = [];
        if (!isContract) {
          setBalance(balance.toString());
        }
        for (let i = 0; i < balance; i++) {
          let token: token = await fetchToken(i.toString(), address);
          if (isContract) {
            if (await isTokenOwner(token.tokenEvent, token.tokenId, account)) {
              tokens.push(token);
            }
          } else {
            tokens.push(token);
          }
        }
        return tokens;
      }
    }

    async function fetchContractTokens() {
      if (account) {
        let tokens = await _fetchTokens(process.env.REACT_APP_AUTOCHECKIN_ADDRESS as string, true);
        setContractTokens(tokens);
      }
    }

    async function fetchTokens() {
      let tokens = await _fetchTokens(account, false);
      setTokens(tokens);
    }

    fetchTokens();
    fetchContractTokens();
  }, [account, tokens]);
  return (
    <Container className="main">
      <h1>{shortAddress}</h1>
      <div className="balances mt-4">
        <h3>Poap Tokens: {balance}</h3>
        {tokens && tokens.length > 0 && (
          <ul>
            {tokens.map((token: token, index: any) => (
              <li key={index}>
                <p>
                  <b>Event Id:</b> {token.tokenEvent} <b>Token Id:</b> {token.tokenId}
                </p>
                <Button
                  color="primary"
                  className="mb-4 primary"
                  onClick={() => {
                    listAccounts(token.tokenEvent);
                  }}
                >
                  List Attendees
                </Button>
                <div className="mb-4">
                  {!token.open ? (
                    <Button
                      color="primary"
                      className="primary"
                      onClick={() => {
                        open(token.tokenEvent);
                      }}
                    >
                      Open Event
                    </Button>
                  ) : (
                    <Button color="primary" className="primary" disabled>
                      Is Open!
                    </Button>
                  )}
                  {!token.approved ? (
                    <Button
                      color="primary"
                      className="ml-4  primary"
                      onClick={() => {
                        approve(token.tokenId);
                      }}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button color="primary" className="ml-4  primary" disabled>
                      Approved!
                    </Button>
                  )}
                  {token.open && token.approved ? (
                    <Button
                      color="primary"
                      className=" ml-4 primary"
                      onClick={() => {
                        checkIn(token.tokenId);
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
      {contractTokens && contractTokens.length > 0 && (
        <div className="balances mt-4">
          <h3>Staked Tokens: {contractTokens ? contractTokens.length : 0}</h3>

          <ul>
            {contractTokens.map((token: token, index: any) => (
              <li key={index}>
                <p>
                  <b>Event Id:</b> {token.tokenEvent} <b>Token Id:</b> {token.tokenId}
                </p>
                <Button
                  color="primary"
                  className="mb-4 primary"
                  onClick={() => {
                    listAccounts(token.tokenEvent);
                  }}
                >
                  List Attendees
                </Button>
                <div className="mb-4">
                  {token.reedemable ? (
                    <Button
                      color="primary"
                      className="primary"
                      onClick={() => {
                        // open(token[1]);
                      }}
                    >
                      Reclaim Token
                    </Button>
                  ) : (
                    <Button color="primary" className="primary" disabled>
                      Wait 24h to Reclaim
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};
