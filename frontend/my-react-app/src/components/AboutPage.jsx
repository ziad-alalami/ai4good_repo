import React from 'react';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
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

export default AboutPage;
