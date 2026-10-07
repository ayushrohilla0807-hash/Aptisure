import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-stitch">
          <MessageSquare size={26} />
        </div>
        <h2 className="mt-3.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Real-time academic communication platform
        </p>
      </div>

      <div className="mt-5 sm:mt-6 sm:mx-auto sm:w-full sm:max-w-md w-full">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 rounded-2xl sm:rounded-3xl shadow-stitch-lg border border-slate-100">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              autoFocus
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </Button>
          </form>

          {/* Quick Demo Login Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              ⚡ Quick Demo Login (Pre-Loaded Sample Data)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('alex@aptisure.edu');
                  setPassword('password123');
                }}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/70 hover:border-brand-200 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800">Alex Rivers</div>
                <div className="text-[10px] text-slate-500">Full-Stack Dev</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('bella@aptisure.edu');
                  setPassword('password123');
                }}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/70 hover:border-brand-200 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800">Bella Chen</div>
                <div className="text-[10px] text-slate-500">UI/UX Designer</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('carlos@aptisure.edu');
                  setPassword('password123');
                }}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/70 hover:border-brand-200 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800">Carlos Mendoza</div>
                <div className="text-[10px] text-slate-500">Cloud Architect</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('diana@aptisure.edu');
                  setPassword('password123');
                }}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/70 hover:border-brand-200 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800">Diana Prince</div>
                <div className="text-[10px] text-slate-500">Data Science</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
