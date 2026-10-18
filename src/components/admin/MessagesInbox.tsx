import React, { useState } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Reply, AlertCircle, RefreshCw } from 'lucide-react';
import type { ClientInquiry } from '../../types/portfolio.ts';

interface MessagesInboxProps {
  messages: ClientInquiry[];
  authToken: string;
  onRefresh: () => void;
}

export const MessagesInbox: React.FC<MessagesInboxProps> = ({
  messages,
  authToken,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [selectedMsg, setSelectedMsg] = useState<ClientInquiry | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const updateStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    setLoadingAction(true);
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });
      onRefresh();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, status });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setLoadingAction(true);
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      onRefresh();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Client Inquiries & Project Leads ({messages.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real contact submissions sent by prospective clients and animation studios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filters */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filter === 'unread' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({messages.filter((m) => m.status === 'unread').length})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filter === 'replied' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Replied ({messages.filter((m) => m.status === 'replied').length})
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            title="Refresh messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Grid / Split View */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Mail className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No messages in this folder</h4>
          <p className="text-xs text-slate-500">
            Client inquiries submitted on the contact form will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (msg.status === 'unread') {
                      updateStatus(msg.id, 'read');
                    }
                  }}
                  className={`p-4 rounded-xl cursor-pointer border transition-all text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {msg.projectType}
                    </span>
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                    {msg.status === 'replied' && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Replied
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-7">
            {selectedMsg ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedMsg.name}</h4>
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      {selectedMsg.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(selectedMsg.id, selectedMsg.status === 'replied' ? 'read' : 'replied')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selectedMsg.status === 'replied'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {selectedMsg.status === 'replied' ? 'Mark Unreplied' : 'Mark as Replied'}
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Project Scope:</span>
                    <span className="text-slate-200 font-semibold">{selectedMsg.projectType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Budget Range:</span>
                    <span className="text-slate-200 font-semibold">{selectedMsg.budgetRange || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date Received:</span>
                    <span className="text-slate-300 font-mono">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status:</span>
                    <span className="text-cyan-400 font-mono capitalize">{selectedMsg.status}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Message Content:
                  </span>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedMsg.message}
                  </div>
                </div>

                {/* Quick Reply Button */}
                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: 2D Animation Project Inquiry&body=Hi ${selectedMsg.name},%0D%0A%0D%0AThank you for reaching out regarding your ${selectedMsg.projectType} project.%0D%0A%0D%0ABest regards,%0D%0AShoyen Kaiser Asif%0D%0A2D Animator | Cartoon Designer`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Open Email Reply (to {selectedMsg.email})</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-500 text-xs">
                Select an inquiry from the left to view the client's project description and reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
