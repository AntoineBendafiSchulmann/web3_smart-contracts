// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleVoting {
    address public owner = msg.sender;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner"); _;
    }

    struct Ballot {
        string   title;
        string[] options;
        bool     open;
        mapping(address => bool) hasVoted;
        mapping(uint => uint)    votes;
        uint     totalVotes;
    }

    uint                      public nextBallotId;
    mapping(uint => Ballot)   private ballots;

    event BallotOpened(uint indexed id, string title);
    event Voted       (uint indexed id, address voter, uint option);
    event BallotClosed(uint indexed id);

    function openBallot(string calldata _title, string[] calldata _options)
        external onlyOwner
    {
        require(_options.length >= 2, "Min 2 options");
        uint id = nextBallotId++;
        Ballot storage b = ballots[id];
        b.title = _title;
        b.open  = true;
        for (uint i; i < _options.length; ++i) b.options.push(_options[i]);
        emit BallotOpened(id, _title);
    }

    function closeBallot(uint id) external onlyOwner {
        Ballot storage b = ballots[id];
        require(b.open, "Closed");
        b.open = false;
        emit BallotClosed(id);
    }

    function vote(uint id, uint option) external {
        Ballot storage b = ballots[id];
        require(b.open, "Closed");
        require(option < b.options.length, "Bad option");
        require(!b.hasVoted[msg.sender], "Voted");
        b.hasVoted[msg.sender] = true;
        ++b.votes[option];
        ++b.totalVotes;
        emit Voted(id, msg.sender, option);
    }

    function getOptions(uint id) external view returns (string[] memory) {
        return ballots[id].options;
    }
    function getVoteCount(uint id, uint option) external view returns (uint) {
        return ballots[id].votes[option];
    }
    function hasVoted(uint id, address who) external view returns (bool) {
        return ballots[id].hasVoted[who];
    }
    function ballotState(uint id)
        external view
        returns (string memory, bool, uint)
    {
        Ballot storage b = ballots[id];
        return (b.title, b.open, b.totalVotes);
    }
}