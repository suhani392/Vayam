"use client";

/**
 * components/assistant/assistant-ui.tsx
 *
 * Presentation-only UI components for Vayam's AI Assistant interface.
 * Contains NO AI provider or API logic — pure presentation components.
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Bot, User, Mic, Send, Sparkles, X, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AssistantButtonProps {
  onClick?: () => void;
  unreadCount?: number;
  className?: string;
}

export function AssistantButton({ onClick, unreadCount, className }: AssistantButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Vayam Assistant"
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 font-bold text-body-sm cursor-pointer",
        className
      )}
    >
      <Bot size={18} />
      <span>Ask Vayam Assistant</span>
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-extrabold flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

export interface SuggestedPromptProps {
  prompt: string;
  onClick: (prompt: string) => void;
  className?: string;
}

export function SuggestedPrompt({ prompt, onClick, className }: SuggestedPromptProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(prompt)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border-subtle hover:border-accent text-body-sm font-medium text-foreground hover:text-accent shadow-2xs transition-colors cursor-pointer select-none text-left",
        className
      )}
    >
      <Sparkles size={12} className="text-accent flex-shrink-0" />
      <span>{prompt}</span>
    </button>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-surface-secondary w-fit text-muted-foreground">
      <Bot size={16} className="text-accent" />
      <span className="text-caption font-medium">Vayam Assistant is thinking</span>
      <div className="flex items-center gap-1 ml-1">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

export interface VoiceButtonProps {
  isListening?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function VoiceButton({ isListening = false, onToggle, className }: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
      className={cn(
        "p-2.5 rounded-full transition-all duration-200 cursor-pointer",
        isListening
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : "bg-surface-secondary text-foreground hover:bg-muted",
        className
      )}
    >
      <Mic size={16} />
    </button>
  );
}

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  sourceName?: string;
  className?: string;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  sourceName,
  className,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-caption font-bold mt-1",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div className="space-y-1">
        <div
          className={cn(
            "p-4 rounded-2xl text-body-sm leading-relaxed",
            isUser
              ? "bg-accent text-accent-foreground rounded-tr-xs"
              : "bg-card border border-border-subtle text-foreground rounded-tl-xs shadow-2xs"
          )}
        >
          {content}
        </div>

        <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
          {timestamp && <span>{timestamp}</span>}
          {!isUser && sourceName && (
            <span className="flex items-center gap-1 font-semibold text-accent">
              <Globe size={10} /> Source: {sourceName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export interface AssistantInputProps {
  onSend: (message: string) => void;
  isListening?: boolean;
  onVoiceToggle?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AssistantInput({
  onSend,
  isListening,
  onVoiceToggle,
  placeholder = "Ask about government schemes, rights, or services...",
  disabled = false,
  className,
}: AssistantInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-2xl bg-card border border-border-subtle shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all",
        className
      )}
    >
      <input
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 py-2 text-body-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      <VoiceButton isListening={isListening} onToggle={onVoiceToggle} />

      <Button
        size="sm"
        disabled={!text.trim() || disabled}
        onClick={handleSend}
        className="rounded-full p-2.5 h-auto"
        aria-label="Send message"
      >
        <Send size={14} />
      </Button>
    </div>
  );
}

export interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function AssistantPanel({
  isOpen,
  onClose,
  children,
  title = "Vayam Civic Assistant",
  className,
}: AssistantPanelProps) {
  if (!isOpen) return null;

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-h-[600px] h-[80vh] rounded-3xl bg-card border border-border-subtle shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-secondary">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent text-accent-foreground">
            <Bot size={18} />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-foreground">{title}</h4>
            <p className="text-caption text-muted-foreground">Natural language & voice layer</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
    </div>
  );
}
