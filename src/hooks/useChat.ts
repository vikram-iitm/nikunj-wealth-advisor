import { useState, useCallback } from 'react';
import { ChatMessage, EmbeddedComponent } from '../types';

let messageIdCounter = 0;

const generateMessageId = () => {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addUserMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: generateMessageId(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  const addAIMessage = useCallback((text: string, component?: EmbeddedComponent) => {
    const message: ChatMessage = {
      id: generateMessageId(),
      sender: 'ai',
      text,
      timestamp: new Date(),
      component,
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  const simulateTyping = useCallback(async (duration: number = 1000) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setIsTyping(false);
  }, []);

  const sendMessage = useCallback(async (
    text: string,
    responseGenerator: (text: string) => Promise<{ text: string; component?: EmbeddedComponent }>
  ) => {
    // Add user message
    addUserMessage(text);

    // Simulate AI thinking
    setIsTyping(true);

    try {
      // Generate response (with simulated delay)
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
      const response = await responseGenerator(text);

      setIsTyping(false);

      // Add AI response
      addAIMessage(response.text, response.component);
    } catch (error) {
      setIsTyping(false);
      addAIMessage("I apologize, but I encountered an error. Please try again.");
    }
  }, [addUserMessage, addAIMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Add initial welcome message
  const initializeChat = useCallback((welcomeMessage: string, component?: EmbeddedComponent) => {
    if (messages.length === 0) {
      addAIMessage(welcomeMessage, component);
    }
  }, [messages.length, addAIMessage]);

  return {
    messages,
    isTyping,
    addUserMessage,
    addAIMessage,
    simulateTyping,
    sendMessage,
    clearMessages,
    initializeChat,
    setIsTyping,
  };
}

export default useChat;
