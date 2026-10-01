import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, FileText, Calendar, User, Building, AlertTriangle } from 'lucide-react';
import { verifyDiploma } from '../utils/blockchain';
import { getFromIPFS } from '../utils/ipfs';

interface VerificationResult {
  studentName: string;
  studentId?: string;
  universityName: string;
  diplomaName: string;
  ipfsHash: string;
  issueDate: Date;
  isValid: boolean;
  revokedReason?: string;
  metadata?: any;
}

const VerifyDiploma: React.FC = () => {
  const [diplomaHash, setDiplomaHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDocument, setShowDocument] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setShowDocument(false);

    try {
      if (!diplomaHash) {
        throw new Error('Please enter a diploma hash');
      }

      // Verify diploma on blockchain
      const verificationResult = await verifyDiploma(diplomaHash);
      setResult(verificationResult);
      
    } catch (err) {
      console.error('Error verifying diploma:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify diploma');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocument = async () => {
    if (!result) return;
    
    try {
      setIsLoading(true);
      const blob = await getFromIPFS(result.ipfsHash);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setShowDocument(true);
    } catch (err) {
      console.error('Error retrieving document from IPFS:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve document from IPFS');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <Search className="mr-2" size={24} />
            Verify Diploma
          </h1>
          <p className="mt-2 text-indigo-100">
            Verify the authenticity of a diploma using its blockchain hash
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleVerify} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="diplomaHash" className="block text-sm font-medium text-gray-700 mb-1">
                  Diploma Hash
                </label>
                <input
                  type="text"
                  id="diplomaHash"
                  value={diplomaHash}
                  onChange={(e) => setDiplomaHash(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the diploma hash to verify"
                  required
                />
              </div>
              <div className="md:self-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2" size={20} />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start mb-8">
              <XCircle size={24} className="mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Verification Failed</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className={`border rounded-lg overflow-hidden ${result.isValid ? 'border-green-200' : 'border-red-200'}`}>
              <div className={`p-6 flex items-start ${result.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                {result.isValid ? (
                  <CheckCircle size={24} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={24} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${result.isValid ? 'text-green-800' : 'text-red-800'}`}>
                    {result.isValid ? 'Diploma Verified' : 'Invalid Diploma'}
                  </h3>
                  <p className={result.isValid ? 'text-green-700' : 'text-red-700'}>
                    {result.isValid 
                      ? 'This diploma has been verified as authentic and has not been revoked.' 
                      : `This diploma is invalid or has been revoked. ${result.revokedReason ? `Reason: ${result.revokedReason}` : ''}`}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User size={20} className="text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-medium">{result.studentName}</p>
                      {result.studentId && (
                        <p className="text-xs text-gray-500 mt-1">ID: {result.studentId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building size={20} className="text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="font-medium">{result.universityName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Diploma/Degree</p>
                    <p className="font-medium">{result.diplomaName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-medium">{result.issueDate.toLocaleDateString()}</p>
                  </div>
                </div>

                {result.metadata && Object.keys(result.metadata).length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Information</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.isValid && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleViewDocument}
                      disabled={isLoading}
                      className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Loading Document...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2" size={18} />
                          View Original Document
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Verify a Diploma</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li>Ask the diploma holder for their unique diploma hash</li>
              <li>Enter the hash in the field above and click "Verify"</li>
              <li>Check the verification result and diploma details</li>
              <li>For additional verification, view the original document</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyDiploma;