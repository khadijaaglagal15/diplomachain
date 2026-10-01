import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, FileCheck, Shield } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-indigo-900 mb-6">Secure Diploma Verification on Blockchain</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          DiploChain provides a secure, transparent, and tamper-proof system for issuing and verifying academic credentials using blockchain technology.
        </p>
        <div className="mt-10 flex justify-center space-x-6">
          <Link to="/issue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Issue Diploma
          </Link>
          <Link to="/verify" className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Verify Diploma
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FileCheck size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Issue Credentials</h3>
          <p className="text-gray-600">
            Universities can issue digital diplomas that are securely stored on the blockchain and IPFS, ensuring their authenticity and immutability.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Verify Instantly</h3>
          <p className="text-gray-600">
            Employers and institutions can instantly verify the authenticity of academic credentials without relying on third-party verification services.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Tamper-Proof</h3>
          <p className="text-gray-600">
            Once issued, diplomas cannot be altered or forged, providing a secure and reliable system for academic credential verification.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md p-10">
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">University Issues Diploma</h3>
            <p className="text-center text-gray-600">
              Authorized universities upload diploma details and documents to IPFS and register them on the blockchain.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Student Receives Hash</h3>
            <p className="text-center text-gray-600">
              Students receive a unique diploma hash that serves as proof of their academic credentials.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Employers Verify</h3>
            <p className="text-center text-gray-600">
              Employers can verify the authenticity of diplomas by checking the hash against the blockchain record.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-indigo-800 text-white rounded-xl shadow-md p-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to revolutionize credential verification?</h2>
          <p className="text-xl mb-8">
            Join universities worldwide in adopting blockchain technology for secure and transparent credential management.
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/issue" className="bg-white text-indigo-800 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Get Started
            </Link>
            <a href="#" className="border border-white hover:bg-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;