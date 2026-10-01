import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, AlertCircle, Check, X, RefreshCw, Trash2, Edit } from 'lucide-react';
import { authorizeUniversity } from '../utils/blockchain';
import { fetchUniversities, createUniversity, updateUniversity, authorizeUniversityAPI, deactivateUniversity } from '../utils/api';

interface University {
  _id: string;
  name: string;
  address: string;
  email: string;
  website: string;
  country: string;
  isAuthorized: boolean;
  isActive: boolean;
  authorizedDate?: Date;
  createdAt: Date;
}
const CONTRACT_ADDRESS = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';

const AdminPanel: React.FC = () => {
  const [universityAddress, setUniversityAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  
  // New university form
  const [showNewUniversityForm, setShowNewUniversityForm] = useState(false);
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    address: '',
    email: '',
    website: '',
    country: ''
  });

  // Load universities
  const loadUniversities = async () => {
    setIsLoadingUniversities(true);
    try {
      const data = await fetchUniversities();
      setUniversities(data);
    } catch (err) {
      console.error('Error loading universities:', err);
      setError('Failed to load universities');
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!universityAddress) {
        throw new Error('Please enter a university Ethereum address');
      }

      // Authorize university on blockchain
      await authorizeUniversity(universityAddress);
      setSuccess(true);
      setUniversityAddress('');
      
      // Reload universities
      await loadUniversities();
      
    } catch (err) {
      console.error('Error authorizing university:', err);
      setError(err instanceof Error ? err.message : 'Failed to authorize university');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewUniversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUniversity(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createUniversity(newUniversity);
      setNewUniversity({
        name: '',
        address: '',
        email: '',
        website: '',
        country: ''
      });
      setShowNewUniversityForm(false);
      await loadUniversities();
    } catch (err) {
      console.error('Error creating university:', err);
      setError(err instanceof Error ? err.message : 'Failed to create university');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorizeUniversity = async (id: string, address: string) => {
    setIsLoading(true);
    try {
      // Update in MongoDB
      await authorizeUniversityAPI(id);
      
      // Update on blockchain
      await authorizeUniversity(address);
      
      await loadUniversities();
    } catch (err) {
      console.error('Error authorizing university:', err);
      setError(err instanceof Error ? err.message : 'Failed to authorize university');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateUniversity = async (id: string) => {
    setIsLoading(true);
    try {
      await deactivateUniversity(id);
      await loadUniversities();
    } catch (err) {
      console.error('Error deactivating university:', err);
      setError(err instanceof Error ? err.message : 'Failed to deactivate university');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2" size={24} />
            Admin Panel
          </h1>
          <p className="mt-2 text-indigo-100">
            Manage authorized universities and system settings
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-6">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start mb-6">
              <Shield size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>University successfully authorized to issue diplomas!</span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">University Management</h2>
              <button
                onClick={() => setShowNewUniversityForm(!showNewUniversityForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center hover:bg-indigo-700"
              >
                <UserPlus className="mr-2" size={18} />
                {showNewUniversityForm ? 'Cancel' : 'Add University'}
              </button>
            </div>

            {showNewUniversityForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New University</h3>
                <form onSubmit={handleCreateUniversity} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        University Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newUniversity.name}
                        onChange={handleNewUniversityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Ethereum Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={newUniversity.address}
                        onChange={handleNewUniversityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0x..."
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={newUniversity.email}
                        onChange={handleNewUniversityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={newUniversity.website}
                        onChange={handleNewUniversityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={newUniversity.country}
                        onChange={handleNewUniversityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
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
                          <UserPlus className="mr-2" size={20} />
                          Create University
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="font-semibold">Universities</h3>
                <button 
                  onClick={loadUniversities}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                >
                  <RefreshCw size={16} className="mr-1" />
                  Refresh
                </button>
              </div>
              
              {isLoadingUniversities ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading universities...</p>
                </div>
              ) : universities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No universities found. Add a university to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country
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
                      {universities.map((university) => (
                        <tr key={university._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{university.name}</div>
                            <div className="text-sm text-gray-500">{university.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 font-mono">{university.address.substring(0, 8)}...{university.address.substring(university.address.length - 6)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{university.country}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                university.isAuthorized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {university.isAuthorized ? 'Authorized' : 'Unauthorized'}
                              </span>
                              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                university.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {university.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {!university.isAuthorized && (
                                <button
                                  onClick={() => handleAuthorizeUniversity(university._id, university.address)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Authorize"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              {university.isActive ? (
                                <button
                                  onClick={() => handleDeactivateUniversity(university._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Deactivate"
                                >
                                  <X size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateUniversity(university._id, { isActive: true })}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Activate"
                                >
                                  <RefreshCw size={18} />
                                </button>
                              )}
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
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

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Authorize University via Blockchain</h2>
            <p className="text-gray-600 mb-6">
              Add a new university to the list of authorized institutions that can issue diplomas directly on the blockchain.
            </p>

            <form onSubmit={handleAuthorize} className="space-y-6">
              <div>
                <label htmlFor="universityAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  University Ethereum Address
                </label>
                <input
                  type="text"
                  id="universityAddress"
                  value={universityAddress}
                  onChange={(e) => setUniversityAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0x..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the Ethereum wallet address of the university to authorize
                </p>
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
                      <UserPlus className="mr-2" size={20} />
                      Authorize University
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Information</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Contract Owner</p>
                  <p className="font-mono text-sm">Only the contract owner can access these administrative functions</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Contract Address</p>
                  <p className="font-mono text-sm break-all">{CONTRACT_ADDRESS}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;