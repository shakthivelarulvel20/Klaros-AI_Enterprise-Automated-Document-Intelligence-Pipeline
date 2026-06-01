import { useNavigate, Outlet } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const activeUser = localStorage.getItem('active_klaros_user') || 'Client';

  const handleLogout = () => {
    // Securely wipe the session and kick them to the login screen
    localStorage.removeItem('active_klaros_user');
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-body">

      {/* =======================================
          THE SIDEBAR (Left Panel)
          ======================================= */}
      <div className="w-64 bg-[#0B1120] h-full flex flex-col border-r border-slate-800 shadow-2xl z-20 flex-shrink-0">

        {/* Branding Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <svg className="w-8 h-8 text-blue-500" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z" fill="#3B82F6" />
            <path d="M20 11.7157L34.1421 25.8579L20 40L5.85786 25.8579L20 11.7157Z" fill="#8B5CF6" fillOpacity="0.9" />
          </svg>
          <span className="text-white font-extrabold text-xl tracking-wider font-display">Klaros AI</span>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 p-4 mt-2">
          <div className="px-4 py-3.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Extraction Engine
          </div>
        </div>

        {/* User Session Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mb-4 px-2">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Active User</p>
            <p className="text-sm text-slate-300 truncate font-medium">{activeUser}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            End Session
          </button>
        </div>
      </div>

      {/* =======================================
          MAIN CONTENT AREA (Right Panel)
          ======================================= */}
      <div className="flex-1 h-full overflow-y-auto p-8 relative">
        {/* The <Outlet /> is exactly where the Dashboard gets injected! */}
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;