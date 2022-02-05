import { screen, render } from '@testing-library/react';
import DashboardPage from './index';

describe('Dashboard Page', () => {
  it('should render the Dashboard Page title', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('Not Dashboard Page')).toBeInTheDocument();
  });
});
