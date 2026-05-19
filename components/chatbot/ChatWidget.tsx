"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Minus, Send, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    messages,
    sendMessage,
    status
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: "Hello! I'm Dr. AI, your virtual assistant for Dr. Sharma's Clinic. How can I help you today?"
          }
        ]
      }
    ] as any
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleQuickReply = (text: string) => {
    setInput(text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-accent to-[#0ea5e9] text-white rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.5)] group border border-white/10"
            aria-label="Open chat"
          >
            <div className="absolute inset-0 rounded-2xl border border-accent animate-ping opacity-50"></div>
            <MessageSquare className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
            
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-primary text-white text-xs font-bold tracking-wide uppercase rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
              Ask Dr. AI
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-primary"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-50 w-full h-full md:w-[400px] md:h-[600px] max-h-screen md:max-h-[85vh] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 pb-16 md:pb-0"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-[#163a5f] p-4 flex items-center justify-between text-white border-b border-white/[0.06] shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 shadow-inner">
                    <Bot className="w-5 h-5 text-accent-light" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-primary animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Dr. AI Assistant</h3>
                  <p className="text-[10px] font-bold text-accent-light flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online & Ready
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#f8fafc] flex flex-col gap-4 relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex items-start gap-3 max-w-[88%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      m.role === 'user' 
                        ? 'bg-primary text-white border-primary/20 shadow-sm' 
                        : 'bg-white border-slate-100 text-primary shadow-sm'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-r from-accent to-[#0ea5e9] text-white shadow-[0_8px_16px_-6px_rgba(14,165,233,0.25)] rounded-tr-none font-semibold' 
                        : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none font-medium'
                    }`}>
                      {m.parts.map((part, index) => {
                        if (part.type === 'text') {
                          return <span key={index}>{part.text}</span>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 w-5/6">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              {messages.length < 3 && (
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                  {["Book Appointment", "Clinic Timings", "Services & Fees", "Location"].map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => handleQuickReply(text)}
                      className="whitespace-nowrap px-3.5 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold hover:bg-accent hover:text-white transition-all uppercase tracking-wide cursor-pointer"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white transition-all pr-12 text-slate-800 font-medium"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 w-8 h-8 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
