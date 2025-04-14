import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import * as authService from '../services/authService';
import { vi } from 'vitest';

// Mock navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock signUp service
vi.mock('../services/authService');

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

  it('renders all input fields and button', () => {
    setup();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates input values correctly', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Mohan' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mohan@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });

    expect(screen.getByLabelText(/name/i).value).toBe('Mohan');
    expect(screen.getByLabelText(/email/i).value).toBe('mohan@example.com');
    expect(screen.getByLabelText(/^password$/i).value).toBe('pass123');
    expect(screen.getByLabelText(/confirm password/i).value).toBe('pass123');
  });

  it('shows error when passwords do not match', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'xyz456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('navigates to SignIn on successful signup', async () => {
    authService.signUp.mockResolvedValue({ data: {} });

    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Mohan' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mohan@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/signin');
    });
  });

  it('displays error when signup fails', async () => {
    authService.signUp.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Mohan' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mohan@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during signup', async () => {
    authService.signUp.mockImplementation(() => new Promise(() => {})); // pending promise

    setup();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Mohan' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mohan@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing up/i })).toBeInTheDocument();
    });
  });
});
