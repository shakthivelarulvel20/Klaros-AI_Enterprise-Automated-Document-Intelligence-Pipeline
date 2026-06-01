import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExtractionTable from '../components/ExtractionTable';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Session State (starts at 0 on refresh)
  const [sessionStats, setSessionStats] = useState({
    totalUploaded: 0,
    aiProcessed: 0,
    duplicatesSaved: 0,
    totalValue: 0
  });

  // --- SECURITY: Kick user out if they bypass the login page ---
  useEffect(() => {
    const activeUser = localStorage.getItem('active_klaros_user');
    if (!activeUser) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleUpload = async (event) => {
    event.preventDefault();
    
    // Bulletproof length check
    if (!selectedFiles || selectedFiles?.length === 0) return;

    // Grab the active user for multi-tenant isolation
    const activeUserEmail = localStorage.getItem('active_klaros_user');
    if (!activeUserEmail) {
      navigate('/auth');
      return;
    }

    setIsUploading(true);
    setDocuments([]); 
    
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('file', selectedFiles[i]);
    }
    // STAMP THE OWNER: Tell the backend who owns these files
    formData.append('userEmail', activeUserEmail); 

    try {
      const response = await fetch('http://localhost:8080/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newlyProcessedDocs = await response.json();
        
        setDocuments(newlyProcessedDocs); 
        
        let batchProcessed = 0;
        let batchDuplicates = 0;
        let batchValue = 0;

        newlyProcessedDocs.forEach(doc => {
          if (doc.status === 'PROCESSED') {
            batchProcessed += 1;
            if (doc.extractedData) {
              const data = typeof doc.extractedData === 'string' ? JSON.parse(doc.extractedData) : doc.extractedData;
              batchValue += parseFloat(data.totalAmount || data.TotalAmount) || 0;
            }
          } else if (doc.status === 'DUPLICATE') {
            batchDuplicates += 1;
          }
        });

        setSessionStats(prev => ({
          totalUploaded: prev.totalUploaded + newlyProcessedDocs.length,
          aiProcessed: prev.aiProcessed + batchProcessed,
          duplicatesSaved: prev.duplicatesSaved + batchDuplicates,
          totalValue: prev.totalValue + batchValue
        }));

        setSelectedFiles(null);
        document.getElementById('file-upload').value = '';
        
      } else {
        // --- NEW: Loudly announce if the server returns an error ---
        const errorText = await response.text();
        alert(`Server Error ${response.status}: Failed to extract. Check backend console.`);
        console.error("Backend returned:", errorText);
      }
    } catch (error) {
      // --- NEW: Alert if Spring Boot is completely offline ---
      console.error('Upload error:', error);
      alert("Network Error: Could not connect to the Spring Boot server.");
    } finally {
      setIsUploading(false);
    }
  };

  const exportToCSV = () => {
    if (!documents || documents?.length === 0) return;
    const allKeys = new Set();
    documents.forEach(doc => {
      if (doc.status === 'PROCESSED' && doc.extractedData) {
        const data = typeof doc.extractedData === 'string' ? JSON.parse(doc.extractedData) : doc.extractedData;
        Object.keys(data).forEach(key => allKeys.add(key));
      }
    });

    const headers = ['File Name', 'Status', ...Array.from(allKeys)];
    const csvRows = documents.map(doc => {
      let data = {};
      if (doc.status === 'PROCESSED' && doc.extractedData) {
        data = typeof doc.extractedData === 'string' ? JSON.parse(doc.extractedData) : doc.extractedData;
      } else if (doc.status === 'DUPLICATE') {
        data = { "Notes": "Duplicate of an existing file" };
      }
      const rowData = headers.map(header => {
        if (header === 'File Name') return `"${doc.fileName}"`;
        if (header === 'Status') return `"${doc.status}"`;
        const val = data[header];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return rowData.join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'KlarosAI_Session_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Intelligence Pipeline</h1>
        <p className="text-gray-500 mt-1">Active Session Dashboard</p>
      </header>

      {/* --- SESSION KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Session Uploads</p>
            <p className="text-2xl font-bold text-gray-900">{sessionStats.totalUploaded}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">AI Processed</p>
            <p className="text-2xl font-bold text-gray-900">{sessionStats.aiProcessed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duplicates Saved</p>
            <p className="text-2xl font-bold text-gray-900">{sessionStats.duplicatesSaved}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Value Extracted</p>
            <p className="text-2xl font-bold text-gray-900">₹{sessionStats.totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Documents</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-4">
          <input 
            id="file-upload"
            type="file" multiple accept=".pdf, .doc, .docx, .xls, .xlsx, .txt, .csv"
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer transition-colors"
          />
          <button 
            type="submit" disabled={!selectedFiles || selectedFiles?.length === 0 || isUploading}
            className={`px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 flex items-center gap-2 whitespace-nowrap
              ${(!selectedFiles || selectedFiles?.length === 0 || isUploading) ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 transform'}`}
          >
            {isUploading && <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>}
            {isUploading ? 'Engine Running...' : 'Extract Data'}
          </button>
        </form>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-gray-800">Extraction Results</h2>
        <button 
          onClick={exportToCSV} disabled={!documents || documents?.length === 0 || isUploading}
          className={`px-4 py-2 flex items-center gap-2 rounded-md font-semibold transition-all shadow-sm
            ${(!documents || documents?.length === 0 || isUploading) ? 'bg-white text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-white text-green-700 hover:bg-green-50 border border-green-200 hover:border-green-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          Export CSV
        </button>
      </div>

      <ExtractionTable documents={documents} isUploading={isUploading} />
    </>
  );
};

export default Dashboard;