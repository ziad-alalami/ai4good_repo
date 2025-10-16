import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const AssessmentPage = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textAnswer, setTextAnswer] = useState('');

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
        setQuestions(questionsArray);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const getCategoryInfo = () => {
    if (!questions[currentQuestion]) return null;
    const category = questions[currentQuestion].category;
    const categoryQuestions = questions.filter(q => q.category === category);
    const currentInCategory = categoryQuestions.findIndex(
      q => q.id === questions[currentQuestion].id
    ) + 1;
    
    return {
      category,
      current: currentInCategory,
      total: categoryQuestions.length,
      displayName: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    setTextAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      handleAnswer(textAnswer);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && textAnswer.trim()) {
      handleTextSubmit();
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
      <div className="pt-24 text-center">
        <p className="text-lg text-gray-600">
          {language === 'en' ? 'Loading questions...' : 'جاري تحميل الأسئلة...'}
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg text-gray-600">
          {language === 'en' ? 'No questions available' : 'لا توجد أسئلة متاحة'}
        </p>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  const qText = language === 'en' ? question.question_en : question.question_ar;
  const choices = language === 'en' ? question.choices_list_en : question.choices_list_ar;
  const categoryInfo = getCategoryInfo();

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'en' ? 'Assessment' : 'التقييم'}
            </h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {categoryInfo.displayName}
            </span>
          </div>
          <p className="text-gray-600 mb-2">
            {language === 'en' 
              ? `Question ${categoryInfo.current} of ${categoryInfo.total} in this category`
              : `السؤال ${categoryInfo.current} من ${categoryInfo.total} في هذه الفئة`
            }
          </p>
          <p className="text-sm text-gray-500">
            {language === 'en' 
              ? `Overall: ${currentQuestion + 1} of ${questions.length}`
              : `الإجمالي: ${currentQuestion + 1} من ${questions.length}`
            }
          </p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{qText}</h3>

          {question.format === 'text' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder={language === 'en' ? 'Type your answer...' : 'اكتب إجابتك...'}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:outline-none"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textAnswer.trim()}
                className="w-full p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{language === 'en' ? 'Submit Answer' : 'إرسال الإجابة'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {choices.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all font-semibold text-gray-800 group"
                  style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors ${language === 'ar' ? 'transform rotate-180' : ''}`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;