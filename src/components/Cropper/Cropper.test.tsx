import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cropper from './Cropper.tsx';

describe("Cropper Component", () => {
  const mockOnCrop = jest.fn();
  const testImageSrc = "https://via.placeholder.com/300";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Cropper component with the image", () => {
    render(<Cropper src={testImageSrc} onCrop={mockOnCrop} />);

    // Check if the image is rendered
    const imgElement = screen.getByAltText("Crop Target");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", testImageSrc);
  });


  test("does not call onCrop if no cropping box was drawn", () => {
    render(<Cropper src={testImageSrc} onCrop={mockOnCrop} />);

    const cropper = screen.getByTestId("Cropper");

    // Only mouse down, no mouse move, and mouse up
    fireEvent.mouseDown(cropper, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(cropper);

    // Verify that the onCrop function was not called
    expect(mockOnCrop).not.toHaveBeenCalled();
  });

});