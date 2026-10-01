import React, { useState, useEffect } from 'react';
import { FileText, Search, AlertCircle, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchDiplomasByUniversity } from '../utils/api';
import { getWalletAddress, revokeDiploma } from '../utils/blockchain';
import { getFromIPFS } from '../utils/ipfs';

interface Diploma {
  _id: string;
  diplomaHash: string;
  studentName: string;
  studentId: string;
  universityName: string;
  diplomaName: string;
  ipfsHash: string;
  issueDate: string;
  isValid: boolean;
  revokedDate?: string;
  revokedReason?: string;
}

const DiplomaManagement: React.FC = () => {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadDiplomas = async () => {
    setIsLoading(true);
    setError('');
    try {
      const address = await getWalletAddress();
      const data = await fetchDiplomasByUniversity(address);
      setDiplomas(data);
    } catch (err) {
      console.error('Error loading diplomas:', err);
      setError('Failed to load diplomas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiplomas();
  }, []);

  const handleViewDocument = async (ipfsHash: string) => {
    try {
      setIsLoading(true);
      const blob = await getFromIPFS(ipfsHash);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error retrieving document from IPFS:', err);
      setError('Failed to retrieve document from IPFS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedDiploma) return;
    
    setIsRevoking(true);
    try {
      await revokeDiploma(selectedDiploma.diplomaHash, revokeReason);
      setShowRevokeModal(false);
      setRevokeReason('');
      await loadDiplomas();
    } catch (err) {
      console.error('Error revoking diploma:', err);
      setError('Failed to revoke diploma');
    } finally {
      setIsRevoking(false);
    }
  };

  const filteredDiplomas = diplomas.filter(diploma => 
    diploma.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diploma.diplomaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diploma.diplomaHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (diploma.studentId && diploma.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2" size={24} />
            Diploma Management
          </h1>
          <p className="mt-2 text-indigo-100">
            Manage and track all diplomas issued by your institution
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-6">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by student name, diploma name, or hash..."
              />
            </div>
            <button
              onClick={loadDiplomas}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center hover:bg-indigo-200"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : diplomas.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No Diplomas Found</h3>
              <p className="text-gray-500 mt-1">You haven't issued any diplomas yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diploma
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDiplomas.map((diploma) => (
                    <tr key={diploma._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{diploma.studentName}</div>
                        {diploma.studentId && (
                          <div className="text-sm text-gray-500">ID: {diploma.studentId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{diploma.diplomaName}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1 truncate max-w-xs">
                          {diploma.diplomaHash}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(diploma.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {diploma.isValid ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Valid
                          </span>
                        ) : (
                          <div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Revoked
                            </span>
                            {diploma.revokedDate && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(diploma.revokedDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDocument(diploma.ipfsHash)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Document"
                          >
                            <FileText size={18} />
                          </button>
                          {diploma.isValid && (
                            <button
                              onClick={() => {
                                setSelectedDiploma(diploma);
                                setShowRevokeModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Revoke Diploma"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Revoke Modal */}
      {showRevokeModal && selectedDiploma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Revoke Diploma</h3>
            </div>
            
            <p className="mb-4 text-gray-700">
              Are you sure you want to revoke the diploma issued to <span className="font-semibold">{selectedDiploma.studentName}</span>?
              This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label htmlFor="revokeReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Revocation
              </label>
              <textarea
                id="revokeReason"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRevokeModal(false);
                  setRevokeReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isRevoking || !revokeReason}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg ${
                  isRevoking || !revokeReason ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {isRevoking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block mr-2"></div>
                    Revoking...
                  </>
                ) : (
                  'Revoke Diploma'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiplomaManagement;