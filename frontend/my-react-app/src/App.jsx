// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState, useRef } from 'react';
import { Menu, X, Mic, MicOff, CheckCircle, BarChart3, Send, Home, ChevronRight, Brain, Zap, Target } from 'lucide-react';
// Note: Assuming Tailwind CSS setup for styling, as 'index.css' is referenced but not provided.

// Navigation Component
const Navigation = ({ currentPage, setPage, setMenuOpen, menuOpen }) => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2 rounded-lg">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              SpeakClear
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setPage('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setPage('about')}
              className={`font-medium transition-colors ${
                currentPage === 'about' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              About
            </button>
            {currentPage !== 'home' && (
              <button
                onClick={() => setPage('home')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Back
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => {
                setPage('home');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                setPage('about');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
            >
              About
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Increased max-width from max-w-7xl to max-w-screen-2xl to allow content to stretch further on wide screens (1536px) */}
      <div className="max-w-screen-2xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
          <p className="text-sm font-semibold text-indigo-600">✨ AI-Powered Speech Therapy</p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Speak with
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Confidence</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Advanced AI analysis to help you overcome speech challenges and improve your communication skills with personalized feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-full hover:shadow-xl transition-all transform hover:scale-105"
          >
            Get Started
          </button>
          <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full border-2 border-indigo-600 hover:bg-indigo-50 transition">
            Learn More
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Brain, title: 'AI Analysis', desc: 'Smart feedback' },
            { icon: Zap, title: 'Instant Results', desc: 'Real-time insights' },
            { icon: Target, title: 'Personalized', desc: 'Custom guidance' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      title: 'Smart Assessment',
      description: 'Personalized questionnaire to understand your unique speech patterns and challenges.',
      icon: Brain,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Voice Recording',
      description: 'Record your voice with crystal-clear quality and get instant feedback on pronunciation.',
      icon: Mic,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'AI Analysis',
      description: 'Advanced algorithms analyze clarity, pacing, articulation, and provide actionable insights.',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50">
      {/* Increased max-width from max-w-7xl to max-w-screen-2xl to allow content (especially the card grid) to stretch further on wide screens (1536px) */}
      <div className="max-w-screen-2xl mx-auto"> 
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How SpeakClear Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to improve your speech and gain confidence in communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Page Component
const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* max-w-4xl is good for text readability, correctly centered */}
      <div className="max-w-4xl mx-auto"> 
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About SpeakClear</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            SpeakClear is an innovative AI-powered solution designed to help individuals with speech difficulties overcome communication challenges and build confidence in their daily interactions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide accessible, personalized speech therapy through cutting-edge AI technology, empowering individuals to communicate with clarity and confidence.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world where speech challenges don't limit potential. We believe everyone deserves the tools and support to communicate effectively.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Technology at the Heart</h3>
          <p className="text-lg opacity-90">
            Built with advanced machine learning algorithms that analyze speech patterns, pronunciation, pacing, and articulation to provide real-time, actionable feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

// Assessment Component
const AssessmentPage = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 1, question: 'How often do you experience speech difficulty?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
    { id: 2, question: 'Which sounds are most challenging for you?', options: ['Consonants', 'Vowels', 'Mixed', 'Unclear'] },
    { id: 3, question: 'How long have you had this condition?', options: ['Less than 6 months', '6-12 months', '1-2 years', 'More than 2 years'] },
  ];

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* FIX: Increased width from max-w-2xl to max-w-3xl for a more expansive form layout on desktop */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment</h2>
          <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all font-semibold text-gray-800 group"
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Recording Component
const RecordingPage = ({ onSubmit }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const texts = [
    'Please read this sentence clearly: The quick brown fox jumps over the lazy dog.',
    'Try pronouncing this carefully: She sells seashells by the seashore.',
    'Read at a comfortable pace: Peter Piper picked a peck of pickled peppers.',
  ];

  // Custom function to show alert message in a non-blocking way (replacing standard alert)
  const showMicrophoneError = (message) => {
    console.error(message);
    // In a real app, this would be a custom toast/modal
    // Since we cannot use alert(), we'll rely on the UI update or console log for error visibility.
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
        // Use audio/mpeg for broader compatibility if WAV isn't strictly needed, 
        // but sticking to 'audio/wav' as per original code for minimal change.
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); 
        setRecordings([...recordings, { textIndex: currentTextIndex, audio: audioBlob }]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      showMicrophoneError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks to release the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      // Automatically advance to the next text after stopping, if not the last one
      if (currentTextIndex < texts.length - 1) {
        // Timeout ensures the recording is saved before moving to the next text visually
        setTimeout(() => setCurrentTextIndex(currentTextIndex + 1), 300);
      }
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* FIX: Increased width from max-w-2xl to max-w-3xl for a more expansive form layout on desktop */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Record Your Speech</h2>
          <p className="text-gray-600">Recording {currentTextIndex + 1} of {texts.length}</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentTextIndex + 1) / texts.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 mb-8 border-l-4 border-indigo-600">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              {texts[currentTextIndex]}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-3 transition-all transform hover:scale-105"
                disabled={currentTextIndex === texts.length} // Disable if all recordings are done
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

          {/* This check confirms the current text index has a recording associated with it */}
          {recordings.some(r => r.textIndex === currentTextIndex) && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-8 animate-in fade-in">
              <CheckCircle className="w-5 h-5" />
              Recording saved for this text
            </div>
          )}

          <div className="flex gap-4">
            {currentTextIndex === texts.length - 1 && recordings.length === texts.length && !isRecording && (
              <button
                onClick={onSubmit}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                Submit for Analysis
              </button>
            )}
            {/* Remove the redundant 'Next Text' button logic since `stopRecording` handles auto-advance */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Analysis Component
const AnalysisPage = ({ onRestart }) => {
  const analysis = {
    overall: 87,
    clarity: 82,
    pacing: 90,
    articulation: 85,
    suggestions: [
      'Work on consonant clarity, especially with "s" and "th" sounds',
      'Practice slow, deliberate pronunciation of complex words',
      'Maintain consistent pacing throughout longer sentences',
    ],
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* max-w-3xl is good for dashboards, correctly centered */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-3 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">Your Results</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Overall Score', value: analysis.overall },
            { label: 'Clarity', value: analysis.clarity },
            { label: 'Pacing', value: analysis.pacing },
            { label: 'Articulation', value: analysis.articulation },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all animate-in fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <p className="text-gray-600 font-semibold mb-2">{metric.label}</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {metric.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">/ 100</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8 animate-in fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h3>
          <div className="space-y-4">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-800">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-xl text-white font-bold py-4 px-6 rounded-lg transition-all"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setPage('assessment');
  };

  const handleAssessmentComplete = (answers) => {
    setPage('recording');
  };

  const handleSubmitAnalysis = () => {
    setPage('analysis');
  };

  const handleRestart = () => {
    setPage('home');
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      <Navigation currentPage={page} setPage={setPage} setMenuOpen={setMenuOpen} menuOpen={menuOpen} />

      {page === 'home' && (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <FeaturesSection />
        </>
      )}

      {page === 'about' && <AboutPage />}

      {page === 'assessment' && <AssessmentPage onComplete={handleAssessmentComplete} />}

      {page === 'recording' && <RecordingPage onSubmit={handleSubmitAnalysis} />}

      {page === 'analysis' && <AnalysisPage onRestart={handleRestart} />}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">© 2025 SpeakClear. All rights reserved.</p>
          <p className="text-sm">Empowering clear communication through AI</p>
        </div>
      </footer>
    </div>
  );
}
