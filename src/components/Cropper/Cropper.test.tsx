import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cropper from './Cropper';

describe('<Cropper />', () => {
  test('it should mount', () => {
    render(<Cropper />);

    const Cropper = screen.getByTestId('Cropper');

    expect(Cropper).toBeInTheDocument();
  });
});