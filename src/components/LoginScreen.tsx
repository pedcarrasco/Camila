import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { triggerCelebration } from './FloatingParticles';
import teddyIllustration from '../assets/images/cute_teddy_roses_1791593188597.jpg';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playPop();

    const trimmed = nameInput.trim().toLowerCase();

    if (trimmed === 'camila') {
      // Correct!
      setErrorMessage('');
      setIsUnlocking(true);
      audio.playChime();
      triggerCelebration();

      // Allow celebration animation to shine before transitioning
      setTimeout(() => {
        onSuccess();
      }, 1100);
    } else {
      // Incorrect!
      setIsShaking(true);
      setErrorMessage('Mmm... ¡Ese no es el nombre de la cumpleañera más linda! Intenta de nuevo 🐻✨');
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  return (
    <div className="relative z-10 flex min-h-[100dvh] items-center justify-center p-4 sm:p-6">
      {/* Central Login Card */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md rounded-3xl border border-[#FFCCD5] bg-white/95 p-5 sm:p-7 shadow-[0_15px_40px_rgba(255,107,135,0.18)] backdrop-blur-md transition-all duration-700 ${
          isUnlocking ? 'scale-105 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        } ${isShaking ? 'animate-shake-soft' : ''}`}
      >
        {/* Cute decorative floating badges */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FFE5EC] px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-[#D6336C] shadow-sm border border-[#FFCCD5]">
          <span>🐾</span>
          <span>¡Sorpresa Especial de Cumpleaños!</span>
          <span>🐾</span>
        </div>

        {/* Teddy Bear Illustration */}
        <div className="mt-2 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="h-28 w-28 sm:h-36 sm:w-36 overflow-hidden rounded-full border-4 border-[#FFCCD5] shadow-inner bg-[#FFF0F3] p-1 transition-transform duration-300 hover:scale-105">
              <img
                src={teddyIllustration}
                alt="Osito tierno con ramo de rosas para Camila"
                className="h-full w-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Sparkles over bear */}
            <span className="absolute -top-1 -right-1 text-xl sm:text-2xl animate-twinkle">✨</span>
            <span className="absolute bottom-1 -left-1 text-xl sm:text-2xl animate-float-slow">🌹</span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-[#4A3B43] leading-snug">
            ¡Hola! Ingresa tu nombre para abrir tu sorpresa 🧸🌹
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#7D6B75]">
            Un rincón secreto preparado con todo el amor del mundo solo para ti
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div className="relative">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Escribe aquí..."
              autoFocus
              className="w-full rounded-2xl border-2 border-[#FFCCD5] bg-[#FFF8F9] px-4 py-3 text-center text-base font-medium text-[#4A3B43] placeholder-[#A6959F] outline-none transition-all duration-200 focus:border-[#FF4D6D] focus:bg-white focus:ring-4 focus:ring-[#FFCCD5]/50 shadow-sm"
            />
          </div>

          {/* Floating error alert */}
          {errorMessage && (
            <div className="rounded-2xl border border-[#FF8FA3] bg-[#FFE5EC] p-2.5 text-center text-xs font-semibold text-[#C9184A] shadow-sm animate-pulse-gentle flex items-center justify-center gap-1.5">
              <span>🐻</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] px-5 py-3 text-base font-semibold text-white shadow-[0_8px_20px_rgba(255,77,109,0.32)] transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Desbloquear Sorpresa</span>
            <span className="text-lg">💖</span>
          </button>
        </form>

        {/* Footer gentle hint */}
        <div className="mt-5 text-center text-[11px] sm:text-xs text-[#A6959F] flex items-center justify-center gap-1">
          <span>✨</span>
          <span>Hecho con mucho cariño para la cumpleañera más linda</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};
