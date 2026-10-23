import React from 'react';
import { Mail, MessageSquare, Megaphone, MessageCircleCode } from 'lucide-react';

const CHANNELS = [
  { id: 'Email', label: 'Email', icon: Mail },
  { id: 'Chat / Direct Message', label: 'Chat / Slack / Teams', icon: MessageSquare },
  { id: 'Announcement', label: 'Announcement', icon: Megaphone },
  { id: 'Feedback', label: 'Feedback Review', icon: MessageCircleCode },
];

export default function ChannelSelector({ selectedChannel, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
        <Mail className="w-3.5 h-3.5 text-vibe-purple" />
        Communication Channel
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CHANNELS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedChannel === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-vibe-purple/20 border-vibe-purple text-white shadow-glow-purple font-semibold'
                  : 'bg-vibe-darkCard/70 border-vibe-darkBorder/60 text-vibe-textSecondary hover:text-vibe-textMain hover:border-vibe-darkBorder hover:bg-vibe-darkHover'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-vibe-purple' : 'text-vibe-textSecondary'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
