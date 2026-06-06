'use client';

import React, { useState } from 'react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hello! I am the Secret Gem AI Assistant. How can I help you with your stay or our Tuya Smart locks today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {!isOpen && (
        <button className={styles.chatToggleButton} onClick={() => setIsOpen(true)}>
          <span className={styles.chatIcon}>✨ Chat with AI</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Secret Gem AI Assistant</h3>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.messageUser : styles.messageAi}`}>
                <div className={styles.messageBubble}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.messageAi}`}>
                <div className={styles.messageBubble}>Typing...</div>
              </div>
            )}
          </div>
          
          <div className={styles.chatInputArea}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              className={styles.chatInput}
            />
            <button onClick={sendMessage} className={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
