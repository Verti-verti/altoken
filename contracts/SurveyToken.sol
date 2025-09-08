// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SurveyToken
 * @dev Token ERC20 para recompensar participación en encuestas
 */
contract SurveyToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    uint256 public constant VOTE_REWARD = 10 * 10**18; // 10 tokens por voto
    uint256 public constant CREATE_REWARD = 50 * 10**18; // 50 tokens por crear encuesta
    
    mapping(address => uint256) public userVotes;
    mapping(address => uint256) public userSurveys;
    mapping(address => uint256) public lastClaimTime;
    
    uint256 public totalVotes;
    uint256 public totalSurveys;
    
    event VoteReward(address indexed user, uint256 amount);
    event SurveyReward(address indexed creator, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("SurveyVerse Token", "SURV") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Recompensa por votar en una encuesta
     */
    function rewardVote(address voter) external onlyOwner nonReentrant {
        require(voter != address(0), "Invalid voter address");
        
        userVotes[voter]++;
        totalVotes++;
        
        _mint(voter, VOTE_REWARD);
        emit VoteReward(voter, VOTE_REWARD);
    }
    
    /**
     * @dev Recompensa por crear una encuesta
     */
    function rewardSurveyCreation(address creator) external onlyOwner nonReentrant {
        require(creator != address(0), "Invalid creator address");
        
        userSurveys[creator]++;
        totalSurveys++;
        
        _mint(creator, CREATE_REWARD);
        emit SurveyReward(creator, CREATE_REWARD);
    }
    
    /**
     * @dev Permite a los usuarios reclamar recompensas acumuladas
     */
    function claimRewards() external nonReentrant {
        require(block.timestamp >= lastClaimTime[msg.sender] + 1 days, "Can only claim once per day");
        
        uint256 pendingRewards = calculatePendingRewards(msg.sender);
        require(pendingRewards > 0, "No rewards to claim");
        
        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, pendingRewards);
        
        emit TokensClaimed(msg.sender, pendingRewards);
    }
    
    /**
     * @dev Calcula recompensas pendientes para un usuario
     */
    function calculatePendingRewards(address user) public view returns (uint256) {
        uint256 dailyBonus = 5 * 10**18; // 5 tokens diarios
        uint256 timeSinceLastClaim = block.timestamp - lastClaimTime[user];
        
        if (timeSinceLastClaim >= 1 days) {
            return dailyBonus;
        }
        
        return 0;
    }
    
    /**
     * @dev Obtiene estadísticas de un usuario
     */
    function getUserStats(address user) external view returns (
        uint256 votes,
        uint256 surveys,
        uint256 balance,
        uint256 pendingRewards
    ) {
        return (
            userVotes[user],
            userSurveys[user],
            balanceOf(user),
            calculatePendingRewards(user)
        );
    }
    
    /**
     * @dev Obtiene estadísticas globales
     */
    function getGlobalStats() external view returns (
        uint256 totalVotesCount,
        uint256 totalSurveysCount,
        uint256 totalSupply
    ) {
        return (
            totalVotes,
            totalSurveys,
            totalSupply()
        );
    }
}
