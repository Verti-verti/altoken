// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./SurveyToken.sol";

/**
 * @title SurveyContract
 * @dev Contrato principal para gestionar encuestas tokenizadas
 */
contract SurveyContract is Ownable, ReentrancyGuard {
    struct Survey {
        uint256 id;
        string title;
        string description;
        string[] options;
        uint256[] votes;
        address creator;
        uint256 rewardPerVote;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
    }
    
    struct Vote {
        address voter;
        uint256 optionIndex;
        uint256 timestamp;
    }
    
    SurveyToken public surveyToken;
    
    mapping(uint256 => Survey) public surveys;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => Vote[]) public surveyVotes;
    mapping(address => uint256[]) public userSurveys;
    mapping(address => uint256[]) public userVotes;
    
    uint256 public nextSurveyId = 1;
    uint256 public constant MIN_OPTIONS = 2;
    uint256 public constant MAX_OPTIONS = 10;
    uint256 public constant MIN_DURATION = 1 hours;
    uint256 public constant MAX_DURATION = 30 days;
    
    event SurveyCreated(
        uint256 indexed surveyId,
        address indexed creator,
        string title,
        uint256 rewardPerVote,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed surveyId,
        address indexed voter,
        uint256 optionIndex,
        uint256 reward
    );
    
    event SurveyEnded(uint256 indexed surveyId, uint256 totalVotes);
    
    constructor(address _surveyToken) {
        surveyToken = SurveyToken(_surveyToken);
    }
    
    /**
     * @dev Crear una nueva encuesta
     */
    function createSurvey(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _rewardPerVote,
        uint256 _duration
    ) external nonReentrant returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_options.length >= MIN_OPTIONS && _options.length <= MAX_OPTIONS, "Invalid options count");
        require(_duration >= MIN_DURATION && _duration <= MAX_DURATION, "Invalid duration");
        require(_rewardPerVote > 0, "Reward must be positive");
        
        uint256 surveyId = nextSurveyId++;
        uint256 endTime = block.timestamp + _duration;
        
        // Inicializar array de votos
        uint256[] memory initialVotes = new uint256[](_options.length);
        
        surveys[surveyId] = Survey({
            id: surveyId,
            title: _title,
            description: _description,
            options: _options,
            votes: initialVotes,
            creator: msg.sender,
            rewardPerVote: _rewardPerVote,
            endTime: endTime,
            isActive: true,
            totalVotes: 0
        });
        
        userSurveys[msg.sender].push(surveyId);
        
        // Recompensar al creador
        surveyToken.rewardSurveyCreation(msg.sender);
        
        emit SurveyCreated(surveyId, msg.sender, _title, _rewardPerVote, endTime);
        
        return surveyId;
    }
    
    /**
     * @dev Votar en una encuesta
     */
    function vote(uint256 _surveyId, uint256 _optionIndex) external nonReentrant {
        Survey storage survey = surveys[_surveyId];
        require(survey.isActive, "Survey is not active");
        require(block.timestamp <= survey.endTime, "Survey has ended");
        require(_optionIndex < survey.options.length, "Invalid option index");
        require(!hasVoted[_surveyId][msg.sender], "Already voted");
        
        // Registrar voto
        hasVoted[_surveyId][msg.sender] = true;
        survey.votes[_optionIndex]++;
        survey.totalVotes++;
        
        // Guardar detalles del voto
        surveyVotes[_surveyId].push(Vote({
            voter: msg.sender,
            optionIndex: _optionIndex,
            timestamp: block.timestamp
        }));
        
        userVotes[msg.sender].push(_surveyId);
        
        // Recompensar al votante
        surveyToken.rewardVote(msg.sender);
        
        emit VoteCast(_surveyId, msg.sender, _optionIndex, survey.rewardPerVote);
    }
    
    /**
     * @dev Finalizar una encuesta (solo el creador o owner)
     */
    function endSurvey(uint256 _surveyId) external {
        Survey storage survey = surveys[_surveyId];
        require(survey.isActive, "Survey is not active");
        require(
            msg.sender == survey.creator || msg.sender == owner(),
            "Not authorized to end survey"
        );
        
        survey.isActive = false;
        
        emit SurveyEnded(_surveyId, survey.totalVotes);
    }
    
    /**
     * @dev Obtener detalles de una encuesta
     */
    function getSurvey(uint256 _surveyId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        string[] memory options,
        uint256[] memory votes,
        address creator,
        uint256 rewardPerVote,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes
    ) {
        Survey memory survey = surveys[_surveyId];
        return (
            survey.id,
            survey.title,
            survey.description,
            survey.options,
            survey.votes,
            survey.creator,
            survey.rewardPerVote,
            survey.endTime,
            survey.isActive,
            survey.totalVotes
        );
    }
    
    /**
     * @dev Obtener encuestas activas
     */
    function getActiveSurveys() external view returns (uint256[] memory) {
        uint256[] memory activeSurveys = new uint256[](nextSurveyId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextSurveyId; i++) {
            if (surveys[i].isActive && block.timestamp <= surveys[i].endTime) {
                activeSurveys[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeSurveys[i];
        }
        
        return result;
    }
    
    /**
     * @dev Obtener encuestas de un usuario
     */
    function getUserSurveys(address _user) external view returns (uint256[] memory) {
        return userSurveys[_user];
    }
    
    /**
     * @dev Obtener votos de un usuario
     */
    function getUserVotes(address _user) external view returns (uint256[] memory) {
        return userVotes[_user];
    }
    
    /**
     * @dev Verificar si un usuario ha votado en una encuesta
     */
    function hasUserVoted(uint256 _surveyId, address _user) external view returns (bool) {
        return hasVoted[_surveyId][_user];
    }
    
    /**
     * @dev Obtener estadísticas de la plataforma
     */
    function getPlatformStats() external view returns (
        uint256 totalSurveys,
        uint256 activeSurveys,
        uint256 totalVotes
    ) {
        uint256 activeCount = 0;
        uint256 totalVoteCount = 0;
        
        for (uint256 i = 1; i < nextSurveyId; i++) {
            if (surveys[i].isActive && block.timestamp <= surveys[i].endTime) {
                activeCount++;
            }
            totalVoteCount += surveys[i].totalVotes;
        }
        
        return (nextSurveyId - 1, activeCount, totalVoteCount);
    }
}
