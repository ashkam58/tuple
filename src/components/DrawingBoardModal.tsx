import React, { useRef, useState, useEffect } from 'react';

interface DrawingBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawingBoardModal: React.FC<DrawingBoardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#1B1340');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const stampTupleDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#1B1340';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      "Sketch & Point: tuple1 = ('P', 'Y', 'T', 'H', 'O', 'N')",
      40,
      48
    );

    const letters = ['P', 'Y', 'T', 'H', 'O', 'N'];
    letters.forEach((ch, idx) => {
      const x = 45 + idx * 105;
      const y = 95;

      // Positive index above
      ctx.fillStyle = '#6C4DE6';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`idx ${idx}`, x + 22, y - 12);

      // Box shadow
      ctx.fillStyle = '#1B1340';
      ctx.fillRect(x + 4, y + 4, 86, 76);

      // Box fill
      ctx.fillStyle = '#FFD23F';
      ctx.fillRect(x, y, 86, 76);
      ctx.strokeStyle = '#1B1340';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, 86, 76);

      // Character
      ctx.fillStyle = '#1B1340';
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText(`'${ch}'`, x + 18, y + 48);

      // Negative index below
      ctx.fillStyle = '#B5461E';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`neg ${idx - 6}`, x + 16, y + 98);
    });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(stampTupleDiagram, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const moveDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = [
    { label: 'Ink Navy', value: '#1B1340' },
    { label: 'Purple', value: '#6C4DE6' },
    { label: 'Crimson', value: '#DC2626' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Gold', value: '#D97706' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Classroom Drawing Board"
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div className="comic-card w-full max-w-4xl p-5 bg-[#FAF5EE]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#1B1340]">
          <div className="flex items-center gap-2">
            <span className="font-comic text-2xl text-[#1B1340]">
              ✏️ CLASSROOM DRAWING BOARD
            </span>
            <span className="text-xs font-bold text-[#4A4238]">
              Draw index arrows, slices, or Flip-Flop pointers live with Sneha!
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                aria-label={`Select ${c.label} pen`}
                className={`w-7 h-7 rounded-full border-2 border-[#1B1340] cursor-pointer ${
                  color === c.value ? 'ring-2 ring-offset-2 ring-[#6C4DE6]' : ''
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <button
              type="button"
              onClick={() => setBrushSize((b) => (b === 4 ? 8 : 4))}
              className="comic-btn px-3 py-1 rounded-full bg-white text-[#1B1340] text-xs font-bold cursor-pointer"
            >
              Pen: {brushSize}px
            </button>
            <button
              type="button"
              onClick={stampTupleDiagram}
              className="comic-btn px-3 py-1 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
            >
              📦 Stamp PYTHON Tuple Boxes
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              className="comic-btn px-3 py-1 rounded-full bg-white text-[#1B1340] text-xs font-bold cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="comic-btn px-3.5 py-1 rounded-full bg-[#1B1340] text-white text-xs font-extrabold cursor-pointer"
            >
              ✕ Close Board
            </button>
          </div>
        </div>

        <div className="mt-4 border-[3px] border-[#1B1340] rounded-2xl overflow-hidden bg-[#FFFDF9]">
          <canvas
            ref={canvasRef}
            width={760}
            height={340}
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            className="w-full h-[320px] cursor-crosshair block"
          />
        </div>
      </div>
    </div>
  );
};
