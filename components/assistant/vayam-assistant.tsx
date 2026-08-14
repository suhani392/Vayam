"use client";

/**
 * components/assistant/vayam-assistant.tsx
 *
 * Vayam AI Civic Assistant Chat Interface.
 * Phase 9: Full multilingual support (en, hi, mr) + voice input/output.
 * All strings go through t() — no inline translations.
 * Voice uses Browser Web Speech API with provider abstraction.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { processAssistantQuery, type AssistantResponse } from "@/lib/ai/orchestrator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { getSTTProvider, getTTSProvider, type VoiceState } from "@/lib/voice";
import type { UserProfile } from "@/lib/core/types";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Compass,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
} from "lucide-react";

export interface VayamAssistantProps {
  initialProfile?: UserProfile | null;
  className?: string;
  isFullPage?: boolean;
}

export function VayamAssistant({
  initialProfile = null,
  className,
  isFullPage = false,
}: VayamAssistantProps) {
  const { lang, t } = useLanguage();

  const { profile, loaded } = useUserProfile();
  const defaultProfile = loaded && profile ? (profile as UserProfile) : null;

  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string; responseData?: AssistantResponse }[]
  >([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(defaultProfile);

  useEffect(() => {
    if (loaded && profile && !activeProfile) {
      setActiveProfile(profile as UserProfile);
    }
  }, [loaded, profile, activeProfile]);

  // Voice state
  const [voiceState, setVoiceState] = useState<VoiceState>("IDLE");
  const [voiceResponsesEnabled, setVoiceResponsesEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Suggested prompts — translated per language
  const suggestedPrompts = [
    t("assistant.suggestedPrompts.0"),
    t("assistant.suggestedPrompts.1"),
    t("assistant.suggestedPrompts.2"),
    t("assistant.suggestedPrompts.3"),
    t("assistant.suggestedPrompts.4"),
    t("assistant.suggestedPrompts.5"),
  ];

  const handleSubmit = useCallback(async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isProcessing) return;

    const userMessageId = `usr-${Date.now()}`;
    const userMsg = { id: userMessageId, role: "user" as const, content: query };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsProcessing(true);
    setToolStatus(t("assistant.toolStatus.checking"));

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setToolStatus(t("assistant.toolStatus.evaluating"));
      await new Promise((resolve) => setTimeout(resolve, 300));

      const assistantRes = await processAssistantQuery(query, activeProfile, lang);

      setMessages((prev) => [
        ...prev,
        {
          id: assistantRes.id,
          role: "assistant",
          content: assistantRes.content,
          responseData: assistantRes,
        },
      ]);

      // Speak response if voice responses enabled
      if (voiceResponsesEnabled && assistantRes.content) {
        speakResponse(assistantRes.content);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: t("assistant.voiceError"),
        },
      ]);
    } finally {
      setIsProcessing(false);
      setToolStatus(null);
    }
  }, [inputQuery, isProcessing, activeProfile, lang, voiceResponsesEnabled, t]);

  // ── Voice: Speech-to-Text ──
  const handleVoiceInput = useCallback(async () => {
    const stt = getSTTProvider();

    if (!stt.isSupported) {
      setVoiceState("UNSUPPORTED");
      setTimeout(() => setVoiceState("IDLE"), 4000);
      return;
    }

    if (voiceState === "LISTENING") {
      stt.stop();
      setVoiceState("IDLE");
      return;
    }

    setVoiceState("LISTENING");

    try {
      const transcript = await stt.transcribe(lang);
      setVoiceState("PROCESSING");

      if (transcript) {
        setInputQuery("");
        handleSubmit(transcript);
        setVoiceState("IDLE");
      } else {
        setVoiceState("ERROR");
        setTimeout(() => setVoiceState("IDLE"), 3000);
      }
    } catch (error: any) {
      setVoiceState("ERROR");
      setTimeout(() => setVoiceState("IDLE"), 3000);
    }
  }, [voiceState, lang, handleSubmit]);

  // ── Voice: Text-to-Speech ──
  const speakResponse = useCallback((text: string) => {
    const tts = getTTSProvider();
    if (!tts.isSupported) return;
    setVoiceState("SPEAKING");
    tts.speak(text, lang);

    // Poll for speech end (speechSynthesis doesn't have reliable onend cross-browser)
    const checkInterval = setInterval(() => {
      if (!tts.isSpeaking()) {
        clearInterval(checkInterval);
        setVoiceState("IDLE");
      }
    }, 300);
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    const tts = getTTSProvider();
    tts.stop();
    setVoiceState("IDLE");
  }, []);

  // ── Voice state label ──
  const getVoiceStateLabel = (): string | null => {
    switch (voiceState) {
      case "LISTENING": return t("assistant.voiceListening");
      case "PROCESSING": return t("assistant.voiceProcessing");
      case "SPEAKING": return t("assistant.voiceSpeaking");
      case "ERROR": return t("assistant.voiceError");
      case "UNSUPPORTED": return t("assistant.voiceUnsupported");
      default: return null;
    }
  };

  const voiceLabel = getVoiceStateLabel();

  return (
    <div className={cn("flex flex-col h-full rounded-2xl border border-border-subtle bg-card overflow-hidden shadow-xs", className)}>

      {/* ── Assistant Header ── */}
      <div className="p-4 border-b border-border-subtle bg-surface-secondary/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold shadow-xs">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-h4 font-extrabold text-foreground">
                {lang === "en" ? "Vayam AI Civic Assistant" : lang === "hi" ? "वयम् AI सिविक सहायक" : "वयम् AI सिव्हिक सहाय्यक"}
              </h3>
              <span className="badge badge-success text-[10px] uppercase font-semibold">{t("assistant.verified")}</span>
            </div>
            <p className="text-caption text-muted-foreground">
              {t("assistant.disclaimer")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Voice toggle */}
          <button
            onClick={() => setVoiceResponsesEnabled(!voiceResponsesEnabled)}
            className={cn(
              "flex items-center gap-1.5 text-caption font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
              voiceResponsesEnabled
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-subtle text-muted-foreground hover:text-foreground"
            )}
            title={t("assistant.voiceToggle")}
          >
            {voiceResponsesEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span className="hidden sm:inline">{voiceResponsesEnabled ? t("assistant.voiceOn") : t("assistant.voiceOff")}</span>
          </button>

          {/* Profile Context */}
          <div className="flex items-center gap-2 text-caption font-semibold">
            <span className="text-muted-foreground hidden sm:inline">{t("assistant.context")}</span>
            {activeProfile ? (
              <button
                onClick={() => setActiveProfile(null)}
                className="badge badge-accent hover:badge-primary gap-1 cursor-pointer transition-all"
              >
                <User size={11} /> {activeProfile.name}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (loaded && profile) {
                    setActiveProfile(profile as UserProfile);
                  }
                }}
                className="badge badge-muted hover:badge-accent gap-1 cursor-pointer transition-all"
              >
                {t("assistant.noProfile")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat Messages Body ── */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 min-h-[400px]">

        {/* Initial Greeting Card */}
        {messages.length === 0 && (
          <div className="space-y-6 max-w-2xl mx-auto text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-h2 font-extrabold text-foreground">{t("assistant.greeting")}</h2>
              <p className="text-body text-muted-foreground max-w-lg mx-auto">
                {t("assistant.subtitle")}
              </p>
            </div>

            {/* Suggested Prompt Pills */}
            <div className="space-y-3 pt-2">
              <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block">
                {t("assistant.suggestedLabel")}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestedPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => handleSubmit(promptText)}
                    className="btn btn-outline btn-sm rounded-xl text-body-sm font-medium hover:btn-primary transition-all shadow-xs"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Trajectory */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-3xl",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-caption",
                msg.role === "user"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-accent text-accent-foreground"
              )}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="space-y-4 flex-1 min-w-0">
              <div
                className={cn(
                  "p-4 rounded-2xl text-body-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-amber-500/15 border border-amber-500/30 text-foreground rounded-tr-none shadow-xs"
                    : "bg-surface-secondary/80 text-foreground border border-border-subtle rounded-tl-none"
                )}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.content}</p>

                {/* Clarification Options */}
                {msg.responseData?.clarificationOptions && (
                  <div className="mt-3 pt-3 border-t border-border-subtle/50 flex flex-wrap gap-2">
                    {msg.responseData.clarificationOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSubmit(opt)}
                        className="btn btn-primary btn-xs rounded-lg font-bold"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Render Knowledge Records */}
              {msg.responseData?.records && msg.responseData.records.length > 0 && (
                <div className="space-y-3 pt-1">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                    <Compass size={12} className="text-accent" /> {t("assistant.opportunities")} ({msg.responseData.records.length}):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {msg.responseData.records.map((rec) => (
                      <KnowledgeCard key={rec.id} record={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sources & Actions */}
              {msg.responseData && (msg.responseData.sources.length > 0 || msg.responseData.actions.length > 0) && (
                <div className="p-3 rounded-xl bg-card border border-border-subtle space-y-2 text-caption">
                  {msg.responseData.sources.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={12} className="text-success" /> {t("assistant.source")}
                      </span>
                      {msg.responseData.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-accent hover:underline flex items-center gap-0.5"
                        >
                          {src.name} <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  )}

                  {msg.responseData.actions.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border-subtle/40">
                      {msg.responseData.actions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.payload as any}
                          target={act.type === "OPEN_OFFICIAL_URL" ? "_blank" : undefined}
                          className="btn btn-outline btn-xs gap-1 font-bold"
                        >
                          {act.label} <ArrowRight size={10} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center gap-3 text-caption font-semibold text-accent animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <span>{toolStatus || t("assistant.toolStatus.default")}</span>
          </div>
        )}

        {/* Voice state indicator */}
        {voiceLabel && voiceState !== "IDLE" && !isProcessing && (
          <div className={cn(
            "flex items-center gap-3 text-caption font-semibold px-3 py-2 rounded-xl w-fit",
            voiceState === "LISTENING" ? "text-accent bg-accent/10 animate-pulse" :
            voiceState === "SPEAKING" ? "text-success bg-success/10" :
            voiceState === "ERROR" || voiceState === "UNSUPPORTED" ? "text-destructive bg-destructive/10" :
            "text-muted-foreground bg-surface-secondary"
          )}>
            {voiceState === "LISTENING" ? <Mic size={14} /> :
             voiceState === "SPEAKING" ? <Volume2 size={14} /> :
             <MicOff size={14} />}
            <span>{voiceLabel}</span>
            {voiceState === "SPEAKING" && (
              <button
                onClick={stopSpeaking}
                className="ml-2 p-1 rounded-md bg-card border border-border-subtle hover:bg-destructive/10 transition-colors cursor-pointer"
                aria-label={t("assistant.stopSpeaking")}
              >
                <Square size={10} />
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Chat Input Footer ── */}
      <div className="p-4 border-t border-border-subtle bg-surface-secondary/50 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isProcessing || voiceState === "PROCESSING"}
            className={cn(
              "p-3 rounded-xl border transition-all cursor-pointer shrink-0",
              voiceState === "LISTENING"
                ? "bg-accent text-accent-foreground border-accent shadow-sm animate-pulse"
                : "border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
            )}
            aria-label={voiceState === "LISTENING" ? t("assistant.stopVoice") : t("assistant.startVoice")}
          >
            {voiceState === "LISTENING" ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isProcessing}
            placeholder={t("assistant.inputPlaceholder")}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-body-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="btn btn-primary px-4 py-3 rounded-xl gap-2 font-bold shrink-0 disabled:opacity-50"
          >
            <span>{t("assistant.send")}</span> <Send size={16} />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>{t("assistant.disclaimer")}</span>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="hover:text-foreground font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} /> {t("assistant.clearChat")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
