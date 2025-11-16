
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainScreen from './components/MainScreen';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#3a506b] flex flex-col items-center justify-center p-4 transition-all duration-500">
      {isStarted ? <MainScreen /> : <WelcomeScreen onStart={handleStart} />}
    </div>
  );
};

export default App;
