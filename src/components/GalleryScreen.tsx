import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { triggerCelebration } from './FloatingParticles';

import img1 from '../assets/images/clothing_store_selfie_1791593852229.jpg';
import img2 from '../assets/images/grass_selfie_couple_1791593860882.jpg';
import img3 from '../assets/images/huaso_gala_kiss_1791593870059.jpg';
import img4 from '../assets/images/cake_frosting_kiss_1791593877759.jpg';

interface CardItem {
  id: number;
  defaultImage: string;
  title: string;
  message: string;
  badge: string;
}

const CARDS: CardItem[] = [
  {
    id: 1,
    defaultImage: img1,
    title: 'Aventuras y risas a tu lado 🤪✨',
    message:
      'Gracias por cada risa, por las locuras en cualquier lugar y por hacer que hasta el día más común sea inolvidable. ¿Para qué buscar en la calle lo que abunda en mi casa? 🏡💖 En ti lo tengo todo, Cami.',
    badge: 'Recuerdo 01 · Risas & Locuras',
  },
  {
    id: 2,
    defaultImage: img2,
    title: 'Mi lugar seguro 🌿💖',
    message:
      'Contigo todo es calma, tranquilidad y felicidad pura. Gracias por ser mi paz, por tu compañía sincera y por recordarme cada día lo afortunado que soy de tenerte a mi lado.',
    badge: 'Recuerdo 02 · Paz & Calma',
  },
  {
    id: 3,
    defaultImage: img3,
    title: 'El Amor de mi Vida 🥂🌹',
    message:
      'Me siento feliz de caminar a tu lado en cada momento especial. Cuando los años nos pesen y las piernas ya no caminen, estaré a tu lado celebrando cada momento. Gracias por construir recuerdos tan lindos juntos.',
    badge: 'Recuerdo 03 · Amor Eterno',
  },
  {
    id: 4,
    defaultImage: img4,
    title: '¡Feliz Cumpleaños, mi vida! 🎂🧸',
    message:
      'Hoy celebro tu vida y agradezco de corazón que estés en la mía. Gracias por tu cariño y por hacer todo mucho más dulce. Deseo que este nuevo año te traiga toda la felicidad del mundo. ¡Te amo muchísimo, Camila! ❤️',
    badge: 'Recuerdo 04 · ¡Feliz Vuelta al Sol!',
  },
];

