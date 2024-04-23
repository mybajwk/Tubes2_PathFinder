import React, { useState } from 'react';
import { Button } from '@nextui-org/react'; // Import Button from Next UI

const LoadingButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Replace this placeholder with the actual function you want to run.
      // await doSomething();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(true); // Ensure loading state is reset after the operation
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!isLoading && (
        <Button
          onClick={handleClick}
          color="default"
          variant="ghost"
          size="lg"
        >
          GO
        </Button>
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
