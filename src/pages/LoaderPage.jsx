
// src/pages/LoaderPage.jsx
import React from 'react';
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';

const LoaderPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <LineSpinner
        size="40"
        stroke="3"
        speed="1"
        color="white" // Use white to show on black background
      />
    </div>
  );
};

export default LoaderPage;
