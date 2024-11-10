import React, { FC, useRef, useState } from "react";
import { CropperWrapper } from "./Cropper.styled.ts";

interface Coordinates {
  x: number;
  y: number;
}

interface CropBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface CropperProps {
  src: string;
  onCrop: (coordinates: {
    topLeft: Coordinates;
    topRight: Coordinates;
    bottomLeft: Coordinates;
    bottomRight: Coordinates;
  }) => void;
}

const Cropper: FC<CropperProps> = ({ src, onCrop }) => {
  const [cropBox, setCropBox] = useState<CropBox | null>(null);
  const [startPoint, setStartPoint] = useState<Coordinates | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const imgBounds = imgRef.current!.getBoundingClientRect();
    console.log("image bounds:",imgBounds);
    console.log(e.clientX , e.clientY);
    const x = e.clientX - imgBounds.left;
    const y = e.clientY - imgBounds.top;
    console.log("Start point: X", x,"y:", y);
    setStartPoint({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
   if (!startPoint || !imgRef.current) return;
 
   const imgBounds = imgRef.current.getBoundingClientRect();
   const imgWidth = imgBounds.width;
   const imgHeight = imgBounds.height;
 
   const x = e.clientX - imgBounds.left;
   const y = e.clientY - imgBounds.top;
 
   // Calculate new crop box coordinates
   const newX1 = Math.min(startPoint.x, x);
   const newY1 = Math.min(startPoint.y, y);
   const newX2 = Math.max(startPoint.x, x);
   const newY2 = Math.max(startPoint.y, y);
 
   // Constrain coordinates to image boundaries
   const constrainedX1 = Math.max(0, newX1);
   const constrainedY1 = Math.max(0, newY1);
   const constrainedX2 = Math.min(imgWidth, newX2);
   const constrainedY2 = Math.min(imgHeight, newY2);
 
   setCropBox({
     x1: constrainedX1,
     y1: constrainedY1,
     x2: constrainedX2,
     y2: constrainedY2,
   });
 };

  const handleMouseUp = () => {
    if (!cropBox || !imgRef.current) return;

    const imgBounds = imgRef.current.getBoundingClientRect();
    const imgWidth = imgBounds.width;
    const imgHeight = imgBounds.height;

    // Center coordinates (0,0)
    const centerX = imgWidth / 2;
    const centerY = imgHeight / 2;

    const cropCoordinates = {
      topLeft: {
        x: cropBox.x1 - centerX,
        y: centerY - cropBox.y1,
      },
      topRight: {
        x: cropBox.x2 - centerX,
        y: centerY - cropBox.y1,
      },
      bottomLeft: {
        x: cropBox.x1 - centerX,
        y: centerY - cropBox.y2,
      },
      bottomRight: {
        x: cropBox.x2 - centerX,
        y: centerY - cropBox.y2,
      },
    };

    onCrop(cropCoordinates);
    setStartPoint(null);
    setCropBox(null);
    cropImage(cropBox);
  };

  const cropImage = (cropBox: CropBox) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (canvas && img) {
      const ctx = canvas.getContext("2d");
      //const imgBounds = img.getBoundingClientRect();

      // Calculate cropping width and height
      const cropWidth = cropBox.x2 - cropBox.x1;
      const cropHeight = cropBox.y2 - cropBox.y1;

      // Resize the canvas to match the crop area
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Clear the canvas
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the cropped area of the image onto the canvas
      ctx!.drawImage(
        img,
        cropBox.x1,
        cropBox.y1,
        cropWidth,
        cropHeight, // Source area from the image
        0,
        0,
        cropWidth,
        cropHeight // Destination area on the canvas
      );

      // Convert the canvas content to a data URL and store it as croppedImage
      const croppedDataUrl = canvas.toDataURL();
      setCroppedImage(croppedDataUrl);
    }
  };

  return (
    <CropperWrapper
      data-testid="Cropper"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Crop Target"
        style={{ display: "block", maxWidth: "auto", height: "auto" }}
        onDragStart={(e) => e.preventDefault()}
      />
      {cropBox && (
        <div
          style={{
            position: "absolute",
            left: cropBox.x1 ,
            top: cropBox.y1 + 85,
            width: cropBox.x2 - cropBox.x1,
            height: cropBox.y2 - cropBox.y1,
            border: "2px dashed #000",
            pointerEvents: "none",
          }}
        />
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {croppedImage && (
        <div style={{ marginTop: "20px" }}>
          <h2>Cropped Image:</h2>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </CropperWrapper>
  );
};

export default Cropper;
