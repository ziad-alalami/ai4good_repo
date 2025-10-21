import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle, Send, Globe, ChevronRight, FileAudio, ClipboardList } from 'lucide-react';
import AudioRecorder from "react-use-audio-recorder";
import "react-use-audio-recorder/dist/index.css";

// RecordingPage Component
const RecordingPage = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [texts, setTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'عربي' }
  ];

  const handleSubmitRecording = async () => {
  if (recordings.length === 0) {
    alert('Please record your speech first.');
    return;
  }

  const recording = recordings[0]; // Assuming one text at a time
  const lang = selectedLanguage;
  
  const formData = new FormData();

  // Convert Blob to WAV File
  const wavFile = new File([recording.audio], 'audio.wav', { type: 'audio/wav' });

  // Prepare the data JSON string
  const payload = {
    data: { "0": { "answer": "male" } }, // You’ll replace this dynamically from assessment answers later
    text: recording.text,
    phonemes: recording.phonemes
  };

  formData.append('audio_file', wavFile);
  formData.append('data', JSON.stringify(payload));
  
  try {
    const response = await fetch(`http://localhost:5000/upload?lang=${lang}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errText}`);
    }

    const result = await response.json();
    console.log('Server response:', result);

    // Store the returned ID for later use
    const requestId = result?.data?.id;
    if (requestId) {
      localStorage.setItem('speech_request_id', requestId);
    }

    alert('Upload successful!');
    console.log('Stored request ID:', requestId);

  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed. Please try again.');
  }
};


  const fetchText = async (language) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/request_text?lang=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch text from server');
      }
      const data = await response.json();
      setTexts([data["data"]]);
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
        const formData = new FormData();
        formData.append('audio_file', audioBlob, 'recording.wav');

        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        console.log("adfdfadfadffa", mediaRecorderRef.current);
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
    if (onComplete && recordings.length > 0) {
      onComplete({ recordings, language: selectedLanguage });
    }
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Speech Recording</h1>
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
                  Continue to Assessment
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



