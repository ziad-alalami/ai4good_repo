import React from 'react';
import { Brain, Zap, Target, ChevronRight } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => {
  const features = [
    { icon: Brain, title: 'AI Analysis', desc: 'Smart feedback' },
    { icon: Zap, title: 'Instant Results', desc: 'Real-time insights' },
    { icon: Target, title: 'Personalized', desc: 'Custom guidance' },
  ];

  return (
    <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-screen-2xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
          <p className="text-sm font-semibold text-indigo-600">✨ AI-Powered Speech Therapy</p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Speak with <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Confidence</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group">
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

export default HeroSection;
