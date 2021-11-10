import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import axiosMock from 'axios';
import App from './App';

const setup = () => {
  axiosMock.get
    .mockImplementationOnce(() => Promise.resolve({
      status: 200,
      data: {"data": [{id: "AED", name: "United Arab Emirates Dirham", min_size: "0.01000000"},{id: "AFN", name: "Afghan Afghani", min_size: "0.01000000"}, {id: "ALL", name: "Albanian Lek", min_size: "0.01000000"}]}
    }))
    .mockImplementationOnce(() => Promise.resolve({
      status: 202,
      data: {"data": {"currency":"USD","rates":{"DOGE":"3.6569756811117204"}}}
    }));

  render(<App/>);

  const input = screen.getByRole('textbox', {
    name: /Search crypto currencies/i
  });
  const button = screen.getByRole('button', {
    name: /Add Tracking/i
  });
  const combobox = screen.getByRole('combobox');

  return {
    combobox,
    input,
    button
  }
};

test('renders default elements', async () => {
  const { input, button } = setup();

  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
  expect(axiosMock.get).toHaveBeenCalledTimes(2);
  expect(axiosMock.get).toHaveBeenCalledWith('https://api.coinbase.com/v2/currencies');
  expect(axiosMock.get).toHaveBeenCalledWith('https://api.coinbase.com/v2/exchange-rates');
});

test('default state input and disabled tracking button', async () => {
  const { input, button } = setup();
  fireEvent.change(input, { target: { value: 'aed' } });

  expect(input).toHaveValue('aed');
  expect(button).toBeDisabled();
});

test('choosing a suggestion enables the tracking button', async () => {
  const { input, button } = setup();
  fireEvent.change(input, { target: { value: 'ae' } })
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  const options = await screen.getByRole('presentation');
  expect(options).toHaveTextContent('United Arab Emirates Dirham (AED)');

  // select currency from options
  fireEvent.click(screen.getByText('United Arab Emirates Dirham (AED)'));

  expect(input).toHaveValue('United Arab Emirates Dirham (AED)');
  expect(button).not.toBeDisabled();
});

test('clicking the option and tracking button adds the item to the screen and clears option', async () => {
  const { input, button } = setup();
  fireEvent.change(input, { target: { value: 'ae' } })
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });

  const options = await screen.getByRole('presentation');
  expect(options).toHaveTextContent('United Arab Emirates Dirham (AED)');

  // select currency from options
  await fireEvent.click(screen.getByText('United Arab Emirates Dirham (AED)'));
  // click the tracking button
  await fireEvent.click(button);

  expect(input).toHaveValue('');
  expect(await screen.findByText('United Arab Emirates Dirham (AED)')).toBeVisible()
});
