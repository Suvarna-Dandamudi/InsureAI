import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MessageSquare, Sparkles } from 'lucide-react';
import { chatAPI } from '../utils/api';

const QUICK_PROMPTS = [
  'How do I file a new claim?',
  'What types of policies are available?',
  'How does fraud detection work?',
  'What is my coverage status?',
];

const mockReply = async (message) => {
  await new Promise(r => setTimeout(r, 800));
  const lower = message.toLowerCase();
  if (lower.includes('claim')) return "To file a claim, navigate to the Claims section in the sidebar and click 'File Claim'. You'll need your policy number, incident date, and a brief description. Our AI system will automatically analyze for fraud patterns.";
  if (lower.includes('policy') || lower.includes('coverage')) return "We offer 6 types of insurance policies: Health, Auto, Life, Property, Travel, and Business. Each comes with customizable coverage amounts and premium options. Visit the Policies section to view or create policies.";
  if (lower.includes('fraud')) return "InsurAI uses advanced machine learning to detect fraud in real-time. Every claim submission is scored 0-100 for fraud risk. Claims above 60 are automatically flagged for review. Our models achieve 94.2% accuracy.";
  return "I'm InsurAI's virtual assistant powered by AI. I can help you with policy inquiries, claim status, fraud reporting, and coverage questions. What would you like to know?";
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: "Hi! I'm InsurAI Assistant 🛡️ I'm here to help with policy questions, claim status, fraud reporting, and more. How can I assist you today?", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const { data } = await chatAPI.send(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: data.reply, time: new Date() }]);
    } catch {
      const reply = await mockReply(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply, time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center relative">
          <MessageSquare className="text-brand-400" size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-surface-950 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-primary flex items-center gap-2">
            AI Assistant <Sparkles size={16} className="text-brand-500" />
          </h1>
          <p className="text-secondary text-xs">Powered by InsurAI Intelligence Engine</p>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-brand-500/20 text-brand-500' : 'bg-white/10 text-primary'}`}>
                  {msg.role === 'assistant' ? <Bot size={16} /> : <User size={14} />}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-white/[0.05] text-primary rounded-tl-sm'
                      : 'bg-brand-500/20 text-brand-100 rounded-tr-sm border border-brand-500/20'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-muted">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Bot size={16} className="text-brand-400" />
              </div>
              <div className="bg-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => send(p)}
                className="text-xs bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-brand-500/30 text-slate-300 hover:text-brand-300 px-3 py-1.5 rounded-full transition-all">
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about policies, claims, or fraud detection..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all"
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 flex items-center justify-center text-white transition-all shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
