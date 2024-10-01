import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import QuizQuestion from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import { quizQuestions } from '../utils/quizQuestions';
import { UserContext } from '../context/UserContext';
import { generateAIPrompt } from '../utils/aiIntegration';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [quizQuestions[currentQuestion].id]: answer });
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const prompt = generateAIPrompt(answers);
    setUserData({ answers, prompt });
    navigate('/plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <ProgressBar current={currentQuestion + 1} total={quizQuestions.length} />
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <QuizQuestion
          question={quizQuestions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
      {currentQuestion > 0 && (
        <Button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Voltar
        </Button>
      )}
    </div>
  );
};

export default Quiz;