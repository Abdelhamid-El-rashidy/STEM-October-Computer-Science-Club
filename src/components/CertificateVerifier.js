'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaDownload, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function CertificateVerifier() {
  const [certificateId, setCertificateId] = useState('');
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    if (!/^\d{7}$/.test(certificateId)) {
      setError('Certificate ID must be exactly 7 digits');
      return;
    }

    setState('loading');
    setError('');

    try {
      const response = await axios.get(
        `${API_URL}/certificates/verify/${certificateId.trim().toUpperCase()}`
      );

      if (response.data.verified) {
        setCertificate(response.data.certificate);
        setState('success');
      } else {
        setError(response.data.message || 'Certificate not found');
        setState('error');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify certificate');
      setState('error');
    }
  };

  const handleShare = async () => {
    const text = `I just verified my STEM CS Club Certificate!\nID: ${certificate.certificateId}\nProgram: ${certificate.program}\n\nVerify: ${window.location.origin}?id=${certificate.certificateId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'STEM CSC Certificate',
          text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        alert('Certificate info copied to clipboard!');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const resetForm = () => {
    setCertificateId('');
    setCertificate(null);
    setError('');
    setState('idle');
  };

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && !certificateId) {
      setCertificateId(id);
      // Trigger verification
      setTimeout(() => {
        const form = document.getElementById('verifyForm');
        if (form) form.dispatchEvent(new Event('submit'));
      }, 0);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">Verify Your Certificate</h1>
          <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-400">
            Enter your certificate ID to validate and view your achievement
          </p>
        </motion.div>
      </div>

      {/* States */}
      {state === 'idle' || state === 'error' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mb-8 shadow-xl border border-secondary-200 dark:border-secondary-800"
        >
          <form id="verifyForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Input Group */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300">Certificate ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 7);
                    setCertificateId(value);
                  }}
                  placeholder="YYSSCCC (e.g., 2501001)"
                  maxLength="7"
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 text-lg font-mono"
                  disabled={state === 'loading'}
                />
                <span className="absolute left-4 top-3.5 text-2xl">📋</span>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-lg">
                <strong>Format:</strong> YYSSCCC
                <br />
                <span className="text-primary-600 dark:text-primary-400">YY</span> = Year (25 = 2025) | <span className="text-primary-600 dark:text-primary-400">SS</span> = Program (01 = Online Chapter) | <span className="text-primary-600 dark:text-primary-400">CCC</span> = Serial number
              </p>
            </div>

            {/* Error Message */}
            {error && state === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg flex items-start gap-3"
              >
                <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state === 'loading' ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Verifying...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Verify Certificate
                </>
              )}
            </button>
          </form>
        </motion.div>
      ) : null}

      {/* Loading State */}
      {state === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12 shadow-xl border border-secondary-200 dark:border-secondary-800"
        >
          <div className="animate-spin h-12 w-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full mx-auto mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400 font-medium">Verifying your certificate...</p>
        </motion.div>
      )}

      {/* Error State */}
      {state === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-12 shadow-xl border-2 border-red-200 dark:border-red-800"
        >
          <FaExclamationCircle className="text-5xl text-red-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Certificate Not Found</h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">{error}</p>
          <button onClick={resetForm} className="btn-secondary">
            Try Another
          </button>
        </motion.div>
      )}

      {/* Success State */}
      {state === 'success' && certificate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Certificate Card */}
          <div className="card border-2 border-primary-200 dark:border-primary-800 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="text-6xl mb-4 animate-bounce-slow">⭐</div>
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">Certificate of Achievement</h2>
              </motion.div>

              {/* Body */}
              <div className="space-y-4 border-y border-secondary-200 dark:border-secondary-800 py-8">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-widest">This is to certify that</p>
                <h3 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">{certificate.recipientName}</h3>

                <p className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-widest">has successfully completed</p>
                <p className="text-xl md:text-2xl font-bold text-secondary-700 dark:text-secondary-300">{certificate.program}</p>

                <p className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-widest">awarded on</p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {new Date(certificate.awardDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end pt-4">
                <div className="text-left">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase">Certificate ID</p>
                  <p className="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">{certificate.certificateId}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <FaCheckCircle className="text-2xl" />
                  VERIFIED
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card shadow-xl border border-secondary-200 dark:border-secondary-800">
            <h4 className="text-xl font-bold mb-4 gradient-text">Certificate Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-xs text-secondary-600 dark:text-secondary-400 uppercase">Year</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{certificate.year}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-800/50 dark:to-secondary-900/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <p className="text-xs text-secondary-600 dark:text-secondary-400 uppercase">Program</p>
                <p className="text-lg font-bold text-secondary-700 dark:text-secondary-300">{certificate.program}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-xs text-secondary-600 dark:text-secondary-400 uppercase">Serial Number</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{certificate.serialNumber} / 9999</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-secondary-600 dark:text-secondary-400 uppercase">Status</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">Verified ✓</p>
              </div>
            </div>
          </div>

          {/* Certificate File Preview */}
          {certificate.certificateFileId && (
            <div className="card shadow-xl border border-secondary-200 dark:border-secondary-800">
              <h4 className="text-xl font-bold mb-4 gradient-text">Certificate Document</h4>
              <div className="relative w-full aspect-[8.5/11] bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden">
                <img
                  src={`/api/certificates/file/${certificate.certificateFileId}`}
                  alt="Certificate"
                  className="w-full h-full object-contain"
                />
              </div>
              <a
                href={`/api/certificates/file/${certificate.certificateFileId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 flex items-center justify-center gap-2"
              >
                <FaDownload /> View Full Size
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <FaShare /> Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="btn-primary flex-1"
            >
              Verify Another
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
