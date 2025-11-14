import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cleansedDataStoreId, setCleansedDataStoreId] = useState(null);
  const fileInputRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

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
    setCleansedDataStoreId(null);

    const formData = new FormData();
    const originalFileName = file.name?.trim() ?? 'uploaded-file.json';
    const sourceUri = `file-upload:${originalFileName}`;
    formData.append('sourceUri', sourceUri);
    formData.append('file', file, originalFileName);

    try {
      clearPolling();
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

  const pollStatus = (id) => {
    clearPolling();
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/cleansed-data-status/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const newStatus = await response.text();
        const normalizedStatus = newStatus.trim();
        setStatus(`Processing status: ${normalizedStatus}`);
        const hasFailed = normalizedStatus.includes('FAILED') || normalizedStatus.includes('ERROR');
        if (normalizedStatus === 'ENRICHMENT_COMPLETED' || hasFailed) {
          clearPolling();
          if (normalizedStatus === 'ENRICHMENT_COMPLETED') {
            setFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
        clearPolling();
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

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
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
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
