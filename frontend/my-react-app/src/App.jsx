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

import AssessmentPage from './components/AssessmentPage';
import RecordingPage from './components/RecordingPage';
import SpeechAnalysisApp from './components/SpeechAnalysisApp';

import React, { useState, useRef, useEffect } from 'react';
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



// Recording Component


// Analysis Component
import { Globe, AlertCircle, TrendingUp, BookOpen, Users } from 'lucide-react';
import {  MessageCircle } from 'lucide-react';

const AnalysisPage = ({ onRestart, analysis }) => {
  const [language, setLanguage] = useState('ar');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const isArabic = language === 'ar';
  const data = analysis;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: analysis.data.id,
          message: inputMessage
        })
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log("mes", responseData.data)
        setMessages(prev => [...prev, { role: 'assistant', content: responseData.data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: isArabic ? 'عذراً، حدث خطأ. حاول مرة أخرى.' : 'Sorry, an error occurred. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: isArabic ? 'فشل الاتصال. تحقق من اتصالك بالإنترنت.' : 'Connection failed. Check your internet connection.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!data) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">No analysis data available</p>
        </div>
      </div>
    );
  }
  console.log("aa", analysis);
  const overview = isArabic ? analysis.data.agent_response.overview_ar : analysis.data.agent_response.overview_en;
  const disorders = isArabic ? analysis.data.agent_response.disorders_ar : analysis.data.agent_response.disorders_en;
  const recommendations = isArabic ? analysis.data.agent_response.recommendations_ar : analysis.data.agent_response.recommendations_en;
  const rootCauses = isArabic ? analysis.data.agent_response.root_causes_ar : analysis.data.agent_response.root_causes_en;
  const speechRateComp = isArabic ? analysis.data.agent_response.speech_rate_comparison_ar : analysis.data.agent_response.speech_rate_comparison_en;

  const metrics = [
    { 
      label: isArabic ? 'معدل الكلام' : 'Speech Rate', 
      value: Math.round(analysis.data.speech_rate),
      unit: 'WPM'
    },
    { 
      label: isArabic ? 'معدل الصوتيات' : 'Phoneme Rate', 
      value: Math.round(analysis.data.phoneme_rate),
      unit: '/min'
    },
    { 
      label: isArabic ? 'احتمال عسر التلفظ' : 'Dysarthria Prob', 
      value: Math.round(analysis.data.dysarthria_prob * 100),
      unit: '%'
    },
    { 
      label: isArabic ? 'حالة المعدل' : 'Rate Status', 
      value: isArabic ? analysis.data.agent_response.speech_rate_severity_ar : analysis.data.agent_response.speech_rate_severity,
      unit: ''
    },
  ];

  return (
    <div className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Language Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              {isArabic ? 'نتائج التحليل' : 'Analysis Results'}
            </h2>
          </div>
          
          <button
            onClick={() => setLanguage(lang => lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">{isArabic ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <p className="text-gray-600 text-sm font-medium mb-2">{metric.label}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {metric.value}
              </p>
              {metric.unit && <p className="text-xs text-gray-500 mt-1">{metric.unit}</p>}
            </div>
          ))}
        </div>

        {/* Overview */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">
              {isArabic ? 'نظرة عامة' : 'Overview'}
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{overview}</p>
        </div>

        {/* Speech Rate Comparison */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              {isArabic ? 'مقارنة معدل الكلام' : 'Speech Rate Comparison'}
            </h3>
          </div>
          <p className="text-gray-700">{speechRateComp}</p>
        </div>

        {/* Disorders */}
        {disorders && disorders.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'الاضطرابات المحتملة' : 'Potential Disorders'}
              </h3>
            </div>
            {disorders.map((disorder, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{disorder.disorder_name}</h4>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {isArabic ? 'الأعراض:' : 'Symptoms:'}
                  </p>
                  <ul className="space-y-1">
                    {disorder.disorder_symptoms.map((symptom, i) => (
                      <li key={i} className="text-gray-700 text-sm pr-4 relative before:content-['•'] before:absolute before:right-0">
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {isArabic ? 'المؤشرات:' : 'Indicators:'}
                  </p>
                  <ul className="space-y-1">
                    {disorder.disorder_pointers.map((pointer, i) => (
                      <li key={i} className="text-gray-700 text-sm pr-4 relative before:content-['•'] before:absolute before:right-0">
                        {pointer}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {isArabic ? 'الأسباب المحتملة:' : 'Possible Causes:'}
                  </p>
                  <ul className="space-y-1">
                    {disorder.disorder_lying_causes.map((cause, i) => (
                      <li key={i} className="text-gray-700 text-sm pr-4 relative before:content-['•'] before:absolute before:right-0">
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Root Causes */}
        {rootCauses && rootCauses.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'الأسباب الجذرية' : 'Root Causes'}
              </h3>
            </div>
            {rootCauses.map((item, idx) => (
              <div key={idx} className="mb-4 last:mb-0 p-4 bg-purple-50 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">{item.cause}</p>
                <p className="text-gray-700 text-sm">{item.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">
              {isArabic ? 'التوصيات' : 'Recommendations'}
            </h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`p-5 rounded-lg border-l-4 ${
                rec.priority === 'Top' || rec.priority === 'عالي' 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                    rec.priority === 'Top' || rec.priority === 'عالي'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}>
                    {rec.priority}
                  </span>
                  <p className="font-semibold text-gray-800 flex-1">{rec.recommendation}</p>
                </div>
                
                {rec.tips && rec.tips.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {isArabic ? 'نصائح:' : 'Tips:'}
                    </p>
                    <ul className="space-y-1">
                      {rec.tips.map((tip, i) => (
                        <li key={i} className="text-gray-700 text-sm pr-4 relative before:content-['→'] before:absolute before:right-0">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.resources_or_links && rec.resources_or_links.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {isArabic ? 'موارد:' : 'Resources:'}
                    </p>
                    {rec.resources_or_links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline block"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        {data.references_and_resources_links && data.references_and_resources_links.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'مراجع ومصادر إضافية' : 'References & Resources'}
              </h3>
            </div>
            <div className="space-y-2">
              {data.references_and_resources_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-indigo-600 hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-xl text-white font-bold py-4 px-6 rounded-xl transition-all"
        >
          {isArabic ? 'بدء تقييم جديد' : 'Start New Assessment'}
        </button>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {showChat && (
        <div className={`fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 ${isArabic ? 'rtl' : 'ltr'}`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-xl">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {isArabic ? 'المساعد الذكي' : 'AI Assistant'}
            </h3>
            <p className="text-xs text-indigo-100 mt-1">
              {isArabic ? 'اسأل عن نتائج التحليل' : 'Ask about your analysis results'}
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                {isArabic ? 'ابدأ محادثة بسؤال عن نتائجك' : 'Start a conversation by asking about your results'}
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isArabic ? 'اكتب سؤالك هنا...' : 'Type your question...'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function App() {
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [analysis, setAnalysis] = useState({});

  const handleGetStarted = () => {
    setPage('assessment');
  };

  const handleAssessmentComplete = (analysis) => {
    setPage('analysis');
    setAnalysis(analysis)
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

      {page === 'assessment' && <SpeechAnalysisApp onComplete={handleAssessmentComplete} />}

      {page === 'recording' && <RecordingPage onSubmit={handleSubmitAnalysis} />}

      {page === 'analysis' && <AnalysisPage onRestart={handleRestart} analysis={analysis} />}

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
