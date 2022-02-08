import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './index';
import renderWithRouter from 'testing/util';

const authInfoNotAuthenticated = {
  isAuthenticated: false,
  isExistingUser: false,
  currentUser: null,
};

const authInfoAuthenticated = {
  isAuthenticated: true,
  isExistingUser: true,
  currentUser: {
    email: "test@email.com",
  },
}

const setIsAuthenticated = jest.fn();

describe('Login Page', () => {
  it('should render the Login Page with all form fields', async () => {
    render(<LoginPage authInfo={authInfoNotAuthenticated} setIsAuthenticated={setIsAuthenticated} />);
    expect(await screen.findByLabelText('Email')).toBeInTheDocument();
    expect(await screen.findByLabelText('Password')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('should allow the user to input a valid email and password', async () => {
    render(<LoginPage authInfo={authInfoNotAuthenticated} setIsAuthenticated={setIsAuthenticated} />);
    userEvent.type(await screen.findByLabelText('Email'), 'test@email.com');
    userEvent.type(await screen.findByLabelText('Password'), 'validpassword123');
    userEvent.click(await screen.findByRole('button', { name: 'Log In' }));
    await waitFor(() => expect(setIsAuthenticated).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(setIsAuthenticated).toHaveBeenCalledWith(true));
  });

  it('should render an error message when API returns an error', async () => {
    render(<LoginPage authInfo={authInfoNotAuthenticated} setIsAuthenticated={setIsAuthenticated} />);
    userEvent.type(await screen.findByLabelText('Email'), 'test@email.com');
    userEvent.type(await screen.findByLabelText('Password'), 'invalidpassword123');
    userEvent.click(await screen.findByRole('button', { name: 'Log In' }));
    expect(await screen.findByText('Log In Failed')).toBeInTheDocument();
  });

  it('should produce Dashboard Page redirect when the user is authenticated', async () => {
    renderWithRouter(
      <LoginPage authInfo={authInfoAuthenticated} setIsAuthenticated={setIsAuthenticated} />,
      { route: '/login' }
    );
    expect(await screen.findByTestId('location-display')).toHaveTextContent('Current location: /');
  });
});
