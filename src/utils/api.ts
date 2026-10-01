const API_BASE_URL = 'http://localhost:5000/api';

// University API calls
export const fetchUniversities = async () => {
  const response = await fetch(`${API_BASE_URL}/universities`);
  if (!response.ok) {
    throw new Error('Failed to fetch universities');
  }
  return await response.json();
};

export const fetchUniversityByAddress = async (address: string) => {
  const response = await fetch(`${API_BASE_URL}/universities/address/${address}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch university');
  }
  return await response.json();
};

export const createUniversity = async (universityData: any) => {
  const response = await fetch(`${API_BASE_URL}/universities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(universityData),
  });
  if (!response.ok) {
    throw new Error('Failed to create university');
  }
  return await response.json();
};

export const updateUniversity = async (id: string, universityData: any) => {
  const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(universityData),
  });
  if (!response.ok) {
    throw new Error('Failed to update university');
  }
  return await response.json();
};

export const authorizeUniversityAPI = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/universities/authorize/${id}`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    throw new Error('Failed to authorize university');
  }
  return await response.json();
};

export const deactivateUniversity = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/universities/deactivate/${id}`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate university');
  }
  return await response.json();
};

// Diploma API calls
export const fetchDiplomas = async () => {
  const response = await fetch(`${API_BASE_URL}/diplomas`);
  if (!response.ok) {
    throw new Error('Failed to fetch diplomas');
  }
  return await response.json();
};

export const fetchDiplomaByHash = async (hash: string) => {
  const response = await fetch(`${API_BASE_URL}/diplomas/hash/${hash}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch diploma');
  }
  return await response.json();
};

export const fetchDiplomasByUniversity = async (address: string) => {
  const response = await fetch(`${API_BASE_URL}/diplomas/university/${address}`);
  if (!response.ok) {
    throw new Error('Failed to fetch diplomas');
  }
  return await response.json();
};

export const createDiploma = async (diplomaData: any) => {
  const response = await fetch(`${API_BASE_URL}/diplomas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(diplomaData),
  });
  if (!response.ok) {
    throw new Error('Failed to create diploma record');
  }
  return await response.json();
};

export const revokeDiplomaAPI = async (hash: string, reason: string) => {
  const response = await fetch(`${API_BASE_URL}/diplomas/revoke/${hash}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    throw new Error('Failed to revoke diploma');
  }
  return await response.json();
};