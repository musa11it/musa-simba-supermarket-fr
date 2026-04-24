import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Sparkles, Bot, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([{ role: 'assistant', content: t('chatbot.greeting'), timestamp: new Date() }]);
    }
  }, [isOpen, t, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', {
        message: messageText,
        language: i18n.language,
        history,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply, timestamp: new Date() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    t('chatbot.suggestions.milk'),
    t('chatbot.suggestions.breakfast'),
    t('chatbot.suggestions.branches'),
    t('chatbot.suggestions.delivery'),
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
          'bg-gradient-to-br from-simba-500 to-simba-700 text-white',
          isOpen && 'scale-0'
        )}
        aria-label="Open chat"
      >
        <MessageCircle size={26} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
          <Sparkles size={10} className="text-white" />
        </span>
      </button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-40 w-[calc(100vw-3rem)] sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right',
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-simba-500 to-simba-700 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-semibold">{t('chatbot.title')}</h3>
              <p className="text-xs text-red-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                {t('chatbot.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-2 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  msg.role === 'user' ? 'bg-simba-500 text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={cn(
                  'px-4 py-2.5 rounded-2xl text-sm',
                  msg.role === 'user'
                    ? 'bg-simba-500 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot size={16} className="text-gray-600" />
              </div>
              <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs bg-simba-50 text-simba-700 hover:bg-simba-100 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-3 border-t border-gray-100"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-simba-500 focus:bg-white transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-simba-500 hover:bg-simba-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
