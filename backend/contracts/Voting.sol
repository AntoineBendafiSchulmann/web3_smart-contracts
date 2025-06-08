// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Voting {
    address public immutable owner = msg.sender;
    modifier onlyOwner() { require(msg.sender == owner, "Owner only"); _; }

    struct Ballot {
        string   title;
        string[] options;
        bool     open;
        uint     maxVoters;
        uint     registered;
        uint     totalVotes;
        mapping(address => bool) isRegistered;
        mapping(address => bool) hasVoted;
        mapping(uint => uint)    votes;
    }

    uint                    public nextBallotId;
    mapping(uint => Ballot) private ballots;

    event BallotOpened  (uint indexed id, string title, uint maxVoters);
    event Registered    (uint indexed id, address elector);
    event Voted         (uint indexed id, address elector, uint option);
    event BallotClosed  (uint indexed id);
    event BallotReset   (uint indexed id);

    function openBallot(
        string calldata _title,
        string[] calldata _options,
        uint _maxVoters
    ) external onlyOwner {
        require(_options.length >= 2, "Min 2 options");
        require(_maxVoters > 0, "MaxVoters > 0");
        uint id = nextBallotId++;
        Ballot storage b = ballots[id];
        b.title      = _title;
        b.maxVoters  = _maxVoters;
        b.open       = true;
        for (uint i; i < _options.length; ++i) b.options.push(_options[i]);
        emit BallotOpened(id, _title, _maxVoters);
    }

    function closeBallot(uint id) external onlyOwner {
        Ballot storage b = ballots[id];
        require(b.open, "Already closed");
        b.open = false;
        emit BallotClosed(id);
    }

    function resetIfTie(uint id) external onlyOwner {
        Ballot storage b = ballots[id];
        uint best;
        for (uint i; i < b.options.length; ++i)
            if (b.votes[i] > best) best = b.votes[i];
        uint winners;
        for (uint i; i < b.options.length; ++i)
            if (b.votes[i] == best && best > 0) ++winners;
        require(winners > 1, "No tie");
        for (uint i; i < b.options.length; ++i) b.votes[i] = 0;
        b.totalVotes = 0;
        emit BallotReset(id);
    }

    function register(uint id) external {
        Ballot storage b = ballots[id];
        require(b.open, "Closed");
        require(!b.isRegistered[msg.sender], "Already registered");
        require(b.registered < b.maxVoters, "Max voters reached");
        b.isRegistered[msg.sender] = true;
        ++b.registered;
        emit Registered(id, msg.sender);
    }

    function vote(uint id, uint option) external {
        Ballot storage b = ballots[id];
        require(b.open, "Closed");
        require(b.isRegistered[msg.sender], "Not registered");
        require(option < b.options.length, "Bad option");
        require(!b.hasVoted[msg.sender], "Already voted");
        b.hasVoted[msg.sender] = true;
        ++b.votes[option];
        ++b.totalVotes;
        emit Voted(id, msg.sender, option);
    }

    function getOptions(uint id) external view returns (string[] memory) {
        return ballots[id].options;
    }

    function ballotState(uint id)
        external
        view
        returns (string memory title, bool open, uint max, uint reg, uint total)
    {
        Ballot storage b = ballots[id];
        return (b.title, b.open, b.maxVoters, b.registered, b.totalVotes);
    }

    function tally(uint id, uint option) external view returns (uint) {
        return ballots[id].votes[option];
    }

    function status(uint id, address who)
        external
        view
        returns (bool registered, bool voted)
    {
        Ballot storage b = ballots[id];
        return (b.isRegistered[who], b.hasVoted[who]);
    }
}