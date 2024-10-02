import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PlanDisplay from '../pages/PlanDisplay';
import { fetchAIPlan } from '../utils/aiIntegration';

jest.mock('../utils/aiIntegration');

const mockUserData = {
  prompt: 'Test prompt',
};

const renderWithContext = (component) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider value={{ userData: mockUserData }}>
        {component}
      </UserContext.Provider>
    </BrowserRouter>
  );
};

describe('PlanDisplay', () => {
  it('renders loading state', () => {
    fetchAIPlan.mockImplementation(() => new Promise(() => {}));
    renderWithContext(<PlanDisplay />);
    expect(screen.getByText('Gerando seu plano personalizado...')).toBeInTheDocument();
  });

  it('renders plan when API call is successful', async () => {
    const mockPlan = 'This is a test plan';
    fetchAIPlan.mockResolvedValue(mockPlan);

    renderWithContext(<PlanDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Seu Plano Alimentar Personalizado')).toBeInTheDocument();
      expect(screen.getByText(mockPlan)).toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    fetchAIPlan.mockRejectedValue(new Error('API Error'));

    renderWithContext(<PlanDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Erro')).toBeInTheDocument();
      expect(screen.getByText('Erro ao gerar plano: API Error')).toBeInTheDocument();
    });
  });
});