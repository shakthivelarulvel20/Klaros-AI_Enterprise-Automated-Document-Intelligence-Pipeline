import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-12');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-target');
        elements.forEach((el) => observerRef.current.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <>
            <style>{`
        /* Importing Ultra-Modern Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@500;600;700;800&display=swap');
        
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        
        @keyframes scanline {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 110%; opacity: 0; }
        }
        
        .scanner-laser {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(14, 165, 233, 0.6); /* Sky blue accent for light mode */
          box-shadow: 0 0 20px 6px rgba(14, 165, 233, 0.2);
          animation: scanline 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 1;
        }

        /* Light Mode Glass Hover Effects */
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(226, 232, 240, 0.8); /* slate-200 */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(14, 165, 233, 0.4);
            transform: translateY(-5px);
            box-shadow: 0 20px 40px -10px rgba(14, 165, 233, 0.15);
        }
      `}</style>

            <div className="font-body bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-200">

                {/* =========================================
            SECTION 1: THE HERO
            ========================================= */}
                <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">

                    <video
                        autoPlay loop muted playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-multiply filter grayscale"
                    >
                        {/* Using a clean, abstract wave video */}
                        <source src="https://cdn.pixabay.com/video/2021/05/13/74026-550096181_large.mp4" type="video/mp4" />
                    </video>

                    {/* Light gradient overlay to ensure text pops */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-slate-50 z-0"></div>

                    <div className="scanner-laser"></div>

                    <nav className="absolute top-0 w-full z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-200 reveal-target opacity-0 translate-y-12 transition-all duration-1000">
                        <div className="flex items-center group cursor-pointer">
                            <svg className="w-9 h-9 mr-3 transform group-hover:rotate-90 transition-transform duration-700" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z" fill="url(#paint0_linear)"/>
                                <path d="M20 11.7157L34.1421 25.8579L20 40L5.85786 25.8579L20 11.7157Z" fill="url(#paint1_linear)" fillOpacity="0.9"/>
                                <defs>
                                    <linearGradient id="paint0_linear" x1="20" y1="0" x2="20" y2="28.2843" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0284C7"/> {/* Deep Sky Blue */}
                                        <stop offset="1" stopColor="#4338CA"/> {/* Indigo */}
                                    </linearGradient>
                                    <linearGradient id="paint1_linear" x1="20" y1="11.7157" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#7C3AED"/> {/* Violet */}
                                        <stop offset="1" stopColor="#0284C7"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="font-display text-slate-900 font-extrabold text-2xl tracking-wider">Klaros AI</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/auth" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Login</Link>
                            <Link to="/auth" className="px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-800 font-bold rounded-full shadow-sm hover:shadow transition-all duration-300">
                                Enter Workspace
                            </Link>
                        </div>
                    </nav>

                    <div className="relative z-10 text-center max-w-5xl px-6 mt-10 reveal-target opacity-0 translate-y-12 transition-all duration-1000 delay-200">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Enterprise Intelligence Engine
                        </div>

                        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
                            Turn Unstructured Chaos <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Into Structured Intelligence.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            Process PDFs, Word documents, and spreadsheets into export-ready business data instantly. Unlock the hidden value in your corporate documents with zero manual entry.
                        </p>

                        <Link to="/auth" className="group relative inline-flex items-center justify-center px-9 py-4 font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-blue-700 overflow-hidden shadow-xl hover:shadow-blue-500/30">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Extracting Now
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </span>
                        </Link>
                    </div>

                    <div className="absolute bottom-10 z-10 animate-bounce reveal-target opacity-0 translate-y-12 transition-all duration-1000 delay-500">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                </div>

                {/* =========================================
            SECTION 2: BUSINESS LOGIC & SCOPE
            ========================================= */}
                <div className="relative z-10 bg-slate-50 py-32 px-6 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-24 reveal-target opacity-0 translate-y-12 transition-all duration-1000">
                            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Why Klaros AI?</h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">An enterprise pipeline built for managers who require immaculate financial data without the operational friction.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Feature 1 */}
                            <div className="glass-card p-10 rounded-3xl group reveal-target opacity-0 translate-y-12 duration-1000 delay-100">
                                <div className="w-16 h-16 mb-8 text-blue-600 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                        <polyline points="2 17 12 22 22 17" />
                                        <polyline points="2 12 12 17 22 12" />
                                    </svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-4 text-slate-900">Omni-Channel Ingestion</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                                    Klaros AI features a unified pipeline capable of reading native PDFs, Word Documents, Excel Spreadsheets, and plain text simultaneously, routing them automatically to the correct extraction engine.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="glass-card p-10 rounded-3xl group reveal-target opacity-0 translate-y-12 duration-1000 delay-200">
                                <div className="w-16 h-16 mb-8 text-purple-600 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-4 text-slate-900">Instant Business Value</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                                    Fulfill client needs with pure efficiency. Upload a batch of 100 invoices, and within seconds, download a formatted CSV containing Total Amounts, GSTs, and Vendor details ready for accounting.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="glass-card p-10 rounded-3xl group reveal-target opacity-0 translate-y-12 duration-1000 delay-300">
                                <div className="w-16 h-16 mb-8 text-indigo-600 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        <circle cx="12" cy="16" r="1" />
                                    </svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-4 text-slate-900">Smart Cryptographic Hashing</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                                    Running AI is expensive. Our distinct advantage is a proprietary SHA-256 hashing layer that mathematically prevents identical documents from being processed twice, drastically reducing compute costs.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="glass-card p-10 rounded-3xl group reveal-target opacity-0 translate-y-12 duration-1000 delay-400">
                                <div className="w-16 h-16 mb-8 text-emerald-600 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                        <path d="M2 12h20" />
                                    </svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-4 text-slate-900">Template-Free AI</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                                    Legacy OCR software requires manual bounding boxes. Klaros AI uses Large Language Models to conceptually "understand" documents, extracting data perfectly regardless of visual layout changes.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <footer className="bg-slate-50 py-10 border-t border-slate-200 text-center reveal-target opacity-0 translate-y-12 transition-all duration-1000">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <p className="text-slate-800 font-bold text-sm tracking-widest uppercase">Klaros AI System</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    </div>
                    <p className="text-slate-500 font-medium text-xs">Engineered for Enterprise Data Integrity.</p>
                </footer>
            </div>
        </>
    );
};

export default LandingPage;