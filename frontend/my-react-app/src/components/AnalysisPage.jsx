import React from 'react';
import { BarChart2, CheckCircle } from 'lucide-react';

const AnalysisPage = ({ results }) => {
  if (!results) {
    return (
      <div className="pt-24 px-4 text-center text-gray-600">
        <p>No results available yet. Complete the assessment first.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Analysis</h2>
        <p className="text-gray-600 mb-8">
          Here’s a breakdown of your assessment and recordings with personalized insights.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/> Assessment Results</h3>
            <ul className="list-disc list-inside space-y-2">
              {Object.entries(results.answers).map(([key, value]) => (
                <li key={key}><strong>Q{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600"/> Recording Summary</h3>
            <p className="text-gray-600 mb-4">You recorded {results.recordings.length} text samples. Each recording will be analyzed for clarity, pace, and pronunciation.</p>
            <ul className="list-disc list-inside space-y-2">
              {results.recordings.map((rec, idx) => (
                <li key={idx}>Text {idx + 1}: {rec.audio ? 'Recorded' : 'Missing'}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
