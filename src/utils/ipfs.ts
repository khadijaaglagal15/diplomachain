const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const GATEWAY = 'https://gateway.pinata.cloud/ipfs';

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.IpfsHash; // CID
  } catch (error) {
    console.error("Erreur lors de l'upload vers IPFS :", error);
    throw new Error("Échec de l'upload vers IPFS");
  }
};

export const getFromIPFS = async (ipfsHash: string): Promise<Blob> => {
  try {
    const res = await fetch(`${GATEWAY}/${ipfsHash}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.blob();
  } catch (error) {
    console.error('Erreur lors de la récupération depuis IPFS :', error);
    throw new Error('Échec de la récupération depuis IPFS');
  }
};