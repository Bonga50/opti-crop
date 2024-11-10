import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Cropper from './components/Cropper/Cropper.tsx';

function App() {
  const [coordinates, setCoordinates] = useState(null);

  const handleCrop = (cropCoordinates) => {
    console.log('Cropped coordinates:', cropCoordinates);
    setCoordinates(cropCoordinates);
  };

  return (
    <div className="App">
      <div>
      <h1>Image Cropper Demo</h1>
      <Cropper
        src="/800x600.png"// Example image URL
        onCrop={handleCrop}
      />
      {coordinates && (
        <div>
          <h2>Cropped Coordinates</h2>
          <pre>{JSON.stringify(coordinates, null, 2)}</pre>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
