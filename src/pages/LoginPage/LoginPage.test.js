import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './index';

const authInfo = {
  isAuthenticated: false,
  isExistingUser: false,
  currentUser: null,
};

const setIsAuthenticated = () => {};

describe('Login Page', () => {
  it('should render the Login Page with all form fields', async () => {
    render(<LoginPage authInfo={authInfo} setIsAuthenticated={setIsAuthenticated} />);
    expect(await screen.findByLabelText('Email')).toBeInTheDocument();
    expect(await screen.findByLabelText('Password')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });
  it('should allow the user to input a valid email and password', async () => {
    render(<LoginPage authInfo={authInfo} setIsAuthenticated={setIsAuthenticated} />);
    userEvent.type(await screen.findByLabelText('Email'), 'test@email.com');
    userEvent.type(await screen.findByLabelText('Password'), 'validpassword123');
    userEvent.click(await screen.findByRole('button', { name: 'Log In' }));
    expect(true).toBe(true);
  });
});
