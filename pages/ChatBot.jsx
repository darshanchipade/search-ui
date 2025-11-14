'use client';

import React, { useState, useRef, useEffect } from 'react';

function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  const isJson = typeof content !== 'string';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={`${isUser ? 'bg-blue-600 text-white' : 'bg-white text-[#111215]'} max-w-[80%] rounded-2xl px-4 py-3 shadow`}
      >
        {isJson ? (
          <pre className="font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto">
            {JSON.stringify(content, null, 2)}
          </pre>
        ) : (
          <div className="whitespace-pre-wrap break-words">{content}</div>
        )}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [input, setInput] = useState('Need all content for video-section-header');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me about a section, e.g., "video-section-header"' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, limit: 1000 })
      });
      const data = await res.json();

      const summary = Array.isArray(data)
        ? `Found ${data.length} items for your request.`
        : 'Here are your results';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: summary },
        { role: 'assistant', content: data }
      ]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-semibold text-[#111215]">Chatbot</h1>

        <div ref={listRef} className="flex-1 overflow-auto bg-gray-100 rounded-xl p-4 h-[60vh] flex flex-col gap-3">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}
          {isLoading && <div className="text-center text-sm text-gray-500">Thinking…</div>}
        </div>

        <div className="bg-white rounded-xl shadow p-2 flex gap-2 items-end">
          <textarea
            className="flex-1 resize-none border-0 outline-none p-2 text-sm"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
          />
          <button
            onClick={send}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}