import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, CheckCircle, Send, Globe } from 'lucide-react';

const RecordingPage = ({ onSubmit }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [texts, setTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' },
  ];

  const fetchText = async (language) => {
    setIsLoading(true);
    setError('');
    try {
      // Replace with your actual backend URL
      const response = await fetch(`http://localhost:5000/request_text?lang=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch text from server');
      }
      const data = await response.json();
      setTexts([data["data"]]); // Store the text and phonemes
      setCurrentTextIndex(0);
      setRecordings([]);
    } catch (err) {
      setError('Could not fetch text. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    fetchText(langCode);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordings([...recordings, { 
          textIndex: currentTextIndex, 
          audio: audioBlob,
          text: texts[currentTextIndex].text,
          phonemes: texts[currentTextIndex].phonemes
        }]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && recordings.length > 0) {
      onSubmit(recordings, selectedLanguage);
    }
  };

  // Language selection screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Speech Analysis Tool</h1>
            <p className="text-xl text-gray-600">Select your language to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                disabled={isLoading}
                className="bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-600 rounded-xl p-6 text-center transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-2xl font-bold text-gray-900 mb-1">{lang.name}</div>
                <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading text...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Recording screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Record Your Speech</h2>
              <p className="text-gray-600">Language: {languages.find(l => l.code === selectedLanguage)?.name}</p>
            </div>
            <button
              onClick={() => {
                setSelectedLanguage('');
                setTexts([]);
                setRecordings([]);
                setCurrentTextIndex(0);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Change Language
            </button>
          </div>
        </div>

        {texts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading text...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 mb-6 border-l-4 border-indigo-600">
              <p className="text-xl text-gray-800 leading-relaxed font-medium mb-4">
                {texts[currentTextIndex].text}
              </p>
              <div className="bg-white/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 mb-1">Phonetic transcription:</p>
                <p className="text-base text-gray-700 font-mono">
                  {texts[currentTextIndex].phonemes}
                </p>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-3 transition-all transform hover:scale-105"
                >
                  <Mic className="w-6 h-6" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-3 transition-all animate-pulse"
                >
                  <MicOff className="w-6 h-6" />
                  Stop Recording
                </button>
              )}
            </div>

            {recordings.some(r => r.textIndex === currentTextIndex) && (
              <div className="mb-8 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-4">
                  <CheckCircle className="w-5 h-5" />
                  Recording completed
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2 text-center">Preview your recording:</p>
                  <audio 
                    controls 
                    className="w-full"
                    src={URL.createObjectURL(recordings.find(r => r.textIndex === currentTextIndex).audio)}
                  />
                </div>
              </div>
            )}

            {recordings.length > 0 && !isRecording && (
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  Submit for Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingPage;