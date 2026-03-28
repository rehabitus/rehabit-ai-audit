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

// Polyfill types for Web Speech API (not always in tsconfig lib targets)
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

export function ChatMode({ name, onComplete }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [noApiKey, setNoApiKey] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesRef = useRef<Message[]>([]);

    // Start conversation with greeting from assistant
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
                body: JSON.stringify({ messages: currentMessages, name }),
            });

            if (res.status === 503) {
                setNoApiKey(true);
                setIsLoading(false);
                return;
            }

            if (!res.ok || !res.body) {
                setIsLoading(false);
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
                    } catch {
                        // ignore parse errors for partial chunks
                    }
                }
            }

            // Check if survey complete
            if (assistantText.includes("SURVEY_COMPLETE")) {
                const cleanText = assistantText.replace("SURVEY_COMPLETE", "").trim();
                const finalMessages = messagesRef.current.map((m, i) =>
                    i === messagesRef.current.length - 1
                        ? { ...m, content: cleanText }
                        : m
                );
                setMessages(finalMessages);
                messagesRef.current = finalMessages;
                setIsComplete(true);
                setTimeout(() => onComplete(getTranscript(finalMessages)), 1500);
            }
        } catch {
            // Network error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || isLoading) return;
        setInput("");

        const newMessages: Message[] = [
            ...messagesRef.current,
            { role: "user", content },
        ];
        setMessages(newMessages);
        messagesRef.current = newMessages;
        setIsLoading(true);

        await streamResponse(newMessages);
    };

    const toggleVoice = () => {
        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            alert("Voice input is not supported in this browser. Try Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognitionRef.current = recognition;

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
            // Auto-send after voice input
            setTimeout(() => handleSend(transcript), 300);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    };

    if (noApiKey) {
        return (
            <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/10 p-6 text-center">
                <p className="text-brand-orange font-semibold mb-1">Chat Mode Unavailable</p>
                <p className="text-slate-400 text-sm">OpenAI API key not configured. Please use Survey Mode instead.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[340px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-brand-green text-brand-dark font-medium rounded-br-sm"
                                    : "bg-white/[0.06] text-slate-200 border border-white/5 rounded-bl-sm"
                                    }`}
                            >
                                {msg.content || (
                                    <span className="flex gap-1">
                                        <span className="animate-bounce">·</span>
                                        <span className="animate-bounce [animation-delay:0.1s]">·</span>
                                        <span className="animate-bounce [animation-delay:0.2s]">·</span>
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && messages.length === 0 && (
                    <div className="flex justify-start">
                        <div className="bg-white/[0.06] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-2.5 text-slate-400 text-sm flex gap-1">
                            <span className="animate-bounce">·</span>
                            <span className="animate-bounce [animation-delay:0.1s]">·</span>
                            <span className="animate-bounce [animation-delay:0.2s]">·</span>
                        </div>
                    </div>
                )}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-brand-green text-sm font-semibold py-2"
                    >
                        ✓ Survey complete — calculating your score...
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!isComplete && (
                <div className="flex gap-2 pt-3 border-t border-white/10 mt-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your answer..."
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/20 transition-all"
                    />
                    {/* Voice button */}
                    <button
                        onClick={toggleVoice}
                        title={isListening ? "Stop listening" : "Voice input"}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${isListening
                            ? "border-brand-red bg-brand-red/20 text-brand-red"
                            : "border-white/10 bg-white/[0.06] text-slate-400 hover:border-brand-green/40 hover:text-brand-green"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg>
                    </button>
                    {/* Send button */}
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green text-brand-dark transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
