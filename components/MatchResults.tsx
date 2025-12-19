
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface MatchResultsProps {
  result: AnalysisResult;
}

const MatchResults: React.FC<MatchResultsProps> = ({ result }) => {
  const data = [
    { name: 'Match', value: result.matchPercentage },
    { name: 'Gap', value: 100 - result.matchPercentage },
  ];

  const COLORS = ['#3b82f6', '#e5e7eb'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(result.matchPercentage)}`}>
              {result.matchPercentage}%
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Match Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${getScoreBg(result.matchPercentage)} ${getScoreColor(result.matchPercentage)}`}>
              {result.jobTitleDetected || 'Candidate Profile'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">Match Analysis Summary</h2>
          </div>
          <p className="text-gray-600 leading-relaxed italic">"{result.summary}"</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="font-bold text-gray-800">Matching Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchingSkills.length > 0 ? (
              result.matchingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm italic">No significant matching skills identified.</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h3 className="font-bold text-gray-800">Missing Key Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length > 0 ? (
              result.missingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-100">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm italic">You have all the required skills mentioned!</span>
            )}
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3 className="font-bold text-gray-800">How to Improve & Tailor</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.improvementTips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 border border-gray-100">
                <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
