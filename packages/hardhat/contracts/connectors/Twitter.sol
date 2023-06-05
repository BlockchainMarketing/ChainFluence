// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

import "../../vendor/openzeppelin/contracts/access/Ownable.sol";
import "../../vendor/openzeppelin/contracts/proxy/Clones.sol";
import "../../vendor/openzeppelin/contracts/security/Pausable.sol";

import "../../vendor/openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../../vendor/openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "../../vendor/openzeppelin/contracts/utils/Counters.sol";

/* 
TODO:

- function to validate campaign claim (Called by influencer with tweetUrl) If retweet > threshold -> transfer slice of budget (slice computed budget/number of influencers)

ValidateCampaignClaim:
- requestValidateCampaign -> chainlink (maybe replace by chainlink function?)
- fulfillValidateCampaign -> chainlink

*/

contract TwitterV1 is Pausable, Ownable, ReentrancyGuard, ChainlinkClient {
    using Chainlink for Chainlink.Request;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Counters for Counters.Counter;

    address public keeper;

    bytes32 public immutable jobId;
    uint256 private immutable fee;

    string public requestBaseURI;

    EnumerableMap.UintToAddressMap private users;

  uint256 lastCampaignId;

  struct Campaign {
    uint256 campaignId;
    address company;
    uint256 budget;
    uint256 validationThreshold;
    uint256 partakersLimit;
    bool isClosed;
  }

  struct CampaignContributors {
    uint256 contributorsCount;
    mapping(address => bool) contributorsByAddress;
    mapping(address => bool) contributorsClaimStatus;
  }

  Campaign[] campaigns;
  mapping(uint256 => Campaign) campaignById;
  mapping(uint256 => CampaignContributors) campaignContributorsByCampaignId;

    uint256 public constant MAX_TREASURY_FEE = 1000; // 10%

    uint256 public treasuryFee; // treasury rate (e.g. 200 = 2%, 150 = 1.50%)
    uint256 public treasuryAmount; // treasury amount that was not claimed

    ///
    /// EVENTS
    ///
    /**
     * @notice Called when a request to sign up is made
     */
    event SignUpRequested(uint256 indexed userId, bytes32 indexed requestId);
    /**
     * @notice Called when a user signed up
     */
    event SignedUp(uint256 indexed userId, address userAddress);

  event CampaignCreated(uint256 campaignId, address company);
  event CampaignClosed(uint256 campaignId);
  event ContributorAdded(uint256 campaignId, address contributor);
  event ContributorRetributed(uint256 campaignId, address contributor, uint256 retribution);

    ///
    /// CONSTRUCTOR
    ///

    /**
     * @notice Initialize the link token and target oracle
     * All testnets config : https://docs.chain.link/any-api/testnet-oracles/
     */
    constructor(
      bytes32 _jobId,
      string memory _requestBaseURI,
      address _oracle,
      address _link,
      uint256 _treasuryFee
    ) {
      setChainlinkToken(_link);
      setChainlinkOracle(_oracle);
      jobId = _jobId;
      // 0,1 * 10**18 (Varies by network and job)
      fee = (1 * LINK_DIVISIBILITY) / 10;

      treasuryFee = _treasuryFee;
      requestBaseURI = _requestBaseURI;
    }

  ///
  /// MAIN FUNCTIONS
  ///

  /**
   * @notice Function that allows a company to create a new campaign
   * @param budget - Budget each winning partaker will share with each other
   * @param validationThreshold - Minimum amount of retweet, likes etc for a partaker to win
   * @param partakersLimit - Maximum amount of winning partakers for this campaign
   */
  function createCampaign(
    uint256 budget,
    uint256 validationThreshold,
    uint256 partakersLimit
  ) external {
    lastCampaignId++;
    uint256 newCampaignId = lastCampaignId;
    Campaign storage newCampaign = campaignById[newCampaignId];
    newCampaign.budget = budget;
    newCampaign.validationThreshold = validationThreshold;
    newCampaign.partakersLimit = partakersLimit;
    newCampaign.company = msg.sender;
    newCampaign.isClosed = false;
    campaigns.push(newCampaign);
    emit CampaignCreated(newCampaignId, msg.sender);
  }

  /**
   * @notice Function that allows a company to close a
   * @param campaignId - The id of the campaign
   */
  function closeCampaign(uint256 campaignId) external {
    Campaign storage campaign = _getCampaign(campaignId);
    require(msg.sender == campaign.company, "Caller is not the campaign owner");
    campaign.isClosed = true;
    emit CampaignClosed(campaignId);
  }

  function claimCampaignContribution(uint256 campaignId) external {
    // TODO:
    // - Use the internal _validate function to verify the msg.sender has indeed reached the validationThreshold etc

    _addPartakerToCampaignContributors(campaignId, msg.sender);
    emit ContributorAdded(campaignId, msg.sender);
  }

  function claimCampaignRetribution(uint256 campaignId) external {
    CampaignContributors storage campaignContributors = campaignContributorsByCampaignId[campaignId];
    require(
      campaignContributors.contributorsByAddress[msg.sender] == true,
      "Caller is not a validated campaign contributor"
    );
    require(campaignContributors.contributorsClaimStatus[msg.sender] == false, "Retribution already claimed");
    uint256 retributionAmount = _computeRetributionAmount(campaignId);
    // TODO: Make the eth transfer to msg.sender
    _updateContributorClaimStatus(campaignId);
    emit ContributorRetributed(campaignId, msg.sender, retributionAmount);
  }

    /**
     * @notice Function that allow user to sign up to twitter and claim won twitters
     */
    function signUp(uint256 _userId) external {
      users.set(_userId, msg.sender);

      emit SignedUp(_userId, msg.sender);
      _requestSignUp(_userId);
    }

    /**
     * @notice Check if user has signed up
     * @param _userId - twitter user id
     */
    function hasSignedUp(uint256 _userId) external view returns (bool) {
      return users.contains(_userId);
    }

    /**
     * @notice Check if caller has signed up
     */
    function hasSignedUp() external view returns (bool) {
      bool found = false;
      for (uint256 idx = 0; idx < users.length(); idx++) if (users.get(idx) == msg.sender) found = true;
      return found;
    }

    ///
    /// CHAINLINK RESPONSES
    ///

    /**
     * @notice Fulfill Sign Up request
     *
     * @param _requestId - id of the request
     * @param _userId - twitter user id
     * @param _hasSignedUp - true if  twitter userId match msg.sender address
     */
    function fulfillSignUp(
      bytes32 _requestId,
      uint256 _userId,
      bool _hasSignedUp
    ) public recordChainlinkFulfillment(_requestId) {
      if (!_hasSignedUp) users.remove(_userId);

      address user = users.get(_userId);
      // TODO
      // for (uint256 round = 0; round < epoch.current(); round++)
      //   for (uint256 idx = 0; idx < winners[round].length; idx++)
      //     if (winners[round][idx].userId == _userId) winners[round][idx].playerAddress = user;
    }

    ///
    /// GETTERS FUNCTIONS
    ///

    /**
     * @notice Return URI for twitter endpoint
     */
    function getTwitterURI(uint256 _twitterId) public view returns (string memory _twitterURI) {
      return
        string(
          abi.encodePacked(
            requestBaseURI,
            "/chains/",
            block.chainid,
            "/twitters/",
            _twitterId,
            "/winners"
            // TODO: Add query params
            //   "?prizes=",
            //   prizes[_twitterId].length,
            //   "&tweetId",
            //   twitters[_twitterId].tweetId,
            //   "&retweetMaxCount",
            //   twitters[_twitterId].retweetMaxCount
          )
        );
    }

  function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
    return _getCampaign(campaignId);
  }

    /**
     * @notice Return URI for sign up endpoint
     */
    function getSignUpURI(uint256 _userId) public view returns (string memory _signUpURI) {
      return string(abi.encodePacked(requestBaseURI, "/users/", _userId));
    }

    ///
    /// ADMIN FUNCTIONS
    ///

    /**
     * @notice Witdraws LINK from the contract to the Owner
     * @dev only admin can call this function
     */
    function withdrawLink() external onlyAdmin {
      LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
      require(link.transfer(owner(), link.balanceOf(address(this))), "Unable to transfer");
    }

    /**
     * @notice Set requestBaseURI
     * @dev only admin can call this function
     */
    function setRequestBaseURI(string calldata _requestBaseURI) external onlyAdmin {
      requestBaseURI = _requestBaseURI;
    }

    /**
     * @notice Add user to users list
     * @dev only admin can call this function
     */
    function addUser(uint256 _userId, address _userAddress) external onlyAdmin {
      if (!users.contains(_userId)) users.set(_userId, _userAddress);
    }

    /**
     * @notice Call this method if no response is received within 5 minutes
     * @param _requestId The ID that was generated for the request to cancel
     * @param _payment The payment specified for the request to cancel
     * @param _callbackFunctionId The bytes4 callback function ID specified for
     * the request to cancel
     * @param _expiration The expiration generated for the request to cancel
     * @dev only admin can call this function
     */
    function cancelRequest(
      bytes32 _requestId,
      uint256 _payment,
      bytes4 _callbackFunctionId,
      uint256 _expiration
    ) public onlyAdmin {
      cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

  ///
  /// INTERNAL FUNCTIONS
  ///

  /**
   * @notice retrieves a campaign by its id
   * @param _campaignId the id of the campaign
   */
  function _getCampaign(uint256 _campaignId) internal view returns (Campaign storage) {
    return campaignById[_campaignId];
  }

  /**
   * @notice validates the input to performUpkeep
   * @param _twitterId the id of the cron job
   */
  function _validate(uint256 _twitterId) private view {
    // TODO implement and use
    // require(winners[_twitterId].length == 0, "Twitter winners already requesteds");
    // require(!twitters[_twitterId].isEnded, "Twitter already ended");
  }

  function _addPartakerToCampaignContributors(uint256 campaignId, address partaker) internal {
    Campaign storage campaign = _getCampaign(campaignId);
    CampaignContributors storage campaignContributors = campaignContributorsByCampaignId[campaignId];
    require(campaign.partakersLimit >= campaignContributors.contributorsCount, "Contributors limit already reached");
    require(campaign.isClosed == false, "Campaign is closed");
    campaignContributors.contributorsByAddress[partaker] = true;
    campaignContributors.contributorsClaimStatus[partaker] = false;
  }

  function _updateContributorClaimStatus(uint256 campaignId) internal {
    CampaignContributors storage campaignContributors = campaignContributorsByCampaignId[campaignId];
    campaignContributors.contributorsClaimStatus[msg.sender] = true;
  }

  function _computeRetributionAmount(uint256 campaignId) internal view returns (uint256) {
    Campaign storage campaign = _getCampaign(campaignId);
    uint256 retributionAmount = campaign.budget / campaign.partakersLimit;
    return retributionAmount;
  }

    /**
     * @notice Create request to sign up user
     * @dev only admin can call this function
     */
    function _requestSignUp(uint256 _userId) private onlyAdmin whenNotPaused returns (bytes32 _requestId) {
      Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillSignUp.selector);
      req.add("get", getSignUpURI(_userId));
      // https://docs.chain.link/any-api/testnet-oracles/
      req.add("path", "hasSignedUp");
      bytes32 requestId = sendChainlinkRequest(req, fee);
      emit SignUpRequested(_userId, requestId);
      return requestId;
    }

  /
  / MODIFIERS
  /

    /**
     * @notice Modifier that ensure only admin can access this function
     */
    modifier onlyAdmin() {
      require(msg.sender == owner(), "Caller is not the admin");
      _;
    }
}
