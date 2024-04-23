// components/LoadingButton.js
import React, { useState } from 'react';

const LoadingButton = ({ }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Gantilah fungsi di bawah ini dengan fungsi sesungguhnya yang ingin Anda jalankan.
    //   await doSomething();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!isLoading && (
        <button
          onClick={handleClick}
          className="mb-4 px-4 py-2 text-white font-semibold bg-blue-600 rounded hover:bg-blue-700"
        >
          Go
        </button>
      )}

      {isLoading && (
        <div className="flex justify-center items-center">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-24 bg-gradient-to-r from-black to-white mx-2 rounded-full animate-wave"
              style={{ animationDelay: `${i / 10}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingButton;