interface GalleryScreenProps {
  onBackToLogin?: () => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customImages] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('camila_custom_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showCakeModal, setShowCakeModal] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentCard = CARDS[currentIndex];
  // Locks the current images permanently (custom ones if saved, otherwise the set photos)
  const activeImage = customImages[currentCard.id] || currentCard.defaultImage;

  const handleNext = () => {
    audio.playPop();
    setCurrentIndex((prev) => (prev < CARDS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    audio.playPop();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : CARDS.length - 1));
  };

  const handleSelectCard = (index: number) => {
    if (index === currentIndex) return;
    audio.playPop();
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBlowCandles = () => {
    audio.playBlow();
    setCandlesBlown(true);
    triggerCelebration();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-between px-2.5 py-2 sm:px-6 sm:py-5">
      {/* Title & Interactive Celebratory Buttons */}
      <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <h2 className="text-base sm:text-2xl font-bold tracking-tight text-[#4A3B43]">
          Nuestros Momentos & Deseos ✨
        </h2>

        {/* Action Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {/* Shower of roses button */}
          <button
            onClick={() => {
              audio.playSparkle();
              triggerCelebration();
            }}
            className="flex min-h-[36px] items-center gap-1.5 rounded-2xl border border-[#FFCCD5] bg-white/95 px-3 py-1 text-xs font-semibold text-[#D6336C] shadow-xs transition-all hover:bg-[#FFF0F3] active:scale-95 cursor-pointer"
            title="Lanzar lluvia de pétalos y corazones"
          >
            <span>🌹</span>
            <span>Lluvia de Pétalos</span>
          </button>

          {/* Birthday Cake Modal button */}
          <button
            onClick={() => {
              audio.playPop();
              setShowCakeModal(true);
            }}
            className="flex min-h-[36px] items-center gap-1.5 rounded-2xl border border-[#FFCCD5] bg-white/95 px-3 py-1 text-xs font-semibold text-[#D6336C] shadow-xs transition-all hover:bg-[#FFF0F3] active:scale-95 cursor-pointer"
            title="Soplar velitas de cumpleaños"
          >
            <span>🎂</span>
            <span>Soplar Velas</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Carousel Display - Fixed, locked-in photos */}
      <div
        className="my-auto py-1.5"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null || touchStartY.current === null) return;
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = touchStartX.current - touchEndX;
          const diffY = touchStartY.current - touchEndY;

          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX > 0) handleNext();
            else handlePrev();
          }

          touchStartX.current = null;
          touchStartY.current = null;
        }}
      >
        <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[#FFCCD5] bg-white/95 p-3.5 sm:p-6 shadow-[0_15px_35px_rgba(255,107,135,0.14)] backdrop-blur-md transition-all duration-300">
          {/* Card Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-[#FFE5EC] text-[11px] sm:text-xs font-medium text-[#7D6B75]">
            <span className="font-semibold text-[#D6336C]">{currentCard.badge}</span>
            <span>
              {currentIndex + 1} de {CARDS.length}
            </span>
          </div>

          {/* Photo Slot - Locked in, clickable to zoom in Lightbox */}
          <div className="group relative mt-2.5 overflow-hidden rounded-2xl border-2 border-[#FFCCD5] bg-[#FFF0F3] shadow-inner">
            <div
              className="h-50 sm:h-72 md:h-80 w-full cursor-pointer overflow-hidden bg-neutral-100 flex items-center justify-center"
              onClick={() => {
                audio.playPop();
                setLightboxImage(activeImage);
              }}
              title="Haz clic para ver la foto en grande"
            >
              <img
                src={activeImage}
                alt={currentCard.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Click to expand hint overlay */}
            <div
              onClick={() => {
                audio.playPop();
                setLightboxImage(activeImage);
              }}
              className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1 rounded-xl bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
            >
              <span>🔍</span>
              <span>Ampliar</span>
            </div>
          </div>

          {/* Content & Dedication */}
          <div className="mt-3.5 space-y-1.5">
            <h3 className="text-base sm:text-xl font-bold tracking-tight text-[#4A3B43]">
              {currentCard.title}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-[#5C4A54]">
              {currentCard.message}
            </p>
          </div>

          {/* Navigation Controls inside card - 100% Mobile Responsive */}
          <div className="mt-4 pt-3 border-t border-[#FFE5EC] space-y-2.5">
            {/* Page indicator hearts/paws - Centered */}
            <div className="flex items-center justify-center gap-2">
              {CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleSelectCard(idx)}
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    idx === currentIndex
                      ? 'scale-115 bg-[#FF4D6D] text-white shadow-xs font-bold'
                      : 'bg-[#FFE5EC] text-[#D6336C] hover:bg-[#FFCCD5]'
                  }`}
                  title={`Ir al recuerdo ${idx + 1}`}
                >
                  {idx === currentIndex ? '💖' : '🐾'}
                </button>
              ))}
            </div>

            {/* Split full-width action buttons that never overflow or clip */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-2xl border-2 border-[#FFCCD5] bg-[#FFF8F9] px-3 py-2 text-xs sm:text-sm font-semibold text-[#4A3B43] shadow-xs transition-all hover:bg-[#FFE5EC] hover:text-[#D6336C] active:scale-[0.98] cursor-pointer"
              >
                <span>⬅</span>
                <span>Anterior</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:brightness-105 active:scale-[0.98] cursor-pointer"
              >
                <span>Siguiente</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <div className="flex flex-col items-center justify-between gap-1 text-center sm:flex-row sm:text-left text-[11px] sm:text-xs text-[#7D6B75] pb-1">
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <span>🧸</span>
          <span>Desliza en la pantalla ⬅ ➔</span>
        </div>

        <div className="font-handwriting text-base sm:text-lg font-bold text-[#FF4D6D]">
          ¡Te amo con todo mi corazón, Camila! ❤️
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md transition-all animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-h-[92vh] max-w-3xl overflow-hidden rounded-3xl border-2 border-white/20 bg-white/10 p-1.5 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black text-lg cursor-pointer"
            >
              ✕
            </button>
            <img
              src={lightboxImage}
              alt="Foto ampliada para Camila"
              className="max-h-[85vh] w-auto rounded-2xl object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Birthday Cake Modal */}
      {showCakeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowCakeModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-[#FFCCD5] bg-white p-5 sm:p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCakeModal(false)}
              className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE5EC] text-[#D6336C] text-xs hover:bg-[#FFCCD5] cursor-pointer"
            >
              ✕
            </button>

            <span className="text-3xl sm:text-4xl">🎂</span>
            <h3 className="mt-1 text-lg sm:text-xl font-bold text-[#4A3B43]">
              ¡El Pastel de Cami!
            </h3>
            <p className="mt-1 text-xs text-[#7D6B75]">
              Cierra los ojos, pide tres hermosos deseos y haz clic para apagar las velitas ✨
            </p>

            {/* Candle illustration */}
            <div className="my-5 flex justify-center items-center gap-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div
                    className={`h-5 w-2.5 rounded-full transition-all duration-500 ${
                      candlesBlown
                        ? 'opacity-0 scale-50'
                        : 'bg-amber-400 shadow-[0_0_10px_#F59E0B] animate-pulse'
                    }`}
                  />
                  <div className="h-9 w-2 rounded-sm bg-gradient-to-b from-[#FF758F] to-[#FF4D6D] mt-0.5" />
                </div>
              ))}
            </div>

            {candlesBlown ? (
              <div className="rounded-2xl bg-[#FFE5EC] p-3.5 text-[#D6336C]">
                <p className="text-sm font-bold">¡Que todos tus deseos se cumplan! 🎉💖</p>
                <p className="mt-1 text-[11px]">
                  Que este nuevo año esté lleno de sonrisas, salud y mucho amor a tu lado.
                </p>
                <button
                  onClick={() => {
                    audio.playPop();
                    setCandlesBlown(false);
                  }}
                  className="mt-2.5 rounded-xl bg-white px-3 py-1 text-xs font-semibold text-[#D6336C] shadow-sm hover:bg-[#FFF0F3] cursor-pointer"
                >
                  Encender velitas de nuevo 🔥
                </button>
              </div>
            ) : (
              <button
                onClick={handleBlowCandles}
                className="w-full min-h-[44px] rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🌬️</span>
                <span>¡Soplar las velitas!</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
