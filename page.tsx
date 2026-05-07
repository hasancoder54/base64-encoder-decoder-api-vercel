"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Gem, Terminal, Globe, ArrowRightLeft, Copy, Check } from "lucide-react";

const dictionaries = {
  tr: {
    title: "Base64 Protokolü",
    subtitle: "Veri Kodlama ve Çözümleme Ağı",
    encodeText: "Kodla (Encode)",
    decodeText: "Çöz (Decode)",
    placeholder: "İşlenecek veriyi buraya girin...",
    resultLabel: "Çıktı",
    apiDocs: "API Kullanımı",
    apiDesc: "Sisteminizden doğrudan HTTP POST isteği göndererek API'yi kullanabilirsiniz.",
    copied: "Kopyalandı!"
  },
  en: {
    title: "Base64 Protocol",
    subtitle: "Data Encoding and Decoding Network",
    encodeText: "Encode",
    decodeText: "Decode",
    placeholder: "Enter data to process here...",
    resultLabel: "Output",
    apiDocs: "API Documentation",
    apiDesc: "You can use the API directly from your system by sending an HTTP POST request.",
    copied: "Copied!"
  }
};

type Lang = "tr" | "en";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState<Lang>("tr");
  
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [action, setAction] = useState<"encode" | "decode">("encode");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const d = dictionaries[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/base64", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text: inputText }),
      });
      const data = await res.json();
      if (data.success) {
        setOutputText(data.result);
      } else {
        setOutputText(`Hata: ${data.error}`);
      }
    } catch (err) {
      setOutputText("Ağ Hatası.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 font-sans theme-transition">
      
      {/* Top Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 flex items-center gap-4"
      >
        <button 
          onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          className="p-2 rounded-full hover:bg-surface transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Globe size={18} /> {lang.toUpperCase()}
        </button>
        
        <div className="flex bg-surface rounded-full p-1 border border-foreground/10">
          <button onClick={() => setTheme("light")} className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-background text-accent' : 'text-foreground/60'}`}><Sun size={18} /></button>
          <button onClick={() => setTheme("dark")} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-background text-accent' : 'text-foreground/60'}`}><Moon size={18} /></button>
          <button onClick={() => setTheme("amethyst")} className={`p-2 rounded-full transition-colors ${theme === 'amethyst' ? 'bg-background text-accent' : 'text-foreground/60'}`}><Gem size={18} /></button>
          <button onClick={() => setTheme("hacker")} className={`p-2 rounded-full transition-colors ${theme === 'hacker' ? 'bg-background text-accent' : 'text-foreground/60'}`}><Terminal size={18} /></button>
        </div>
      </motion.div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-start mt-12">
        
        {/* Left Side: Interactions */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-foreground">{d.title}</h1>
            <p className="text-foreground/60 font-medium">{d.subtitle}</p>
          </div>

          <div className="flex bg-surface rounded-lg p-1 border border-foreground/10 w-fit">
            <button 
              onClick={() => setAction("encode")}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${action === "encode" ? 'bg-accent text-background shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
            >
              {d.encodeText}
            </button>
            <button 
              onClick={() => setAction("decode")}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${action === "decode" ? 'bg-accent text-background shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
            >
              {d.decodeText}
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={d.placeholder}
            className="w-full h-40 bg-surface border border-foreground/10 rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all"
          />

          <button 
            onClick={handleProcess}
            disabled={isLoading || !inputText}
            className="w-full bg-accent text-background py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <ArrowRightLeft size={20} />
              </motion.div>
            ) : (
              <ArrowRightLeft size={20} />
            )}
            {action === "encode" ? d.encodeText : d.decodeText}
          </button>
        </motion.div>

        {/* Right Side: Results & Wiki */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          <div className="relative">
            <label className="text-sm font-bold tracking-widest uppercase text-foreground/50 mb-2 block">{d.resultLabel}</label>
            <div className="w-full min-h-[160px] bg-surface border border-foreground/10 rounded-xl p-4 text-foreground break-words relative group">
              {outputText ? (
                <p className={theme === 'hacker' ? 'font-mono' : ''}>{outputText}</p>
              ) : (
                <p className="text-foreground/20 italic">...</p>
              )}
              
              <AnimatePresence>
                {outputText && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 bg-background border border-foreground/10 rounded-md text-foreground/70 hover:text-accent transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-surface/50 border border-foreground/10 rounded-xl p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
              <Terminal size={18} className="text-accent" /> {d.apiDocs}
            </h3>
            <p className="text-sm text-foreground/70 mb-4">{d.apiDesc}</p>
            <pre className="bg-background border border-foreground/10 p-4 rounded-lg overflow-x-auto text-xs font-mono text-foreground/90">
{`curl -X POST https://your-domain.vercel.app/api/base64 \\
-H "Content-Type: application/json" \\
-d '{"action": "encode", "text": "Hello World"}'`}
            </pre>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
