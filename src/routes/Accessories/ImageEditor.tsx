import { Minus, Move, Plus } from 'lucide-react';
import { useRef, useState, MouseEvent } from 'react';

// Define the props interface
interface ImageEditorProps {
  imageUrl: string;
  onSave: (data: { zoom: number; position: { x: number; y: number } }) => void;
  onCancel: () => void;
}

const ImageEditor = ({ imageUrl, onSave, onCancel }: ImageEditorProps) => {
    const [zoom, setZoom] = useState(100);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
  
    const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    };
  
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    const handleZoomIn = () => {
      setZoom((prev) => Math.min(prev + 10, 400));
    };
  
    const handleZoomOut = () => {
      setZoom((prev) => Math.max(prev - 10, 50));
    };
  
    return (
      <div className="space-y-6">
        <div className="flex gap-6 items-start">
          {/* Thumbnail Preview */}
          <div className="flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden border-4 border-dashed border-purple-400 w-[339px] h-[300px] flex items-center justify-center">
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
            <button className="mt-4 w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Edit Image
            </button>
          </div>
  
          {/* Main Preview */}
          <div className="flex-1">
            <div
              className="relative bg-purple-500 rounded-2xl overflow-hidden border-4 border-dashed border-purple-400"
              style={{ height: '400px' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain cursor-move"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                    transition: isDragging ? 'none' : 'transform 0.1s',
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
  
        <div className="flex items-center justify-center gap-4">
          <button
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
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((zoom - 50) / 150) * 100}%, #e5e7eb ${((zoom - 50) / 150) * 100}%, #e5e7eb 100%)`
            }}
          />
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>
  
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onCancel}
            className="px-12 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ zoom, position })}
            className="px-12 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Save Image
          </button>
        </div>
      </div>
    );
  };

export default ImageEditor;