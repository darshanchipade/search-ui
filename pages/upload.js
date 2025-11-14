import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cleansedDataStoreId, setCleansedDataStoreId] = useState(null);
  const fileInputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    setStatus('Uploading file...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-cleanse-enrich-and-store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setCleansedDataStoreId(data.cleansedDataStoreId);
      setStatus(`File uploaded successfully. Status: ${data.status}`);
      pollStatus(data.cleansedDataStoreId);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setStatus('Failed to upload file.');
    } finally {
      setIsLoading(false);
    }
  };

  const pollStatus = async (id) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/cleansed-data-status/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const newStatusRaw = await response.text();
        const newStatus = newStatusRaw.trim();
        setStatus(`Processing status: ${newStatus}`);
        if (
          newStatus === 'ENRICHMENT_COMPLETED' ||
          newStatus.includes('FAILED') ||
          newStatus.includes('ERROR') ||
          newStatus === 'NOT_FOUND'
        ) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setFile(null);
          setCleansedDataStoreId(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    }, 2000);
  };

  return (
    <div>
      <Head>
        <title>Upload JSON File</title>
        <meta name="description" content="Upload a JSON file for processing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-start pt-10 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="flex justify-end mb-4">
            <Link href="/" className="text-blue-600 hover:underline">Back to Search</Link>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">Upload JSON File</h1>
            <div className="flex items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded-lg p-2 mr-4"
                />
              <button onClick={handleUpload} disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {status && <p className="mt-4">{status}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
