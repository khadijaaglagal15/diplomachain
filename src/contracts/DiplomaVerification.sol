// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomaVerification {
    struct Diploma {
        string studentName;
        string universityName;
        string diplomaName;
        string ipfsHash;
        uint256 issueDate;
        bool isValid;
    }
    
    // Mapping from diploma hash to Diploma struct
    mapping(bytes32 => Diploma) public diplomas;
    
    // Mapping from university address to boolean (authorized or not)
    mapping(address => bool) public authorizedUniversities;
    
    // Owner of the contract
    address public owner;
    
    // Events
    event DiplomaIssued(bytes32 indexed diplomaHash, string studentName, string universityName, string diplomaName);
    event DiplomaRevoked(bytes32 indexed diplomaHash);
    event UniversityAuthorized(address indexed universityAddress);
    event UniversityRevoked(address indexed universityAddress);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorizedUniversity() {
        require(authorizedUniversities[msg.sender], "Only authorized universities can call this function");
        _;
    }
    
    function authorizeUniversity(address _universityAddress) public onlyOwner {
        authorizedUniversities[_universityAddress] = true;
        emit UniversityAuthorized(_universityAddress);
    }
    
    function revokeUniversity(address _universityAddress) public onlyOwner {
        authorizedUniversities[_universityAddress] = false;
        emit UniversityRevoked(_universityAddress);
    }
    
    function issueDiploma(
        string memory _studentName,
        string memory _universityName,
        string memory _diplomaName,
        string memory _ipfsHash
    ) public onlyAuthorizedUniversity returns (bytes32) {
        bytes32 diplomaHash = keccak256(abi.encodePacked(_studentName, _universityName, _diplomaName, _ipfsHash));
        
        // Ensure this diploma hasn't been issued before
        require(diplomas[diplomaHash].issueDate == 0, "Diploma already exists");
        
        diplomas[diplomaHash] = Diploma({
            studentName: _studentName,
            universityName: _universityName,
            diplomaName: _diplomaName,
            ipfsHash: _ipfsHash,
            issueDate: block.timestamp,
            isValid: true
        });
        
        emit DiplomaIssued(diplomaHash, _studentName, _universityName, _diplomaName);
        
        return diplomaHash;
    }
    
    function revokeDiploma(bytes32 _diplomaHash) public onlyAuthorizedUniversity {
        require(diplomas[_diplomaHash].issueDate > 0, "Diploma does not exist");
        diplomas[_diplomaHash].isValid = false;
        
        emit DiplomaRevoked(_diplomaHash);
    }
    
    function verifyDiploma(bytes32 _diplomaHash) public view returns (
        string memory studentName,
        string memory universityName,
        string memory diplomaName,
        string memory ipfsHash,
        uint256 issueDate,
        bool isValid
    ) {
        Diploma memory diploma = diplomas[_diplomaHash];
        require(diploma.issueDate > 0, "Diploma does not exist");
        
        return (
            diploma.studentName,
            diploma.universityName,
            diploma.diplomaName,
            diploma.ipfsHash,
            diploma.issueDate,
            diploma.isValid
        );
    }
    
    function getDiplomaHash(
        string memory _studentName,
        string memory _universityName,
        string memory _diplomaName,
        string memory _ipfsHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_studentName, _universityName, _diplomaName, _ipfsHash));
    }
}