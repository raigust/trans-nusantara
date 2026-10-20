import React, { useState } from 'react';
import { Bus, Check, Info, Layers, User } from 'lucide-react';
import { Schedule } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface SeatMapProps {
  schedule: Schedule;
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  maxSeats?: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  schedule,
  selectedSeats,
  onToggleSeat,
  maxSeats = 4,
}) => {
  const { bus, bookedSeats = [] } = schedule;
  const isDoubleDecker = bus.isDoubleDecker || bus.name.toLowerCase().includes('double');
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const renderDeckGrid = () => {
    const rows = [];
    const isLower = activeDeck === 'lower';

    if (isDoubleDecker) {
      if (isLower) {
        for (let r = 1; r <= 4; r++) {
          rows.push(renderRow(r, [`${r}A`], [`${r}B`], true));
        }
      } else {
        for (let r = 5; r <= 10; r++) {
          rows.push(renderRow(r, [`${r}A`], [`${r}B`, `${r}C`], false));
        }
      }
    } else {
      const totalRows = bus.totalRows || 8;
      const layout = bus.layout || '2-2';

      for (let r = 1; r <= totalRows; r++) {
        let left: string[] = [];
        let right: string[] = [];

        if (layout === '1-1') {
          left = [`${r}A`];
          right = [`${r}B`];
        } else if (layout === '2-1' || layout === '1-2') {
          left = [`${r}A`];
          right = [`${r}B`, `${r}C`];
        } else {
          left = [`${r}A`, `${r}B`];
          right = [`${r}C`, `${r}D`];
        }
        rows.push(renderRow(r, left, right, bus.busClass === 'Royal Sleeper' || bus.busClass === 'First Class Sleeper'));
      }
    }

    return rows;
  };

  const renderRow = (rowNum: number, leftSeats: string[], rightSeats: string[], isSleeper: boolean) => (
    <div key={`row-${rowNum}`} className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
      <div className="w-6 text-[11px] font-semibold text-[#7a7a7a] text-center shrink-0">
        {rowNum}
      </div>

      <div className="flex items-center gap-2">
        {leftSeats.map((seatId) => renderSeatButton(seatId, isSleeper))}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <span className="text-[10px] tracking-widest text-[#7a7a7a] font-medium uppercase select-none">
          Lorong
        </span>
      </div>

      <div className="flex items-center gap-2">
        {rightSeats.map((seatId) => renderSeatButton(seatId, isSleeper))}
      </div>
    </div>
  );

  const renderSeatButton = (seatId: string, isSleeper: boolean) => {
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    let btnClass = 'transition-all relative flex flex-col items-center justify-center rounded-[8px] active:scale-95 ';

    if (isSleeper) {
      btnClass += 'w-14 h-14 text-xs ';
    } else {
      btnClass += 'w-11 h-12 text-xs ';
    }

    if (isBooked) {
      btnClass += 'bg-[#f5f5f7] text-[#a1a1a6] border border-[#e0e0e0] cursor-not-allowed ';
    } else if (isSelected) {
      btnClass += 'bg-[#0066cc] text-white border border-[#0066cc] font-semibold scale-102 shadow-sm ';
    } else {
      btnClass += 'bg-white hover:bg-[#fafafc] text-[#1d1d1f] border border-[#e0e0e0] hover:border-[#0066cc] cursor-pointer font-medium ';
    }

    return (
      <button
        key={seatId}
        type="button"
        disabled={isBooked}
        onClick={() => {
          sounds.playSeatSelect();
          onToggleSeat(seatId);
        }}
        className={btnClass}
      >
        <span className="text-xs font-semibold leading-tight">{seatId}</span>
        {isSelected ? (
          <Check className="w-3.5 h-3.5 mt-0.5 text-white" />
        ) : isBooked ? (
          <span className="text-[9px] text-[#a1a1a6] mt-0.5">Terisi</span>
        ) : (
          <span className="text-[9px] text-[#7a7a7a] mt-0.5">
            {isSleeper ? 'Sleeper' : 'Pilih'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 text-[#1d1d1f] max-w-lg mx-auto text-left">
      
      {/* Bus Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0066cc] block">
            Denah Kursi Resmi &middot; {bus.chassis}
          </span>
          <h4 className="text-base font-semibold text-[#1d1d1f] mt-0.5">{bus.name}</h4>
          <p className="text-xs text-[#7a7a7a]">{bus.plateNumber} &middot; {bus.busClass}</p>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-xs font-medium text-[#1d1d1f]">
            Maks. {maxSeats} Kursi
          </span>
        </div>
      </div>

      {/* Double Decker Floor Switcher */}
      {isDoubleDecker && (
        <div className="my-4 p-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] grid grid-cols-2 gap-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => { sounds.playClick(); setActiveDeck('lower'); }}
            className={`py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              activeDeck === 'lower'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#7a7a7a] hover:text-[#1d1d1f]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Deck Bawah (Sleeper)</span>
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setActiveDeck('upper'); }}
            className={`py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              activeDeck === 'upper'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#7a7a7a] hover:text-[#1d1d1f]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Deck Atas (Panoramic)</span>
          </button>
        </div>
      )}

      {/* Cockpit Area */}
      <div className="my-4 py-2 px-4 bg-[#f5f5f7] rounded-xl border border-[#e0e0e0] flex items-center justify-between text-xs text-[#7a7a7a]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#34c759]" />
          <span>Area Kemudi / Pintu Depan</span>
        </div>
        <span className="font-medium text-[#1d1d1f]">Kabin Depan</span>
      </div>

      {/* Seats Layout Container */}
      <div className="space-y-1 my-4 bg-white p-3 rounded-xl border border-[#e0e0e0]">
        {renderDeckGrid()}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-around text-xs text-[#7a7a7a]">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-white border border-[#1d1d1f]" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#0066cc]" />
          <span className="text-[#0066cc] font-medium">Dipilih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#f5f5f7] border border-[#e0e0e0]" />
          <span>Terisi</span>
        </div>
      </div>

      {/* Selected Seats Feedback */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-3 bg-[#f5f5f7] rounded-xl border border-[#e0e0e0] flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[#7a7a7a]">Kursi yang Anda pilih: </span>
            <strong className="text-[#0066cc] font-semibold">{selectedSeats.join(', ')}</strong>
          </div>
          <span className="text-xs font-semibold text-[#1d1d1f]">
            {selectedSeats.length} Penumpang
          </span>
        </div>
      )}
    </div>
  );
};
