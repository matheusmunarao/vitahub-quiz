import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { fetchAIPlan } from '../utils/aiIntegration';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PlanDisplay = () => {
  const { userData } = useContext(UserContext);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/');
      return;
    }

    const getPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const aiPlan = await fetchAIPlan(userData.answers);
        setPlan(aiPlan);
      } catch (error) {
        console.error('Erro em PlanDisplay:', error);
        setError(error.message);
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
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
              <br />
              Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: plan }} />
        )}
        <div className="mt-8 flex justify-between">
          <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600">
            Voltar para o Início
          </Button>
          {!error && (
            <Button onClick={() => window.print()} className="bg-blue-500 hover:bg-blue-600">
              Imprimir Plano
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;