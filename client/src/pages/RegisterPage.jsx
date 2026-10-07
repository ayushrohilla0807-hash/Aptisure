import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User, Mail, Lock, UserPlus, RefreshCw } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('Aptisure');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    avatarSeed
  )}`;

  const handleRandomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        avatar: avatarUrl,
      });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-stitch">
          <MessageSquare size={26} />
        </div>
        <h2 className="mt-3.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Create a new account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Join the Aptisure real-time messaging network
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
            {/* Avatar Selector Preview */}
            <div className="flex flex-col items-center justify-center pb-2">
              <div className="relative">
                <Avatar
                  src={avatarUrl}
                  name={username || 'User'}
                  size="xl"
                  className="shadow-stitch"
                />
                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  className="absolute bottom-0 right-0 p-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 shadow-stitch-sm transition-transform active:scale-90"
                  title="Randomize Avatar"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5">
                Click refresh to change avatar
              </span>
            </div>

            <Input
              label="Username"
              id="username"
              placeholder="e.g. alex_coder"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (avatarSeed === 'Aptisure' || !avatarSeed) {
                  setAvatarSeed(e.target.value || 'Aptisure');
                }
              }}
              icon={User}
              required
              autoFocus
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="alex@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password (min. 6 characters)"
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
              <UserPlus size={16} />
              <span>Create Account</span>
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
