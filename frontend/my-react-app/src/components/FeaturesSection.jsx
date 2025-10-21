import React from 'react';
import { Brain, Mic, BarChart3, ChevronRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    { title: 'Smart Assessment', description: 'Personalized questionnaire to understand your unique speech patterns and challenges.', icon: Brain, color: 'from-indigo-500 to-indigo-600' },
    { title: 'Voice Recording', description: 'Record your voice with crystal-clear quality and get instant feedback on pronunciation.', icon: Mic, color: 'from-blue-500 to-blue-600' },
    { title: 'AI Analysis', description: 'Advanced algorithms analyze clarity, pacing, articulation, and provide actionable insights.', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How SpeakClear Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to improve your speech and gain confidence in communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all">
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

export default FeaturesSection;
