import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, RefreshCw } from 'lucide-react';

export default function ScannerPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [text, setText] = useState('');

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    videoRef.current.srcObject = stream;
  };

  const captureAndScan = async () => {
    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Tesseract OCR Engine Real Logic
    const { data: { text } } = await Tesseract.recognize(canvas.toDataURL('image/png'), 'eng');
    setText(text);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-pagora-base p-6 pt-12 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-pagora-text mb-6">Scan Book Page</h1>
      
      <div className="w-full h-96 bg-pagora-card rounded-3xl overflow-hidden relative mb-6 border-2 border-pagora-accent">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        {!videoRef.current?.srcObject && (
          <button onClick={startCamera} className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold">
            <Camera className="mr-2"/> Enable Camera
          </button>
        )}
      </div>

      <button onClick={captureAndScan} disabled={isScanning} className="w-full py-4 rounded-xl font-bold bg-pagora-primary text-white mb-6 flex justify-center items-center">
        {isScanning ? <RefreshCw className="animate-spin" /> : 'Capture & Extract Text'}
      </button>

      <div className="w-full p-4 bg-pagora-card rounded-xl text-pagora-muted text-sm min-h-[100px] whitespace-pre-wrap overflow-y-auto">
        {text || "Extracted text will appear here and can be saved as notes."}
      </div>
    </div>
  );
}
