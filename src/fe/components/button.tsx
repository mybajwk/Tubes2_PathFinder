import React, { useState } from 'react';
import { Button } from '@nextui-org/react'; // Import Button from Next UI

interface LoadingButtonProps {
  handleSearch: () => Promise<void>; // Define the type of handleSearch
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ handleSearch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);  // Set loading to true when the operation starts
    try {
      await handleSearch(); // Execute the function passed as prop
    } catch (error) {
      console.error(error); // Log any errors encountered during the operation
    } finally {
      setIsLoading(false); // Reset loading to false after the operation, regardless of outcome
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!isLoading ? (
        <Button
          onClick={handleClick}
          color="default"
          variant="ghost"
          size="lg"
        >
          <p className="font-bold text-inherit text-green-500">GO</p>
        </Button>
      ) : (
        <div className="flex justify-center items-center">
          {/* Assuming you want to show a loading animation or similar feedback */}
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
