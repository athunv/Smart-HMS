import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginApi } from '../../apis/AllApi';

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    if (!loginData.username || !loginData.password) {
      setError('Please fill in all required credentials.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await LoginApi(loginData);

      // If axios
      const data = response.data;

      console.log('Login Success:', data);

      sessionStorage.setItem('access', data.access);
      sessionStorage.setItem('refresh', data.refresh);
      sessionStorage.setItem('role', data.role);


if (data.is_superuser) {
  navigate("/admin-dashboard");
  return;
}

      switch (data.role) {
        case 'doctor':
          navigate('/doctor-dashboard');
          break;

        case 'patient':
          navigate('/patient-dashboard');
          break;

        case 'staff':
          navigate('/staff-dashboard');
          break;

        case 'pharmacist':
          navigate('/pharmacy-dashboard');
          break;

        case 'lab':
          navigate('/lab-dashboard');
          break;

        default:
          navigate('/');
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 antialiased font-sans">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

        <div className="h-1.5 w-full bg-[#8ac857]" />

        <div className="p-6 sm:p-8 space-y-6">

          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Sign in to Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your secure credentials below.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
              >
                Username
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={loginData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter username"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-900 disabled:opacity-60 focus:bg-white focus:border-[#8ac857] focus:ring-1 focus:ring-[#8ac857]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-900 disabled:opacity-60 focus:bg-white focus:border-[#8ac857] focus:ring-1 focus:ring-[#8ac857]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#8ac857] hover:bg-[#76b044] text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-400 tracking-wide text-center">
        Protected by industry-standard end-to-end encryption.
      </p>
    </div>
  );
}