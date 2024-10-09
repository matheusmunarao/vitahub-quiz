import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Bem-vindo ao HealthyLife</h1>
      <p className="text-xl text-center text-white mb-8 max-w-2xl">
        Descubra seu caminho para uma vida mais saudável e longa. Nosso aplicativo personaliza planos alimentares baseados em suas necessidades únicas, focando em saúde, nutrição e longevidade.
      </p>
      <Button 
        onClick={() => navigate('/quiz')}
        className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Comece Seu Quiz de Saúde
      </Button>
    </div>
  );
};

export default Index;