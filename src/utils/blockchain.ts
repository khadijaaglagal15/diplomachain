import { ethers } from 'ethers';
import DiplomaVerificationABI from '../contracts/DiplomaVerification.json';
import { createDiploma, fetchDiplomaByHash, revokeDiplomaAPI } from './api';

// Get contract address from environment variables
 const CONTRACT_ADDRESS = '0x3aa2c3ae36905a20b662304be46ae154029c4efe';

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const initializeBlockchain = async (): Promise<boolean> => {
  try {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, DiplomaVerificationABI, signer);
      
      return true;
    } else {
      console.error('Ethereum wallet not detected');
      return false;
    }
  } catch (error) {
    console.error('Error initializing blockchain:', error);
    return false;
  }
};

export const issueDiploma = async (
  studentName: string,
  universityName: string,
  diplomaName: string,
  ipfsHash: string,
  studentId?: string
): Promise<string> => {
  if (!contract) {
    throw new Error('Blockchain not initialized');
  }
  
  try {
    const tx = await contract.issueDiploma(studentName, universityName, diplomaName, ipfsHash);
    const receipt = await tx.wait();
    
    // Find the DiplomaIssued event in the transaction logs
    const event = receipt.logs
      .filter((log: any) => log.topics[0] === ethers.id("DiplomaIssued(bytes32,string,string,string)"))
      .map((log: any) => contract?.interface.parseLog(log))[0];
    
    const diplomaHash = event.args.diplomaHash;
    
    // Save diploma to MongoDB
    const walletAddress = await getWalletAddress();
    await createDiploma({
      diplomaHash,
      studentName,
      studentId: studentId || '',
      universityName,
      universityAddress: walletAddress,
      diplomaName,
      ipfsHash,
      issueDate: new Date(),
      isValid: true
    });
    
    return diplomaHash;
  } catch (error) {
    console.error('Error issuing diploma:', error);
    throw new Error('Failed to issue diploma on blockchain');
  }
};

export const verifyDiploma = async (diplomaHash: string): Promise<any> => {
  if (!contract) {
    throw new Error('Blockchain not initialized');
  }
  
  try {
    // First check MongoDB for additional metadata
    const dbDiploma = await fetchDiplomaByHash(diplomaHash);
    
    // Then verify on blockchain
    const result = await contract.verifyDiploma(diplomaHash);
    
    return {
      studentName: result.studentName,
      universityName: result.universityName,
      diplomaName: result.diplomaName,
      ipfsHash: result.ipfsHash,
      issueDate: new Date(Number(result.issueDate) * 1000),
      isValid: result.isValid,
      // Add additional data from MongoDB if available
      studentId: dbDiploma?.studentId || '',
      metadata: dbDiploma?.metadata || {},
      revokedReason: dbDiploma?.revokedReason || ''
    };
  } catch (error) {
    console.error('Error verifying diploma:', error);
    throw new Error('Failed to verify diploma on blockchain');
  }
};

export const revokeDiploma = async (diplomaHash: string, reason: string): Promise<boolean> => {
  if (!contract) {
    throw new Error('Blockchain not initialized');
  }
  
  try {
    const tx = await contract.revokeDiploma(diplomaHash);
    await tx.wait();
    
    // Update MongoDB record
    await revokeDiplomaAPI(diplomaHash, reason);
    
    return true;
  } catch (error) {
    console.error('Error revoking diploma:', error);
    throw new Error('Failed to revoke diploma on blockchain');
  }
};

export const authorizeUniversity = async (universityAddress: string): Promise<boolean> => {
  if (!contract) {
    throw new Error('Blockchain not initialized');
  }
  
  try {
    const tx = await contract.authorizeUniversity(universityAddress);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error authorizing university:', error);
    throw new Error('Failed to authorize university on blockchain');
  }
};

export const getWalletAddress = async (): Promise<string> => {
  if (!signer) {
    throw new Error('Blockchain not initialized');
  }
  
  try {
    return await signer.getAddress();
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw new Error('Failed to get wallet address');
  }
};