import { ethers } from "ethers";

export function addressShortener(address) {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
}

export async function getEns(address) {
  let defaultProvider = ethers.getDefaultProvider("homestead");
  return await defaultProvider.lookupAddress(address);
}
