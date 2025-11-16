
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold text-[#4a69bd] mb-4">
        شجرة عائلة العريني
      </h1>
      <p className="text-lg md:text-xl text-[#5c8599] mb-8">
        اكتشف صلات القرابة في شجرة العائلة
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-[#5c8599] text-white font-bold rounded-lg shadow-lg hover:bg-[#4a69bd] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c8599] focus:ring-offset-[#f8f7f4]"
      >
        ابدأ الآن
      </button>
    </div>
  );
};

export default WelcomeScreen;
