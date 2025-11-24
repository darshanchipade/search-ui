import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // This function is triggered when the user clicks our custom textbox
  const handleCustomInputClick = () => {
    // Programmatically click the real, hidden file input
    fileInputRef.current.click();
  };

  // This function is triggered when a file is selected
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(''); // Clear any previous status messages
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload first.');
      return;
    }

    setIsLoading(true);
    setStatus(`Uploading file: ${file.name}`);

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
      setStatus(`File uploaded successfully. Status: ${data.status}`);
      pollStatus(data.cleansedDataStoreId);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setStatus(`Failed to upload file: ${file.name}`);
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
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const newStatus = (await response.text()).trim();
        setStatus(`Processing status: ${newStatus}`);

        const isTerminalStatus =
          newStatus.includes('ENRICHED') ||
          newStatus.includes('FAILED') ||
          newStatus.includes('ERROR') ||
          newStatus === 'NOT_FOUND';

        if (isTerminalStatus) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setIsLoading(false);
          setFile(null); // Reset the file state
          // Reset the file input so the same file can be chosen again
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        setIsLoading(false);
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

            <div className="flex items-center w-full max-w-lg">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
              />

              {/* Custom styled "textbox" area */}
              <div
                onClick={handleCustomInputClick}
                className="flex-grow p-2 border border-gray-300 rounded-l-lg cursor-pointer bg-white text-gray-500 truncate"
              >
                {file ? file.name : 'Please upload the file'}
              </div>

              {/* The Upload button with the correct border and negative margin */}
              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="ml-2 -ml-px bg-blue-600 text-white font-bold py-2 px-4 rounded-lg border border-blue-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Upload'}
              </button>
            </div>

            {status && <p className="mt-4 text-gray-700">{status}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}