"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    name: string;
    onComplete: (transcript: string) => void;
}

// Polyfill types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
    }
}

export function ScorecardChat({ name, onComplete }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [initError, setInitError] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesRef = useRef<Message[]>([]);

    useEffect(() => {
        startChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startChat = async () => {
        setIsLoading(true);
        const initialMessages: Message[] = [];
        await streamResponse(initialMessages);
    };

    const getTranscript = (msgs: Message[]) =>
        msgs.map((m) => `${m.role === "assistant" ? "Assistant" : "You"}: ${m.content}`).join("\n");

    const streamResponse = async (currentMessages: Message[]) => {
        try {
            const res = await fetch("/api/lead-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: currentMessages,
                    name,
                    context: "AI Opportunity Scorecard - Big 4 Departments (Marketing, Sales, Delivery, Operations)"
                }),
            });

            if (!res.ok || !res.body) {
                setIsLoading(false);
                if (currentMessages.length === 0) setInitError(true);
                return;
            }

            let assistantText = "";
            const assistantMessage: Message = { role: "assistant", content: "" };
            const newMessages = [...currentMessages, assistantMessage];
            setMessages(newMessages);
            messagesRef.current = newMessages;

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.slice(6).trim();
                    if (data === "[DONE]") continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            assistantText += delta;
                            const updated = newMessages.map((m, i) =>
                                i === newMessages.length - 1
                                    ? { ...m, content: assistantText }
                                    : m
                            );
                            setMessages(updated);
                            messagesRef.current = updated;
                        }
                    } catch { }
                }
            }

            if (assistantText.includes("SURVEY_COMPLETE")) {
                const cleanText = assistantText.replace("SURVEY_COMPLETE", "").trim();
                const finalMessages = messagesRef.current.map((m, i) =>
                    i === messagesRef.current.length - 1 ? { ...m, content: cleanText } : m
                );
                setMessages(finalMessages);
                messagesRef.current = finalMessages;
                setIsComplete(true);
                setTimeout(() => onComplete(getTranscript(finalMessages)), 2000);
            }
        } catch {
            if (currentMessages.length === 0) setInitError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || isLoading) return;
        setInput("");

        const newMessages: Message[] = [...messagesRef.current, { role: "user", content }];
        setMessages(newMessages);
        messagesRef.current = newMessages;
        setIsLoading(true);

        await streamResponse(newMessages);
    };

    const toggleVoice = () => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            alert("Voice input not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognitionRef.current = recognition;

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
            setTimeout(() => handleSend(transcript), 300);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    };

    return (
        <div className="w-full max-w-3xl flex flex-col h-[70vh] bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Background Blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {initError && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <p className="text-slate-400">Chat AI is temporarily unavailable.</p>
                        <button
                            onClick={() => { setInitError(false); startChat(); }}
                            className="text-sm text-brand-green underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-[24px] px-6 py-4 text-base leading-relaxed ${msg.role === "user"
                                        ? "bg-brand-green text-brand-dark font-bold rounded-tr-none shadow-lg shadow-brand-green/20"
                                        : "bg-white/[0.05] border border-white/5 text-slate-200 rounded-tl-none"
                                    }`}
                            >
                                {msg.content || (
                                    <span className="flex gap-1.5 py-1">
                                        <span className="w-2 h-2 rounded-full bg-brand-green/40 animate-bounce" />
                                        <span className="w-2 h-2 rounded-full bg-brand-green/40 animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-2 h-2 rounded-full bg-brand-green/40 animate-bounce [animation-delay:0.4s]" />
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {isComplete ? (
                <div className="px-8 py-8 border-t border-white/10 bg-black/40 text-center">
                    <p className="text-brand-green font-bold text-lg animate-pulse">✓ Perfect. Analyzing your gaps now...</p>
                </div>
            ) : (
                <div className="px-8 py-8 border-t border-white/10 bg-black/20 backdrop-blur-md">
                    <div className="flex gap-4 items-center max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your answer or speak..."
                            disabled={isLoading}
                            className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/20 transition-all shadow-inner"
                        />
                        <button
                            onClick={toggleVoice}
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${isListening
                                ? "border-brand-red bg-brand-red/20 text-brand-red animate-pulse"
                                : "border-white/10 bg-black/40 text-slate-400 hover:border-brand-green hover:text-brand-green"
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-brand-dark transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-brand-green/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
