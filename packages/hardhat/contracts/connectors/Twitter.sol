// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/* 
TODO:
- Campain Struct:
    - budget 
    - retweet threshold
    - number of influencers

- function to create a new campaign
- function to validate campagn claim (Called by influencer with tweetUrl) If retweet > threshold -> transfer slice of budget (slice computed budget/number of influencers)

ValidateCampaignClaim:
- requestValidateCampaign -> chainlink (maybe replace by chainlink function?)
- fulfillValidateCampaign -> chainlink

*/



contract TwitterV1 is ChainlinkClient, KeeperCompatibleInterface {
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
        uint256 retweetThreshold;
        uint256 allowedInfluencersAmount;
    }

    // TODO: Enumerable map ?
    Campaign[] campaigns;
    mapping(uint256 => Campaign) campaignById;


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
    )  {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        // 0,1 * 10**18 (Varies by network and job)
        fee = (1 * LINK_DIVISIBILITY) / 10;

        treasuryFee = _treasuryFee;
        requestBaseURI = _requestBaseURI;
        owner = msg.sender;
    }

    ///
    /// MAIN FUNCTIONS
    ///


    function createCampaign(
        uint256 budget,
        uint256 retweetThreshold,
        uint256 allowedInfluencersAmount
    ) external {
        lastCampaignId++;
        uint256 newCampaignId = lastCampaignId;
        Campaign storage newCampaign = campaignById[newCampaignId];
        newCampaign.budget = budget;
        newCampaign.retweetThreshold = retweetThreshold;
        newCampaign.allowedInfluencersAmount = allowedInfluencersAmount;
        newCampaign.company = msg.sender;
        campaigns.push(newCampaign);
    }


    /**
     * @notice Function that allow user to sign up to twitter and claim wonned twitters
     */
    function signUp(uint256 _userId) external override {
        users.set(_userId, msg.sender);

        emit SignedUp(_userId, msg.sender);
        _requestSignUp(_userId);
    }

    /**
     * @notice Check if user has signed up
     * @param _userId - twitter user id
     */
    function hasSignedUp(uint256 _userId) external view override returns (bool) {
        return users.contains(_userId);
    }

    /**
     * @notice Check if caller has signed up
     */
    function hasSignedUp() external view override returns (bool) {
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
    ) public override recordChainlinkFulfillment(_requestId) {
        if (!_hasSignedUp) users.remove(_userId);

        address user = users.get(_userId);
        for (uint256 round = 0; round < epoch.current(); round++)
            for (uint256 idx = 0; idx < winners[round].length; idx++)
                if (winners[round][idx].userId == _userId) winners[round][idx].playerAddress = user;
    }

    ///
    /// GETTERS FUNCTIONS
    ///

    /**
     * @notice Return URI for twitter endpoint
     */
    function getTwitterURI(uint256 _twitterId) public view override returns (string memory _twitterURI) {
        return
            string(
                abi.encodePacked(
                    requestBaseURI,
                    "/chains/",
                    block.chainid,
                    "/twitters/",
                    _twitterId,
                    "/winners",
                    "?prizes=",
                    prizes[_twitterId].length,
                    "&tweetId",
                    twitters[_twitterId].tweetId,
                    "&retweetMaxCount",
                    twitters[_twitterId].retweetMaxCount
                )
            );
    }


    /**
     * @notice Return URI for sign up endpoint
     */
    function getSignUpURI(uint256 _userId) public view override returns (string memory _signUpURI) {
        return string(abi.encodePacked(requestBaseURI, "/users/", _userId));
    }

    ///
    /// ADMIN FUNCTIONS
    ///

    /**
     * @notice Witdraws LINK from the contract to the Owner
     * @dev only admin can call this function
     */
    function withdrawLink() external override onlyAdmin {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(owner, link.balanceOf(address(this))), "Unable to transfer");
    }

    /**
     * @notice Set requestBaseURI
     * @dev only admin can call this function
     */
    function setRequestBaseURI(string calldata _requestBaseURI) external override onlyAdmin {
        requestBaseURI = _requestBaseURI;
    }

    /**
     * @notice Add user to users list
     * @dev only admin can call this function
     */
    function addUser(uint256 _userId, address _userAddress) external override onlyAdmin {
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
    ) public override onlyAdmin {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    ///
    /// INTERNAL FUNCTIONS
    ///

    /**
     * @notice validates the input to performUpkeep
     * @param _twitterId the id of the cron job
     */
    // TODO TO REFACTO
    function _validate(uint256 _twitterId) private view {
        require(winners[_twitterId].length == 0, "Twitter winners already requesteds");
        require(!twitters[_twitterId].isEnded, "Twitter already ended");
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
}
