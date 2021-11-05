import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const textElement = screen.getByText(/Crypto Tracker/i);
  expect(textElement).toBeInTheDocument();
});
