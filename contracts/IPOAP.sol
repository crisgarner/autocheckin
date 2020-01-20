pragma solidity ^0.5.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IPOAP is IERC721{
  function tokenEvent(uint256 tokenId) public view returns (uint256);
}
