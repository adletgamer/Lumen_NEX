"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreVertical, 
  Bot, 
  User,
  Filter,
  CheckCheck
} from "lucide-react";
import { useState } from "react";

const CHATS = [
  {
    id: 1,
    name: "Alex Rivera",
    lastMessage: "The quarterly report is ready for your review.",
    time: "2m ago",
    unread: 2,
    avatar: "AR",
    status: "online",
    aiHandled: true,
  },
  {
    id: 2,
    name: "Lumen Agent",
    lastMessage: "I've optimized your ad spend for this week.",
    time: "15m ago",
    unread: 0,
    avatar: "🤖",
    status: "active",
    aiHandled: true,
  },
  {
    id: 3,
    name: "Sarah Chen",
    lastMessage: "Can we schedule a call for tomorrow?",
    time: "1h ago",
    unread: 0,
    avatar: "SC",
    status: "offline",
    aiHandled: false,
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#020617" }}>
      {/* Sidebar: Chat List */}
      <div className="w-80 flex flex-col border-r border-white/5 bg-white/2 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Inbox</h1>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/5 ${
                selectedChat.id === chat.id ? "bg-white/5 border-l-2 border-indigo-500" : ""
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {chat.avatar}
                </div>
                {chat.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-white truncate">{chat.name}</span>
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {chat.aiHandled && <Bot className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                  <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Chat Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-white/2 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {selectedChat.avatar}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{selectedChat.name}</h2>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${selectedChat.status === "online" ? "bg-emerald-500" : "bg-slate-500"}`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{selectedChat.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all flex items-center gap-2">
              <Bot className="w-3 h-3" /> AI Summary
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">TODAY</span>
          </div>

          <div className="flex gap-4 max-w-2xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 flex-shrink-0 text-[10px] font-bold border border-indigo-500/30">
              {selectedChat.avatar}
            </div>
            <div className="space-y-2">
              <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed shadow-xl">
                {selectedChat.lastMessage}
              </div>
              <span className="text-[10px] text-slate-600 font-mono">11:42 AM</span>
            </div>
          </div>

          <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500 text-white flex-shrink-0 text-[10px] font-bold shadow-lg shadow-indigo-500/20">
              ME
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <div className="p-4 rounded-2xl rounded-tr-none bg-indigo-600/20 border border-indigo-500/30 text-sm text-slate-200 leading-relaxed shadow-xl">
                I'll review it in a few minutes. Thanks, Alex!
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">11:45 AM</span>
                <CheckCheck className="w-3 h-3 text-indigo-400" />
              </div>
            </div>
          </div>

          {selectedChat.aiHandled && (
            <div className="flex gap-4 max-w-2xl">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white flex-shrink-0 border border-indigo-400 shadow-lg shadow-indigo-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div className="p-4 rounded-2xl rounded-tl-none bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-100 italic leading-relaxed shadow-xl">
                  AI Context: I have drafted a summary of the report highlighting the 15% increase in retention. Should I send it to Sarah?
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Approve</button>
                  <span className="text-slate-700">|</span>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-400 transition-colors uppercase tracking-widest">Edit</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white/2 backdrop-blur-md border-t border-white/5">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              placeholder="Message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
