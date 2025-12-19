
import React, { useState, useRef } from 'react';
import { InputData, InputMode } from '../types';

interface InputSectionProps {
  title: string;
  icon: React.ReactNode;
  placeholder: string;
  onDataChange: (data: InputData) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ title, icon, placeholder, onDataChange }) => {
  const [mode, setMode] = useState<InputMode>(InputMode.TEXT);
  const [text, setText] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; preview?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onDataChange({ text: newText });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFileInfo({ name: file.name, preview: base64.startsWith('data:image') ? base64 : undefined });
      onDataChange({ text: `File: ${file.name}`, image: base64.startsWith('data:image') ? base64 : undefined, fileName: file.name });
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      // For non-images in this specific POC, we assume OCR via Gemini for images only 
      // or simple text extraction if we had a library. 
      // We'll warn if it's not an image for file upload.
      alert("Note: For best results with non-image files like PDF/Word, please copy and paste the text into the text area. Direct PDF processing requires specialized parsers.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">{icon}</span>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="flex bg-gray-200 rounded-lg p-1 text-xs font-medium">
          <button
            onClick={() => setMode(InputMode.TEXT)}
            className={`px-3 py-1 rounded-md transition-all ${mode === InputMode.TEXT ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Text
          </button>
          <button
            onClick={() => setMode(InputMode.IMAGE)}
            className={`px-3 py-1 rounded-md transition-all ${mode === InputMode.IMAGE ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Image
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {mode === InputMode.TEXT ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full h-64 md:h-full p-4 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none transition-all placeholder:text-gray-400"
          />
        ) : (
          <div className="h-64 md:h-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gray-50/30">
            {fileInfo?.preview ? (
              <div className="relative group">
                <img src={fileInfo.preview} alt="Preview" className="max-h-48 rounded shadow-sm border border-gray-200" />
                <button 
                  onClick={() => setFileInfo(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Upload Resume Image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {fileInfo ? 'Change Image' : 'Select Image'}
            </button>
            
            {fileInfo && !fileInfo.preview && (
              <p className="text-xs font-medium text-blue-600">{fileInfo.name}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;
