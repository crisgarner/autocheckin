pragma solidity ^0.5.5;
import "./IPOAP.sol";


contract AutoCheckIn {
  IPOAP POAP;
  mapping (uint => address[]) public eventAttendees;
  mapping (uint => mapping (address => uint)) public tokenToOwner;
  mapping (uint => uint256) public eventOpeningTime;

  constructor(IPOAP _poapAddress) public {
    POAP = _poapAddress;
  }

  /** @notice allows an user to open an event and sets a timer for one day.
    * @dev The owner of the event needs to have a POAP token.
    * @dev it's assumed that the first owners of the POAP token Event are the owners of the event.
    */
  function openEvent(uint _tokenId) public{
    uint256 tokenEvent = POAP.tokenEvent(_tokenId);
    require(eventOpeningTime[tokenEvent] == 0, "Event can only be opened once");
    /* solium-disable-next-line */
    eventOpeningTime[tokenEvent] = now;
  }

  /** @notice Allows an user to check in by staking their poap token
    * @dev A participant should only have one POAP token per event
    */
  function checkIn(uint _tokenId) public {
    //requires the owner to approve the transfer of the token
    require(POAP.getApproved(_tokenId) == address(this), "Contract needs to be approved");
    //gets the id of the event
    uint256 tokenEvent = POAP.tokenEvent(_tokenId);
    require(eventOpeningTime[tokenEvent] != 0, "Event needs to be open");
    //locks the POAP token
    POAP.transferFrom(msg.sender, address(this), _tokenId);
    //adds caller as attendee
    eventAttendees[tokenEvent].push(msg.sender);
    //remembers the owner of the token
    tokenToOwner[tokenEvent][msg.sender] = _tokenId;
  }

  /** @notice Allows the owner of the token to retrieve his token */
  function retrieveToken(uint _tokenEvent) public {
    require(eventOpeningTime[_tokenEvent] != 0, "Event needs to be open");
    /* solium-disable-next-line */
    require(now >= eventOpeningTime[_tokenEvent] + 1 days, "only available after 1 day of opening");
    POAP.transferFrom(address(this), msg.sender, tokenToOwner[_tokenEvent][msg.sender]);
  }

  /** @notice returns the list of address of attendees **/
  function listAttendees(uint _eventId) public view returns (address[] memory){
    return eventAttendees[_eventId];
  }
}
