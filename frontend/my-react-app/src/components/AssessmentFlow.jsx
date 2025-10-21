import React, { useState, useRef } from 'react';
import { Mic, MicOff, CheckCircle, ChevronRight, Send } from 'lucide-react';

const AssessmentFlow = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState('assessment'); // 'assessment' or 'recording'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const questions = [
    { id: 1, question: 'How often do you experience speech difficulty?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
    { id: 2, question: 'Which sounds are most challenging for you?', options: ['Consonants', 'Vowels', 'Mixed', 'Unclear'] },
    { id: 3, question: 'How long have you had this condition?', options: ['Less than 6 months', '6-12 months', '1-2 years', 'More than 2 years'] },
  ];

  const texts = [
    'Please read this sentence clearly: The quick brown fox jumps over the lazy dog.',
    'Try pronouncing this carefully: She sells seashells by the seashore.',
    'Read at a comfortable pace: Peter Piper picked a peck of pickled peppers.',
  ];

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to recording step after assessment
      setCurrentStep('recording');
    }
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
        setRecordings([...recordings, { textIndex: currentTextIndex, audio: audioBlob }]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      if (currentTextIndex < texts.length - 1) {
        setTimeout(() => setCurrentTextIndex(currentTextIndex + 1), 300);
      }
    }
  };

  const handleSubmit = () => {
    onSubmit({ answers, recordings });
  };

  // Assessment Step
  if (currentStep === 'assessment') {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment</h2>
          <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in mt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{questions[currentQuestion].question}</h3>
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
  }

  // Recording Step
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Record Your Speech</h2>
        <p className="text-gray-600">Recording {currentTextIndex + 1} of {texts.length}</p>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
            style={{ width: `${((currentTextIndex + 1) / texts.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in mt-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 mb-8 border-l-4 border-indigo-600">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">{texts[currentTextIndex]}</p>
          </div>

          <div className="flex justify-center mb-8">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-3 transition-all transform hover:scale-105"
                disabled={currentTextIndex === texts.length} 
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
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-8 animate-in fade-in">
              <CheckCircle className="w-5 h-5" />
              Recording saved for this text
            </div>
          )}

          {currentTextIndex === texts.length - 1 && recordings.length === texts.length && !isRecording && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-5 h-5" />
              Submit for Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
