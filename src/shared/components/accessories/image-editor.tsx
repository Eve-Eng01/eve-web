// ──────────────────────────────────────────────────────────────────────
//  image-editor.tsx  (only the parts that changed)
// ──────────────────────────────────────────────────────────────────────
import { Minus, Move, Plus } from "lucide-react";
import { useRef, useState, MouseEvent, useEffect } from "react";

export interface ImageEditData {
  zoom: number;
  position: { x: number; y: number };
}

/* NEW PROP */
interface ImageEditorProps {
  imageUrl: string;
  initialEdit?: ImageEditData;          // <-- restore previous state
  onSave: (croppedUrl: string, edit: ImageEditData) => void;
  onCancel: () => void;
  isLoading?: boolean;                  // <-- loading state for save button
}

/* Crop size (same as the thumbnail preview) */
const CROP_W = 339;
const CROP_H = 300;

const ImageEditor = ({
  imageUrl,
  initialEdit,
  onSave,
  onCancel,
  isLoading = false,
}: ImageEditorProps) => {
  /* initialise from props (fallback to defaults) */
  const [zoom, setZoom] = useState(initialEdit?.zoom ?? 100);
  const [position, setPosition] = useState(
    initialEdit?.position ?? { x: 0, y: 0 }
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ---------- DRAG ---------- */
  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  /* ---------- ZOOM ---------- */
  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 400));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));

  /* ---------- CANVAS DRAW (crop preview) ---------- */
  const drawCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CROP_W, CROP_H);

    const thumbScale = zoom / 200;               // thumbnail uses half-scale
    const tx = position.x * 0.5;
    const ty = position.y * 0.5;

    const imgW = img.naturalWidth * thumbScale;
    const imgH = img.naturalHeight * thumbScale;

    const offsetX = CROP_W / 2 - (imgW / 2 + tx);
    const offsetY = CROP_H / 2 - (imgH / 2 + ty);

    ctx.drawImage(img, offsetX, offsetY, imgW, imgH);
  };

  useEffect(() => {
    drawCrop();
  }, [zoom, position]);

  /* ---------- SAVE ---------- */
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cropped = canvas.toDataURL("image/png");
    onSave(cropped, { zoom, position });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6 items-start">
        {/* THUMBNAIL (crop preview) */}
        <div className="flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden border-4 border-dashed border-purple-400 w-[339px] h-[300px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={CROP_W}
              height={CROP_H}
              className="absolute inset-0 opacity-0 pointer-events-none"
            />
            <img
              src={imageUrl}
              alt="Thumbnail"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px) scale(${zoom / 200})`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <Move className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* BIG PREVIEW (draggable) */}
        <div className="flex-1">
          <div
            className="relative bg-purple-500 rounded-2xl overflow-hidden border-4 border-dashed border-purple-400"
            style={{ height: "400px" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain cursor-move"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                  transition: isDragging ? "none" : "transform 0.1s",
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Move className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM CONTROLS */}
      <div className="flex items-center justify-center gap-4">
        <button
          title="Zoom Out"
          onClick={handleZoomOut}
          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>

        <input
          type="range"
          min="50"
          max="400"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-80 accent-purple-600"
          style={{
            background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((zoom - 50) / 350) * 100}%, #e5e7eb ${((zoom - 50) / 350) * 100}%, #e5e7eb 100%)`,
          }}
        />

        <button
          title="Zoom In"
          onClick={handleZoomIn}
          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-12 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:border-gray-300 disabled:text-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-12 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 flex items-center justify-center gap-2 min-w-[180px]"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Save Image"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;