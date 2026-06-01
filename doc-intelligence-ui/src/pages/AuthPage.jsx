import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Feedback State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Fetch our "Mock Database" from the browser's Local Storage
    const existingUsers = JSON.parse(localStorage.getItem('klaros_users')) || [];

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const user = existingUsers.find(u => u.email === email);

      if (!user) {
        setError("Account not found. Please create an account first.");
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }
      // Save the currently active user session
      localStorage.setItem('active_klaros_user', email);
      // Success! Route to the application
      navigate('/dashboard');

    } else {
      // --- SIGN UP LOGIC ---
      const userExists = existingUsers.some(u => u.email === email);

      if (userExists) {
        setError("An account with this email already exists.");
        return;
      }

      // Save the new user to our "Mock Database"
      const newUser = { name, email, password };
      localStorage.setItem('klaros_users', JSON.stringify([...existingUsers, newUser]));

      // Reset form and flip back to login mode
      setSuccess("Account created successfully! Please sign in.");
      setIsLogin(true);
      setPassword('');
    }
  };

  return (
    <>
      <style>{`
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="font-body min-h-screen bg-slate-50 flex items-center justify-center relative p-4 selection:bg-blue-200">

        {/* Background Decorative Blur */}
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Top Left Branding */}
        <Link to="/" className="absolute top-8 left-8 flex items-center group cursor-pointer z-20">
          <svg className="w-8 h-8 mr-3 transform group-hover:rotate-90 transition-transform duration-700" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z" fill="#0284C7" />
            <path d="M20 11.7157L34.1421 25.8579L20 40L5.85786 25.8579L20 11.7157Z" fill="#7C3AED" fillOpacity="0.9" />
          </svg>
          <span className="font-display text-slate-900 font-extrabold text-xl tracking-wider">Klaros AI</span>
        </Link>

        {/* The Auth Card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-10 z-10">

          <h2 className="font-display text-3xl font-extrabold text-slate-900 text-center mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-slate-500 text-center mb-8 font-medium text-sm">
            {isLogin ? 'Enter your credentials to access your workspace.' : 'Deploy your enterprise document pipeline today.'}
          </p>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-semibold rounded-lg text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5" autoComplete="off">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all font-medium"
                  placeholder="Your Name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email" required
                autoComplete="off"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password" required
                autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all font-medium"
                placeholder="•••••••••••••"
              />
            </div>

            <button type="submit" className="w-full py-3.5 px-4 bg-slate-900 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 mt-4">
              {isLogin ? 'Sign In to Workspace' : 'Initialize Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;