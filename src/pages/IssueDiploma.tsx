import React, { useState, useEffect } from 'react';
import { FileCheck, Upload, AlertCircle, User } from 'lucide-react';
import { uploadToIPFS } from '../utils/ipfs';
import { issueDiploma } from '../utils/blockchain';
import { fetchDiplomasByUniversity } from '../utils/api';
import { getWalletAddress } from '../utils/blockchain';

interface Diploma {
  _id: string;
  diplomaHash: string;
  studentName: string;
  studentId: string;
  universityName: string;
  diplomaName: string;
  issueDate: string;
  isValid: boolean;
}

const IssueDiploma: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [diplomaName, setDiplomaName] = useState('');
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [diplomaHash, setDiplomaHash] = useState('');
  
  // For issued diplomas list
  const [issuedDiplomas, setIssuedDiplomas] = useState<Diploma[]>([]);
  const [isLoadingDiplomas, setIsLoadingDiplomas] = useState(false);

  useEffect(() => {
    const loadIssuedDiplomas = async () => {
      setIsLoadingDiplomas(true);
      try {
        const address = await getWalletAddress();
        const diplomas = await fetchDiplomasByUniversity(address);
        setIssuedDiplomas(diplomas);
      } catch (err) {
        console.error('Error loading issued diplomas:', err);
      } finally {
        setIsLoadingDiplomas(false);
      }
    };

    loadIssuedDiplomas();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDiplomaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!diplomaFile) {
        throw new Error('Please upload a diploma file');
      }

      // Upload file to IPFS
      const ipfsHash = await uploadToIPFS(diplomaFile);
      
      // Issue diploma on blockchain
      const hash = await issueDiploma(studentName, universityName, diplomaName, ipfsHash, studentId);
      
      setDiplomaHash(hash);
      setSuccess(true);
      
      // Reset form
      setStudentName('');
      setStudentId('');
      setUniversityName('');
      setDiplomaName('');
      setDiplomaFile(null);
      
      // Reload issued diplomas
      const address = await getWalletAddress();
      const diplomas = await fetchDiplomasByUniversity(address);
      setIssuedDiplomas(diplomas);
      
    } catch (err) {
      console.error('Error issuing diploma:', err);
      setError(err instanceof Error ? err.message : 'Failed to issue diploma');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-700 p-6 text-white">
              <h1 className="text-2xl font-bold flex items-center">
                <FileCheck className="mr-2" size={24} />
                Issue New Diploma
              </h1>
              <p className="mt-2 text-indigo-100">
                Create a new blockchain-verified diploma for a student
              </p>
            </div>

            {success ? (
              <div className="p-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Diploma Successfully Issued!</h2>
                  <p className="text-green-700 mb-4">
                    The diploma has been securely stored on the blockchain and IPFS.
                  </p>
                  <div className="bg-white border border-gray-200 rounded p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Diploma Hash (Share with the student)</p>
                    <p className="font-mono text-sm break-all">{diplomaHash}</p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Issue Another Diploma
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID (Optional)
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="universityName" className="block text-sm font-medium text-gray-700 mb-1">
                      University Name
                    </label>
                    <input
                      type="text"
                      id="universityName"
                      value={universityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="diplomaName" className="block text-sm font-medium text-gray-700 mb-1">
                      Diploma Title/Degree
                    </label>
                    <input
                      type="text"
                      id="diplomaName"
                      value={diplomaName}
                      onChange={(e) => setDiplomaName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="diplomaFile" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Diploma Document (PDF)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="diplomaFile"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="diplomaFile"
                            name="diplomaFile"
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      {diplomaFile && (
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          Selected: {diplomaFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileCheck className="mr-2" size={20} />
                        Issue Diploma
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="bg-indigo-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <User className="mr-2" size={20} />
                Recently Issued Diplomas
              </h2>
            </div>

            <div className="p-4">
              {isLoadingDiplomas ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : issuedDiplomas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileCheck size={40} className="mx-auto text-gray-300 mb-2" />
                  <p>No diplomas issued yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {issuedDiplomas.map((diploma) => (
                    <div key={diploma._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{diploma.studentName}</h3>
                          {diploma.studentId && (
                            <p className="text-xs text-gray-500">ID: {diploma.studentId}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          diploma.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {diploma.isValid ? 'Valid' : 'Revoked'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{diploma.diplomaName}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          {new Date(diploma.issueDate).toLocaleDateString()}
                        </p>
                        <button 
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                          onClick={() => {
                            navigator.clipboard.writeText(diploma.diplomaHash);
                            alert('Diploma hash copied to clipboard!');
                          }}
                        >
                          Copy Hash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDiploma;

