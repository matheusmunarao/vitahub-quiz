import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { fetchAIPlan } from '../utils/aiIntegration';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const PlanDisplay = () => {
  const { userData } = useContext(UserContext);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/');
      return;
    }

    const getPlan = async () => {
      try {
        const aiPlan = await fetchAIPlan(userData.prompt);
        setPlan(aiPlan);
      } catch (error) {
        console.error('Error fetching AI plan:', error);
        setPlan('Ocorreu um erro ao gerar seu plano. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    getPlan();
  }, [userData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-green-600">Gerando seu plano personalizado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Seu Plano Alimentar Personalizado</h1>
        <pre className="whitespace-pre-wrap font-sans text-gray-700">{plan}</pre>
        <div className="mt-8 flex justify-between">
          <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600">
            Voltar para o Início
          </Button>
          <Button onClick={() => window.print()} className="bg-blue-500 hover:bg-blue-600">
            Imprimir Plano
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;