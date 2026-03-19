"use client";

import { useState } from "react";

interface SEOCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  recommendation?: string;
  steps?: string[];
}

interface SEOCategory {
  name: string;
  icon: string;
  score: number;
  checks: SEOCheck[];
}

interface PageSpeedData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface SEOResult {
  url: string;
  overallScore: number;
  categories: SEOCategory[];
  desktop?: PageSpeedData;
  mobile?: PageSpeedData;
}

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#27272A"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: getColor() }}>
          {score}
        </span>
      </div>
    </div>
  );
}

function CheckItem({ check, index }: { check: SEOCheck; index: number }) {
  const statusConfig = {
    pass: { icon: "✓", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
    warning: { icon: "!", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
    fail: { icon: "✗", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  };
  
  const config = statusConfig[check.status];
  const showSteps = check.status !== "pass" && check.steps && check.steps.length > 0;

  return (
    <div 
      className="flex items-start gap-3 py-3 border-b border-[#27272A] last:border-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#F4F4F5]">{check.name}</p>
        {check.recommendation && (
          <p className="text-xs text-[#A1A1AA] mt-1">{check.recommendation}</p>
        )}
        {showSteps && (
          <div className="mt-3 p-3 bg-[#0A0A0F] rounded-lg border border-[#27272A]">
            <p className="text-xs font-medium text-[#22D3EE] mb-2">How to fix:</p>
            <ul className="space-y-1">
              {check.steps?.map((step, idx) => (
                <li key={idx} className="text-xs text-[#A1A1AA] leading-relaxed">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category, index, isExpanded, onToggle }: { 
  category: SEOCategory; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getScoreColor = () => {
    if (category.score >= 80) return "#10B981";
    if (category.score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div 
      className="bg-[#12121A] rounded-xl border border-[#27272A] overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-[#1A1A24] transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="text-lg font-medium text-[#F4F4F5]">{category.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span 
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: `${getScoreColor()}20`, color: getScoreColor() }}
          >
            {category.score}
          </span>
          <span className="text-[#A1A1AA] transition-transform" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>
            ▼
          </span>
        </div>
      </button>
      <div 
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isExpanded ? "2000px" : "0", opacity: isExpanded ? 1 : 0 }}
      >
        <div className="px-5 pb-5">
          {category.checks.map((check, idx) => (
            <CheckItem key={idx} check={check} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-[#27272A] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#22D3EE] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-medium text-[#F4F4F5] mb-2">Analyzing Website</h3>
      <p className="text-[#A1A1AA] text-sm">Checking performance, meta tags, content, and more...</p>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");

  const validateUrl = (input: string): string => {
    let processed = input.trim();
    if (!processed.startsWith("http://") && !processed.startsWith("https://")) {
      processed = "https://" + processed;
    }
    try {
      new URL(processed);
      return processed;
    } catch {
      return "";
    }
  };

  const handleAnalyze = async () => {
    const validatedUrl = validateUrl(url);
    if (!validatedUrl) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validatedUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#27272A] bg-[#0A0A0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#22D3EE] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#0A0A0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#F4F4F5]">SEO Scout</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F4F4F5] mb-4">
            Analyze Your Website
          </h2>
          <p className="text-lg text-[#A1A1AA]">
            Get a comprehensive SEO audit for your new website
          </p>
        </div>

        <div className="bg-[#12121A] rounded-2xl border border-[#27272A] p-6 mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-xl px-5 py-4 text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all"
              />
              {url && (
                <button
                  onClick={() => setUrl("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#F4F4F5]"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="bg-[#22D3EE] text-[#0A0A0F] font-semibold px-8 py-4 rounded-xl hover:bg-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:animate-pulse-glow"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error && (
            <p className="text-[#EF4444] text-sm mt-3">{error}</p>
          )}
        </div>

        {loading && <LoadingState />}

        {result && !loading && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6">
              <p className="text-[#A1A1AA] mb-4">Overall SEO Score</p>
              <ScoreCircle score={result.overallScore} />
              
              {result.desktop && result.mobile && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab("desktop")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "desktop" 
                        ? "bg-[#22D3EE] text-[#0A0A0F]" 
                        : "bg-[#1A1A24] text-[#A1A1AA] hover:text-[#F4F4F5]"
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "mobile" 
                        ? "bg-[#22D3EE] text-[#0A0A0F]" 
                        : "bg-[#1A1A24] text-[#A1A1AA] hover:text-[#F4F4F5]"
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>
              )}
              
              {result.desktop && result.mobile && (
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-[#A1A1AA]">Desktop: {result.desktop.performance}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                    <span className="text-[#A1A1AA]">Mobile: {result.mobile.performance}%</span>
                  </div>
                </div>
              )}
              
              <p className="text-[#A1A1AA] text-sm mt-4">
                Analysis for <span className="text-[#22D3EE]">{result.url}</span>
              </p>
            </div>

            <div className="space-y-4">
              {result.categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  category={category}
                  index={index}
                  isExpanded={expandedCategory === index}
                  onToggle={() => setExpandedCategory(expandedCategory === index ? null : index)}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setResult(null);
                setUrl("");
                setActiveTab("desktop");
              }}
              className="w-full mt-8 py-4 border border-[#27272A] rounded-xl text-[#A1A1AA] hover:bg-[#1A1A24] hover:text-[#F4F4F5] transition-all"
            >
              Analyze Another Website
            </button>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12 border border-dashed border-[#27272A] rounded-2xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-[#F4F4F5] mb-2">Ready to Improve Your SEO</h3>
            <p className="text-[#A1A1AA] text-sm max-w-md mx-auto">
              Enter your website URL above to get a detailed analysis of your SEO performance and actionable recommendations.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-[#27272A] py-8 mt-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#71717A] text-sm">
            SEO Scout - Free SEO Analyzer for New Websites
          </p>
        </div>
      </footer>
    </div>
  );
}
