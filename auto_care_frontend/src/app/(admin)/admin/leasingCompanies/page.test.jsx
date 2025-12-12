
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LeasingCompaniesPage from './page';
import { api } from '@/utils/axios';
import jest from 'jest';

jest.mock('@/utils/axios');

const mockCompanies = [
  {
    id: 1,
    username: 'Leasing Co 1',
    email: 'leasing1@example.com',
    createdAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 2,
    username: 'Leasing Co 2',
    email: 'leasing2@example.com',
    createdAt: '2024-01-02T12:00:00Z',
  },
];

describe('LeasingCompaniesPage', () => {
  it('renders the page title', () => {
    render(<LeasingCompaniesPage />);
    expect(screen.getByText('Leasing Companies')).toBeInTheDocument();
  });

  it('fetches and displays leasing companies', async () => {
    api.get.mockResolvedValue({ data: mockCompanies });
    render(<LeasingCompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Leasing Co 1')).toBeInTheDocument();
      expect(screen.getByText('Leasing Co 2')).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching fails', async () => {
    api.get.mockRejectedValue(new Error('Failed to fetch'));
    render(<LeasingCompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching leasing companies:')).toBeInTheDocument();
    });
  });
});
