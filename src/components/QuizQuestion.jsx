import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const QuizQuestion = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{question.text}</h2>
      {question.type === 'text' && (
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      )}
      {question.type === 'select' && (
        <Select
          value={answer}
          onValueChange={setAnswer}
          required
        >
          {question.options.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      )}
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
        Próxima
      </Button>
    </form>
  );
};

export default QuizQuestion;