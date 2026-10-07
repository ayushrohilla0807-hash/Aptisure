import React from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { Mail, Calendar, Info, Circle } from 'lucide-react';
import { formatDateDivider } from '../../utils/helpers';

export const ProfileModal = ({ isOpen, onClose, user, isOnline }) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        {/* Large Avatar */}
        <div className="relative">
          <Avatar
            src={user.avatar}
            name={user.username}
            size="xl"
            showStatus={true}
            isOnline={isOnline}
          />
        </div>

        {/* Name and Online Badge */}
        <div>
          <h3 className="text-lg font-bold text-slate-900">{user.username}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-medium text-slate-500">
              {isOnline ? 'Active Now' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Info size={14} />
              <span>About</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Email & Details */}
        <div className="w-full space-y-2 text-left">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <Mail size={16} className="text-slate-400" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">Email Address</p>
              <p className="text-xs font-medium text-slate-800 truncate">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <Calendar size={16} className="text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Joined</p>
                <p className="text-xs font-medium text-slate-800">
                  {formatDateDivider(user.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
