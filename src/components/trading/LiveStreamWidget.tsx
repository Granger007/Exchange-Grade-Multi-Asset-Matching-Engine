import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Plus, Copy, Play, TrendingUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isTrader?: boolean;
}

const mockChats: ChatMessage[] = [
  { id: '1', user: 'CryptoKing', text: 'BTC holding strong at resistance!' },
  { id: '2', user: 'WhaleWatcher', text: 'I see a massive buy wall forming.' },
  { id: '3', user: 'MoonBag', text: 'Are we longing here?' },
  { id: '4', user: 'AlexTheTrader', text: 'Setting my stop loss tight just in case.', isTrader: true },
];

export function LiveStreamWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChats);
  const [inputText, setInputText] = useState('');
  const [viewers, setViewers] = useState(12845);

  // Simulate viewer fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: inputText,
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Simulate auto-scroll (in a real app, use a ref)
    setTimeout(() => {
      const chatBox = document.getElementById('chat-container');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  };

  return (
    <div className="w-full bg-background/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
      
      {/* LEFT: Video Stream Section */}
      <div className="flex-1 right-border border-white/10 relative flex flex-col bg-black/40">
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?img=11" alt="Streamer" className="w-10 h-10 rounded-full border-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-[10px] font-bold px-1.5 rounded-sm text-white">LIVE</div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">AlexTheTrader • Crypto Trading Live</h3>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <Users className="w-3 h-3" /> {viewers.toLocaleString()} watching
              </p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 backdrop-blur-sm transition-colors">
            <Plus className="w-3 h-3" /> Follow
          </button>
        </div>

        {/* Video Player Placeholder - Using an iframe for a generic cool tech background or just a styled div */}
        <div className="flex-1 relative bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
           {/* Abstract animated background simulating a stylized stream */}
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent animate-pulse"></div>
           
           <div className="text-center z-10">
             <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 relative cursor-pointer group">
               <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping opacity-75"></div>
               <Play className="w-6 h-6 text-primary translate-x-0.5 group-hover:scale-110 transition-transform" />
             </div>
             <p className="text-white/50 text-sm">Stream is currently paused.</p>
             <p className="text-white/30 text-xs mt-1">Waiting for streamer to reconnect...</p>
           </div>
           
           {/* Fake live chart overlay on stream */}
           <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg border border-white/10 backdrop-blur-md w-48">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">BTC/USD (Live)</span>
                <span className="text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />+2.4%</span>
              </div>
              <div className="text-xl font-mono text-white">$64,320.50</div>
           </div>
        </div>
      </div>

      {/* RIGHT: Live Chat & Copy Trade Section */}
      <div className="w-full md:w-80 flex flex-col bg-background/60 border-l border-white/10">
        <div className="p-4 border-b border-white/10 font-medium text-sm text-white/90 flex justify-between items-center">
          <span>Live Chat</span>
          <MessageSquare className="w-4 h-4 text-white/50" />
        </div>

        {/* Chat Messages */}
        <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className={`font-semibold mr-2 ${msg.isTrader ? 'text-primary' : msg.user === 'You' ? 'text-blue-400' : 'text-purple-400'}`}>
                {msg.isTrader && <span className="bg-primary text-black text-[10px] px-1 py-0.5 rounded mr-1">PRO</span>}
                {msg.user}:
              </span>
              <span className="text-white/80">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </form>
        </div>

        {/* Copy Trade Action */}
        <div className="p-4 border-t border-white/10 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer flex flex-col justify-center items-center gap-2 group">
           <button className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold md:text-sm hover:opacity-90 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all">
             <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
             Copy Streamer's Trades
           </button>
           <p className="text-white/50 text-[10px] text-center">Automatically mirror AlexTheTrader's portfolio with your available balance.</p>
        </div>
      </div>

    </div>
  );
}
