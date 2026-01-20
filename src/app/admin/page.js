'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    revoked: 0,
    thisMonth: 0
  });

  // New certificate form
  const [newCert, setNewCert] = useState({
    certificateId: '',
    recipientName: '',
    program: '',
    programCategory: '01',
    awardDate: new Date().toISOString().split('T')[0],
    certificateFile: null
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Failed to connect to server');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/certificates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
        setStats(data.stats || {
          total: 0,
          verified: 0,
          revoked: 0,
          thisMonth: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleCreateCertificate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('certificateId', newCert.certificateId);
      formData.append('recipientName', newCert.recipientName);
      formData.append('program', newCert.program);
      formData.append('programCategory', newCert.programCategory);
      formData.append('awardDate', newCert.awardDate);
      
      if (newCert.certificateFile) {
        formData.append('certificateFile', newCert.certificateFile);
      }

      const response = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Certificate created successfully!');
        setNewCert({
          certificateId: '',
          recipientName: '',
          program: '',
          programCategory: '01',
          awardDate: new Date().toISOString().split('T')[0],
          certificateFile: null
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create certificate');
      }
    } catch (error) {
      alert('Failed to connect to server');
    }
  };

  const handleRevokeCertificate = async (id) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/certificates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'revoke', reason: 'Revoked by admin' })
      });

      if (response.ok) {
        alert('Certificate revoked successfully');
        fetchDashboardData();
      } else {
        alert('Failed to revoke certificate');
      }
    } catch (error) {
      alert('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCertificates([]);
    setStats({ total: 0, verified: 0, revoked: 0, thisMonth: 0 });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card w-full max-w-md shadow-2xl border border-secondary-200 dark:border-secondary-800"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Login</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 text-red-600 dark:text-red-400 flex items-start gap-3"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{loginError}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login to Dashboard
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24 bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Manage certificates and view analytics</p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card shadow-lg border border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-1">Total Certificates</p>
                <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.total}</h3>
              </div>
              <svg className="w-12 h-12 text-primary-600 dark:text-primary-400 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card shadow-lg border border-secondary-200 dark:border-secondary-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-1">This Month</p>
                <h3 className="text-3xl font-bold text-secondary-700 dark:text-secondary-300">{stats.thisMonth}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card shadow-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-1">Verified</p>
                <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.verified}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card shadow-lg border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-1">Revoked</p>
                <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.revoked}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="card mb-12 shadow-xl border border-secondary-200 dark:border-secondary-800">
          <div className="flex space-x-4 border-b-2 border-primary-200 dark:border-primary-800 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 -mb-0.5'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Overview
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 -mb-0.5'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Create Certificate
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 gradient-text">All Certificates</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary-200 dark:border-primary-800">
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">ID</th>
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">Recipient</th>
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">Program</th>
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">Date</th>
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">Status</th>
                      <th className="text-left py-3 px-4 text-[var(--text-color)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="border-b border-[var(--main-color)] border-opacity-10">
                        <td className="py-3 px-4 font-mono text-[var(--accent-color)]">{cert.certificateId}</td>
                        <td className="py-3 px-4">{cert.recipientName}</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">{cert.program}</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)]">
                          {new Date(cert.awardDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {cert.isRevoked ? (
                            <span className="px-3 py-1 bg-red-500 bg-opacity-20 border border-red-500 rounded-full text-red-400 text-sm">
                              Revoked
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500 bg-opacity-20 border border-green-500 rounded-full text-green-400 text-sm">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {!cert.isRevoked && (
                            <button
                              onClick={() => handleRevokeCertificate(cert._id)}
                              className="px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-400 hover:bg-opacity-30 transition text-sm"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[var(--main-color)]">Create New Certificate</h2>
              <form onSubmit={handleCreateCertificate} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-color)]">
                      Certificate ID (7 digits)
                    </label>
                    <input
                      type="text"
                      value={newCert.certificateId}
                      onChange={(e) => setNewCert({ ...newCert, certificateId: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 2501001"
                      pattern="[0-9]{7}"
                      required
                    />
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Format: YYSSCCC</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-color)]">
                      Award Date
                    </label>
                    <input
                      type="date"
                      value={newCert.awardDate}
                      onChange={(e) => setNewCert({ ...newCert, awardDate: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-color)]">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={newCert.recipientName}
                    onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">
                    Program
                  </label>
                  <select
                    value={newCert.program}
                    onChange={(e) => setNewCert({ ...newCert, program: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100"
                    required
                  >
                    <option value="">Select a program</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                    <option value="Programming Fundamentals">Programming Fundamentals</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">
                    Program Category
                  </label>
                  <select
                    value={newCert.programCategory}
                    onChange={(e) => setNewCert({ ...newCert, programCategory: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100"
                    required
                  >
                    <option value="00">Main Club (00)</option>
                    <option value="01">Online Chapter (01)</option>
                    <option value="02">Bootcamp (02)</option>
                    <option value="03">Advanced (03)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">
                    Certificate File (Image/PDF)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setNewCert({ ...newCert, certificateFile: e.target.files[0] })}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 dark:file:bg-primary-900 file:text-primary-600 dark:file:text-primary-400 file:cursor-pointer hover:file:bg-primary-100 dark:hover:file:bg-primary-800"
                    required
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Upload the certificate image or PDF (will be stored securely)</p>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bt"
                >
                  <iconify-icon icon="mdi:certificate-outline" className="text-xl mr-2"></iconify-icon>
                  Create Certificate
                </motion.button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
