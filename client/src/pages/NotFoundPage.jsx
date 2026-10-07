import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareOff, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-stitch-sm">
        <MessageSquareOff size={32} />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The page or chat room you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">
          <Home size={16} />
          <span>Back to Messages</span>
        </Button>
      </Link>
    </div>
  );
};
