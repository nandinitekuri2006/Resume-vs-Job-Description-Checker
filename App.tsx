
import React, { useState, useCallback } from 'react';
import InputSection from './components/InputSection';
import MatchResults from './components/MatchResults';
import { analyzeResumeMatch } from './services/geminiService';
import { AnalysisResult, InputData } from './types';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<InputData>({ text: '' });
  const [jdData, setJdData] = useState<InputData>({ text: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeData.text && !resumeData.image) {
      setError("Please provide your resume (text or image).");
      return;
    }
    if (!jdData.text && !jdData.image) {
      setError("Please provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeResumeMatch(resumeData, jdData);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    // Note: Local states in InputSections aren't reset by this, 
    // but a full UI reset is usually better handled via key rotation if needed.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">R</div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Resume<span className="text-blue-600">Match AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="max-w-5xl mx-auto pt-12 pb-8 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Beat the Applicant Tracking System.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your resume and the job description. Our AI analyzes the match percentage and gives you personalized tips to get more interviews.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Resume Input */}
          <InputSection
            title="My Resume"
            placeholder="Paste your resume text here, or upload an image of your resume..."
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>}
            onDataChange={setResumeData}
          />

          {/* JD Input */}
          <InputSection
            title="Job Description"
            placeholder="Paste the Job Description (JD) here to compare..."
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            onDataChange={setJdData}
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`
              group relative flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl
              ${loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 active:scale-95 shadow-blue-200'
              }
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Compatibility...</span>
              </>
            ) : (
              <>
                <svg className="group-hover:animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span>Check Matching Score</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100 text-sm font-medium animate-bounce">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <section id="results" className="mt-16 max-w-4xl mx-auto scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900">Analysis Results</h3>
              <button 
                onClick={handleReset}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                Run New Analysis
              </button>
            </div>
            <MatchResults result={result} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 ResumeMatch AI. Powered by Gemini. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
