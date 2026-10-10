import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { FloatingParticles } from './components/FloatingParticles';
import { audio } from './utils/audio';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleRestart = () => {
    audio.playPop();
    setIsUnlocked(false);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-kawaii-pattern text-[#4A3B43] flex flex-col justify-between">
      {/* Floating Petals, Hearts, and Sparkles particle canvas */}
      <FloatingParticles />

      {/* Structured Clean Top Navigation Bar - Without music */}
      <header className="sticky top-0 z-40 w-full border-b border-[#FFCCD5]/60 bg-white/90 px-3.5 sm:px-6 py-2.5 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          {/* Brand & Recipient Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFE5EC] px-3.5 py-1 text-xs font-semibold text-[#D6336C] border border-[#FFCCD5]">
            <span>🧸</span>
            <span className="font-bold">Para Camila</span>
            <span>💖</span>
          </div>

          {/* Right Controls - Only Inicio when unlocked */}
          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleRestart}
                className="flex min-h-[36px] items-center gap-1 rounded-xl border border-[#FFCCD5] bg-white px-3 py-1 text-xs font-semibold text-[#D6336C] hover:bg-[#FFE5EC] active:scale-95 cursor-pointer transition-colors shadow-xs"
                title="Volver a la bienvenida"
              >
                <span>🧸</span>
                <span>Inicio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Screen Views */}
      <main className="relative z-10 flex-1 flex flex-col">
        {!isUnlocked ? (
          <LoginScreen onSuccess={() => setIsUnlocked(true)} />
        ) : (
          <GalleryScreen onBackToLogin={handleRestart} />
        )}
      </main>
    </div>
  );
}
