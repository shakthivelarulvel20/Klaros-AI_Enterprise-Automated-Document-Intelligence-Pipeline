const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
    <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-md w-full"></div></td>
    <td className="px-6 py-5"><div className="space-y-2"><div className="h-3 bg-slate-200 rounded w-1/2"></div><div className="h-3 bg-slate-100 rounded w-full"></div></div></td>
  </tr>
);

const ExtractionTable = ({ documents, isUploading }) => {
  const renderExtractedData = (doc) => {
    if (doc.status === 'DUPLICATE') {
      try {
        const parsed = typeof doc.extractedData === 'string' ? JSON.parse(doc.extractedData) : doc.extractedData;
        return <span className="italic text-yellow-600 font-medium font-sans">{parsed.message || "Duplicate file"}</span>;
      } catch (e) {
        return <span className="italic text-yellow-600 font-medium font-sans">Data is identical to an existing file.</span>;
      }
    }
    
    try {
      const data = typeof doc.extractedData === 'string' ? JSON.parse(doc.extractedData) : doc.extractedData;
      return (
        <div className="grid grid-cols-2 gap-2 w-full max-w-2xl">
          {Object.entries(data).map(([key, value]) => {
            if (value === null || value === '' || value === undefined) return null;
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const stringValue = String(value);
            const isLongText = stringValue.length > 50;
            return (
              <div key={key} className={`bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 flex flex-col justify-center hover:bg-blue-50 transition-colors ${isLongText ? 'col-span-2' : 'col-span-1'}`}>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">{formattedKey}</span>
                <span className={`text-sm font-medium text-gray-800 ${isLongText ? 'text-xs leading-relaxed text-gray-600' : 'truncate'}`} title={stringValue}>{stringValue}</span>
              </div>
            );
          })}
        </div>
      );
    } catch (e) {
      return <span className="text-red-500 text-xs">Error parsing AI output</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-center">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Extracted Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isUploading ? (
            <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
          ) : documents.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p>Workspace is empty. Upload documents to generate intelligence.</p>
                </div>
              </td>
            </tr>
          ) : (
            documents.map((doc, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 font-medium text-slate-700">{doc.fileName}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide flex items-center justify-center w-full ${
                    doc.status === 'PROCESSED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                    doc.status === 'DUPLICATE' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    doc.status === 'FAILED' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">{renderExtractedData(doc)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExtractionTable;