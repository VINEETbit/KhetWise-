import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bot, CloudSun, Leaf, Mic, MicOff, Send, Sprout, Volume2 } from "lucide-react";
import { getAssistantFarmContext, getFarmAdvice } from "../services/farmerAssistant";
import { getFarmForecast } from "../services/farmWeather";

const STARTERS = [
  { label: "Leaves are turning yellow", value: "My crop leaves are turning yellow. What should I check?" },
  { label: "Help with irrigation", value: "How should I plan irrigation for my field?" },
  { label: "Pest on my crop", value: "I found insects on my crop. What should I do first?" },
  { label: "When should I add fertilizer?", value: "How can I decide what fertilizer my crop needs?" },
];

function makeWelcome(language, farm) {
  if (language === "hi-IN") {
    return `नमस्ते${farm?.location ? `! आपके खेत का स्थान ${farm.location} सेव है` : ""}। फसल, अवस्था और समस्या बताइए। मैं शुरुआती जाँच और अगले सुरक्षित कदम बताऊँगा।`;
  }
  return `Hello${farm?.location ? `! I can see your saved farm location is ${farm.location}` : ""}. Tell me the crop, its growth stage and what you are seeing. I’ll help you check likely causes and practical next steps.`;
}

export default function Assistant() {
  const [language, setLanguage] = useState("en-IN");
  const [farmContext, setFarmContext] = useState(getAssistantFarmContext);
  const [messages, setMessages] = useState(() => [{ id: 1, role: "assistant", text: makeWelcome("en-IN", getAssistantFarmContext()) }]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [sending, setSending] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
    }
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!farmContext.location) return undefined;
    let active = true;
    getFarmForecast(farmContext.location)
      .then(() => { if (active) setFarmContext(getAssistantFarmContext()); })
      .catch(() => { if (active) setFarmContext(getAssistantFarmContext()); });
    return () => { active = false; };
  }, [farmContext.location]);

  const sendMessage = (value, responseLanguage = language) => {
    const question = value.trim();
    if (!question || sending) return;
    setSending(true);
    setVoiceMessage("");
    setDraft("");
    const advice = getFarmAdvice(question, responseLanguage);
    const currentContext = getAssistantFarmContext();
    setFarmContext(currentContext);
    const id = Date.now();
    setMessages((current) => [
      ...current,
      { id: id, role: "user", text: question },
      { id: id + 1, role: "assistant", advice, weather: currentContext.weather, location: currentContext.location },
    ]);
    setSending(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage("Voice typing is not available in this browser. Try Microsoft Edge or Google Chrome, or type your question.");
      return;
    }

    try {
      recognitionRef.current?.stop();
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;
      transcriptRef.current = "";
      recognition.onstart = () => { setListening(true); setVoiceMessage("Listening… speak clearly about one farm problem."); };
      recognition.onresult = (event) => {
        transcriptRef.current = Array.from(event.results).map((item) => item[0]?.transcript || "").join(" ").trim();
      };
      recognition.onerror = (event) => {
        const errors = {
          "not-allowed": "Microphone access is blocked. Allow microphone access in your browser settings, then try again.",
          "no-speech": "I didn’t hear speech. Try again in a quieter place.",
          "network": "The browser’s speech service is unavailable. You can type your question instead.",
        };
        setVoiceMessage(errors[event.error] || "Voice input stopped. Please try again or type your question.");
      };
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        const transcript = transcriptRef.current;
        if (transcript) sendMessage(transcript, language);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
      setVoiceMessage("Could not start voice input. Check microphone permission and try again.");
    }
  };

  const stopVoiceInput = () => recognitionRef.current?.stop();

  const speakAnswer = (message, responseLanguage) => {
    if (!window.speechSynthesis) {
      setVoiceMessage("Spoken playback is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = responseLanguage === "hi" ? "hi-IN" : "en-IN";
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(responseLanguage === "hi" ? "hi" : "en-in"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(190,242,100,0.13),_transparent_34%),linear-gradient(135deg,_#f8faf6_0%,_#f2f6ef_100%)] px-4 py-7 text-[#102018] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950"><ArrowLeft size={17} /> Dashboard</Link>
        <header className="mb-6 flex flex-col justify-between gap-4 rounded-3xl bg-[linear-gradient(115deg,#092116,#16472a)] p-6 text-white shadow-[0_20px_50px_rgba(9,33,22,0.16)] sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-[#092116]"><Bot size={25} /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">KhetWise guide</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">AI Farm Assistant</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Describe a crop, weather, irrigation, pest or soil problem to get practical next steps tailored with your saved farm context.</p></div></div>
          <label className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-sm sm:self-auto"><span className="text-white/55">Voice</span><select value={language} onChange={(event) => { const nextLanguage = event.target.value; setLanguage(nextLanguage); setMessages((current) => current.length === 1 ? [{ ...current[0], text: makeWelcome(nextLanguage, getAssistantFarmContext()) }] : current); }} className="bg-transparent font-semibold text-white outline-none [&>option]:text-black"><option value="en-IN">English</option><option value="hi-IN">हिन्दी</option></select></label>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="flex min-h-[68vh] flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_12px_35px_rgba(16,32,24,0.055)]">
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-green-800"><Sprout size={20} /></div><div><p className="font-bold">Farm help</p><p className="text-xs text-black/45">{farmContext.location || "Add a location for local weather context"}</p></div></div><span className="flex items-center gap-2 text-xs font-medium text-green-800"><span className="h-2 w-2 rounded-full bg-green-500" /> Ready</span></div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
              {messages.map((message) => message.role === "user" ? <div key={message.id} className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#092116] px-4 py-3 text-sm leading-6 text-white sm:max-w-[78%]">{message.text}</div> : <article key={message.id} className="max-w-[95%] rounded-2xl rounded-bl-md border border-black/[0.06] bg-[#f7faf5] p-4 sm:max-w-[88%] sm:p-5">
                {message.advice ? <><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-green-800">{message.advice.title}</p><p className="mt-2 text-sm leading-6 text-[#425047]">{message.advice.body}</p></div><button type="button" onClick={() => speakAnswer(`${message.advice.title}. ${message.advice.body} ${message.advice.steps.join(" ")}`, /[\u0900-\u097f]/u.test(message.advice.title) ? "hi" : "en")} aria-label="Listen to this answer" className="shrink-0 rounded-lg p-2 text-black/40 transition hover:bg-white hover:text-green-800"><Volume2 size={17} /></button></div><ol className="mt-3 space-y-2">{message.advice.steps.map((step, index) => <li key={step} className="flex gap-2 text-sm leading-6 text-[#425047]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-100 text-[10px] font-bold text-green-800">{index + 1}</span><span>{step}</span></li>)}</ol>{message.weather && <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-950"><CloudSun size={15} /><span>Saved forecast for {message.weather.location}: {Math.round(message.weather.temperature)}{message.weather.unit}, {message.weather.description}, humidity {message.weather.humidity}%{message.weather.rainChance != null ? `, rain chance ${message.weather.rainChance}%` : ""}. Forecasts can differ from field conditions.</span></div>}<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-3"><a href={message.advice.source.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-green-800 underline decoration-green-800/30 underline-offset-2">{message.advice.source.label}</a><Link to={message.advice.action.path} className="inline-flex items-center gap-1 text-xs font-bold text-green-800 hover:text-green-950">{message.advice.action.label}<ArrowRight size={14} /></Link></div></> : <p className="whitespace-pre-line text-sm leading-6 text-[#425047]">{message.text}</p>}
              </article>)}
              <div ref={bottomRef} />
            </div>

            {messages.length === 1 && <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-6">{STARTERS.map((item) => <button key={item.value} type="button" onClick={() => sendMessage(item.value)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-[#526157] transition hover:border-lime-400 hover:bg-lime-50 hover:text-green-900">{item.label}</button>)}</div>}

            <form onSubmit={onSubmit} className="border-t border-black/[0.06] bg-white p-4 sm:p-5">
              <div className="flex items-end gap-2 rounded-2xl border border-black/10 bg-[#fbfcfa] p-2 transition focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-700/10">
                <textarea rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(draft); } }} placeholder={language === "hi-IN" ? "अपनी खेती की समस्या लिखें या माइक दबाएँ…" : "Describe your farm problem, or tap the microphone…"} className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm outline-none placeholder:text-black/35" aria-label="Ask the farm assistant" />
                <button type="button" onClick={listening ? stopVoiceInput : startVoiceInput} aria-label={listening ? "Stop voice input" : "Ask by voice"} title={listening ? "Stop listening" : "Ask by voice"} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${listening ? "animate-pulse bg-red-100 text-red-700" : "bg-white text-green-800 shadow-sm ring-1 ring-black/5 hover:bg-lime-50"}`}>{listening ? <MicOff size={19} /> : <Mic size={19} />}</button>
                <button type="submit" disabled={!draft.trim() || sending} aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#092116] text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-40"><Send size={18} /></button>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1"><p role="status" className="text-xs text-black/45">{voiceMessage || (listening ? "Listening… your spoken words will be transcribed and sent when you finish." : "Voice transcription uses your browser’s speech recognition. Microphone permission may be required.")}</p><span className="text-[10px] text-black/35">Enter to send · Shift + Enter for a new line</span></div>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-black/[0.06] bg-white/85 p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.14em] text-green-800">Farm context</p><h2 className="mt-2 font-bold">{farmContext.farmName || "Your farm"}</h2><p className="mt-1 text-sm text-black/50">{farmContext.location || "No farm location saved yet"}</p>{farmContext.weather ? <div className="mt-4 flex items-center gap-3 rounded-xl bg-lime-50 p-3"><CloudSun className="text-green-800" size={20} /><div><p className="font-bold">{Math.round(farmContext.weather.temperature)}{farmContext.weather.unit} · {farmContext.weather.description}</p><p className="text-xs text-black/50">Humidity {farmContext.weather.humidity}%</p></div></div> : <Link to="/dashboard/weather" className="mt-4 inline-flex text-xs font-semibold text-green-800 underline underline-offset-2">Set up local weather</Link>}{farmContext.soilGuide && <div className="mt-3 rounded-xl bg-[#f5f8f3] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-green-800">Regional soil guide</p><p className="mt-1 text-sm font-semibold">{farmContext.soilGuide.soil}</p><p className="mt-1 text-xs leading-5 text-black/50">Broad regional guide; field soil testing is needed for specific advice.</p></div>}</section>
            <section className="rounded-2xl border border-black/[0.06] bg-white/85 p-5 shadow-sm"><div className="flex items-center gap-2"><Leaf size={17} className="text-green-800" /><h2 className="font-bold">For better guidance</h2></div><ul className="mt-3 space-y-2 text-xs leading-5 text-black/55"><li>Include crop and growth stage.</li><li>Describe when the issue began and how much area is affected.</li><li>Share recent rain, irrigation or fertilizer use.</li></ul></section>
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">This assistant offers general first steps, not a confirmed diagnosis or pesticide prescription. For severe or spreading problems, contact your district agriculture office or local KVK.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