const AssessmentPage = ({ onComplete }) => {
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categoryAnswers, setCategoryAnswers] = useState({});
  const [allAnswers, setAllAnswers] = useState({});
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:5000/questions');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        const questionsArray = Object.entries(data["data"]).map(([id, q]) => ({
          id,
          ...q
        }));
        
        let questionsFormed = {};
        for (let i = 0; i < questionsArray.length; i++) {
          let category = questionsArray[i].category;
          if (category in questionsFormed) {
            questionsFormed[category].push(questionsArray[i]);
          } else {
            questionsFormed[category] = [questionsArray[i]];
          }
        }
        
        setQuestionsByCategory(questionsFormed);
        setCategories(Object.keys(questionsFormed));
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const getCategoryInfo = () => {
    if (categories.length === 0) return null;
    const currentCategory = categories[currentCategoryIndex];
    
    return {
      category: currentCategory,
      displayName: currentCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      categoryNumber: currentCategoryIndex + 1,
      totalCategories: categories.length
    };
  };

  const handleAnswerChange = (questionId, value) => {
    setCategoryAnswers({
      ...categoryAnswers,
      [questionId]: value
    });
  };

  const handleCategorySubmit = () => {
    const currentCategory = categories[currentCategoryIndex];
    const categoryQuestions = questionsByCategory[currentCategory] || [];
    
    // Check if all questions in category are answered
    const allAnswered = categoryQuestions.every(q => categoryAnswers[q.id]);
    
    if (!allAnswered) {
      alert(language === 'en' 
        ? 'Please answer all questions before continuing.' 
        : 'يرجى الإجابة على جميع الأسئلة قبل المتابعة.');
      return;
    }

    // Save answers
    const newAllAnswers = { ...allAnswers, ...categoryAnswers };
    setAllAnswers(newAllAnswers);
    setCategoryAnswers({});

    // Move to next category or complete
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      onComplete({ answers: newAllAnswers, language });
    }
  };

  if (language === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Choose Your Language
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Select your preferred language for the assessment
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setLanguage('en')}
              className="w-full p-6 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">English</p>
                  <p className="text-sm text-gray-600">Continue in English</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className="w-full p-6 text-right bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
              dir="rtl"
            >
              <div className="flex items-center justify-between">
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors transform rotate-180" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">العربية</p>
                  <p className="text-sm text-gray-600">تابع بالعربية</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-lg text-gray-600">
          {language === 'en' ? 'Loading questions...' : 'جاري تحميل الأسئلة...'}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-lg text-gray-600">
          {language === 'en' ? 'No questions available' : 'لا توجد أسئلة متاحة'}
        </p>
      </div>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const categoryQuestions = questionsByCategory[currentCategory] || [];
  const categoryInfo = getCategoryInfo();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'en' ? 'Assessment' : 'التقييم'}
            </h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              {language === 'en' 
                ? `Category ${categoryInfo.categoryNumber} of ${categoryInfo.totalCategories}`
                : `الفئة ${categoryInfo.categoryNumber} من ${categoryInfo.totalCategories}`
              }
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {categoryInfo.displayName}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? `Answer all ${categoryQuestions.length} questions in this category`
              : `أجب على جميع الأسئلة الـ ${categoryQuestions.length} في هذه الفئة`
            }
          </p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentCategoryIndex) / categories.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {categoryQuestions.map((question, idx) => {
            const qText = language === 'en' ? question.question_en : question.question_ar;
            const choices = language === 'en' ? question.choices_list_en : question.choices_list_ar;
            
            return (
              <div key={question.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-900 flex-1">
                    {qText}
                  </h4>
                </div>

                {question.format === 'text' ? (
                  <div className="ml-12">
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Type your answer...' : 'اكتب إجابتك...'}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:outline-none"
                      value={categoryAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="ml-12 space-y-2">
                    {choices && choices.map((option, optIdx) => {
                      const isSelected = categoryAnswers[question.id] === option;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`w-full p-3 text-left rounded-lg font-medium transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-blue-500 border-2 border-indigo-600'
                              : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50'
                          }`}
                          style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCategorySubmit}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <span>
              {currentCategoryIndex < categories.length - 1
                ? (language === 'en' ? 'Next Category' : 'الفئة التالية')
                : (language === 'en' ? 'Complete Assessment' : 'إنهاء التقييم')
              }
            </span>
            <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};



// Parent Component
const SpeechAnalysisApp = ( {onComplete} ) => {
  const [step, setStep] = useState('welcome'); // 'welcome', 'recording', 'assessment', 'complete'
  const [recordingData, setRecordingData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordingComplete = (data) => {
    setRecordingData(data);
    setStep('complete');
  };

  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setStep('recording');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the data payload
      const formData = new FormData();
      formData.append('audio_file', recordingData.recordings[0].audio, 'recording.wav');
      formData.append('data', JSON.stringify({
        data: assessmentData.answers,
        text: recordingData.recordings[0].text,
        phonemes: recordingData.recordings[0].phonemes
      }));

      console.log('Submitting data:');
      for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
      
      // const payload = {
      //   data: {
      //     data: 
      //   },
      //   recording: {
      //     language: recordingData.language,
      //     recordings: recordingData.recordings[0]
      //   },
      //   assessment: {
      //     language: assessmentData.language,
      //     answers: assessmentData.answers
      //   }
     

      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('http://localhost:5000/submit_analysis', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      fetch('http://localhost:5000/upload?lang=en', {
          method: 'POST',
          body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Server error ${res.status}: ${err}`);
              }
             return res.json();
      })
      .then((data) => {
        console.log('Response from Flask:', data);
        onComplete(data);
      })
      .catch((err) => {
        console.error('Upload failed:', err);
      });
              
      
      
      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit data. Please try again.');
    } finally {
      setIsSubmitting(false);
      console.log("lalallalal")
      
    }
  };

  const handleRestart = () => {
    setStep('welcome');
    setRecordingData(null);
    setAssessmentData(null);
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Speech Analysis System</h1>
            <p className="text-xl text-gray-600">Complete both recording and assessment tasks</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-full p-3">
                  <FileAudio className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 1: Speech Recording</h3>
                  <p className="text-gray-600">Record your voice reading the provided text</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 2: Assessment Questions</h3>
                  <p className="text-gray-600">Answer questions about your experience</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('assessment')}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Recording Step
  if (step === 'recording') {
    return <RecordingPage onComplete={handleRecordingComplete} />;
  }

  // Assessment Step
  if (step === 'assessment') {
    return <AssessmentPage onComplete={handleAssessmentComplete} />;
  }

  // Complete Screen
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Tasks Complete!</h1>
            <p className="text-xl text-gray-600">Review your submission below</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recording Data</h3>
              <p className="text-gray-600">Language: {recordingData.language}</p>
              <p className="text-gray-600">Recordings: {recordingData.recordings.length}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Assessment Data</h3>
              <p className="text-gray-600">Language: {assessmentData.language}</p>
              <p className="text-gray-600">Answers: {Object.keys(assessmentData.answers).length}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit All Data
                </>
              )}
            </button>
            
            <button
              onClick={handleRestart}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SpeechAnalysisApp;