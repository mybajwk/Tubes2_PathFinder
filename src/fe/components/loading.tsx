import React from 'react';

const LoadingWave = () => {
  return (
    <div className="flex h-screen justify-center items-center bg-black">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1 h-24 bg-gradient-to-r from-cyan-500 to-white mx-2 rounded-full animate-wave`}
          style={{ animationDelay: `${i / 10}s` }}
        />
      ))}
    </div>
  );
};
