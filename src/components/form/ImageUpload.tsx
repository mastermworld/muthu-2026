import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Camera, User, CheckCircle, RotateCw, AlertCircle, Loader2 } from "lucide-react";
import { FieldError } from "react-hook-form";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import * as faceapi from '@vladmandic/face-api';

// Module-level model loading state (shared across renders)
let faceModelsLoaded = false;
let faceModelsLoading = false;

async function ensureFaceModelsLoaded() {
  if (faceModelsLoaded) return;
  if (faceModelsLoading) {
    while (faceModelsLoading) await new Promise((r) => setTimeout(r, 50));
    return;
  }
  faceModelsLoading = true;
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api');
    faceModelsLoaded = true;
  } finally {
    faceModelsLoading = false;
  }
}

type FaceCheckState = 'idle' | 'checking' | 'ok' | 'none' | 'multiple';

interface ImageUploadProps {
  label: string;
  error?: FieldError;
  onChange: (file: File | null) => void;
  value: File | null;
}

const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => {
  const mediaAspect = mediaWidth / mediaHeight;
  let cropWidth = mediaWidth;
  let cropHeight = mediaHeight;

  if (mediaAspect > aspect) {
    cropWidth = mediaHeight * aspect;
  } else {
    cropHeight = mediaWidth / aspect;
  }

  const x = (mediaWidth - cropWidth) / 2;
  const y = (mediaHeight - cropHeight) / 2;

  return {
    x,
    y,
    width: cropWidth,
    height: cropHeight,
    unit: 'px' as const
  };
};

export default function ImageUpload({ label, error, onChange, value }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [faceCheckState, setFaceCheckState] = useState<FaceCheckState>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Ref keeps the latest completedCrop available to handleCropConfirm without
  // stale-closure issues — the callback is recreated only when onChange changes.
  const completedCropRef = useRef<PixelCrop | undefined>(undefined);

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Give the modal time to mount before attaching the stream
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }, 80);
      });
    } catch {
      alert('Camera access denied or camera not available on this device.');
    }
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        closeCamera();
        handleFileChange(file);
      }
    }, 'image/jpeg', 0.95);
  }, [closeCamera]);
  
  useEffect(() => {
    if (value && typeof value === 'object' && !preview) {
      setPreview(URL.createObjectURL(value));
    } else if (!value) {
      setPreview(null);
    }
  }, [value, preview]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setCrop(undefined);
      setCompletedCrop(undefined);
      completedCropRef.current = undefined;
      setFaceCheckState('idle');
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select an image file (JPG, PNG, GIF)');
    }
  }, []);

  const handleCropConfirm = useCallback(async () => {
    // Read the latest crop from the ref — avoids stale-closure issues entirely
    const crop = completedCropRef.current;
    if (!(crop && imgRef.current)) return;

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const cropW = crop.width * scaleX;
    const cropH = crop.height * scaleY;

    // ── 1. Small canvas for face detection (max 416px side) ──────────
    const MAX_DETECT = 416;
    const detectScale = Math.min(1, MAX_DETECT / Math.max(cropW, cropH));
    const detectCanvas = document.createElement('canvas');
    detectCanvas.width = Math.max(1, Math.floor(cropW * detectScale));
    detectCanvas.height = Math.max(1, Math.floor(cropH * detectScale));
    const detectCtx = detectCanvas.getContext('2d')!;
    detectCtx.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY, cropW, cropH,
      0, 0, detectCanvas.width, detectCanvas.height,
    );

    // ── 2. Run TinyFaceDetector ───────────────────────────────────────
    // Enforce a minimum visible delay so the spinner always renders and the
    // user can see that something is happening (React 18 batches fast updates).
    setFaceCheckState('checking');
    try {
      const [detections] = await Promise.all([
        (async () => {
          await ensureFaceModelsLoaded();
          return faceapi.detectAllFaces(
            detectCanvas,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5, inputSize: 416 }),
          );
        })(),
        new Promise<void>((r) => setTimeout(r, 500)), // minimum spinner time
      ]);

      if (detections.length === 0) { setFaceCheckState('none');     return; }
      if (detections.length > 1)   { setFaceCheckState('multiple'); return; }
    } catch (err) {
      // Graceful degradation: model load failure → allow upload to proceed
      console.warn('Face detection failed, proceeding without check:', err);
    }

    // ── 3. Full-res production canvas ─────────────────────────────────
    const pixelRatio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    canvas.width  = Math.floor(cropW * pixelRatio);
    canvas.height = Math.floor(cropH * pixelRatio);
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY, cropW, cropH,
      0, 0, cropW, cropH,
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], 'cropped_image.png', { type: 'image/png' });
      onChange(croppedFile);
      setPreview(URL.createObjectURL(croppedFile));
      setIsCropping(false);
      setImgSrc('');
      setFaceCheckState('idle');
    }, 'image/png', 1);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); handleFileChange(e.dataTransfer.files?.[0] || null); }, [handleFileChange]);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleClick = () => fileInputRef.current?.click();
  const handleRemove = () => { onChange(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div id="profilePicture" className="mb-6">
      <label className=" flex items-center justify-center block text-neutral-800 font-semibold mb-3 text-lg left-10">{label}</label>

      {/* ── Camera Modal ──────────────────────────────────────────── */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-stretch sm:items-center justify-center z-[110] animate-fade-in sm:p-4">
          <div className="bg-black sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-bold text-lg">Take Photo</h3>
              <button type="button" onClick={closeCamera} className="text-white/70 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-[60vh] object-cover"
              />
            </div>
            <div className="flex-shrink-0 px-4 py-4 flex justify-center gap-4 bg-black">
              <button
                type="button"
                onClick={closeCamera}
                className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {isCropping && (
        <div className="fixed inset-0 bg-black/80 flex items-stretch sm:items-center justify-center z-[100] animate-fade-in sm:p-4">
          <div className="bg-white sm:rounded-2xl shadow-2xl w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[95vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-neutral-100 flex-shrink-0">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-neutral-800">Crop Your Image</h3>
              <p className="text-neutral-500 text-sm mt-1">Pinch to zoom, drag the circle to reposition, and drag the edges to resize.</p>
            </div>

            {/* Crop area - scrollable on small screens */}
            <div className="flex-1 overflow-auto bg-neutral-100 flex items-center justify-center p-3 sm:p-4 touch-none">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => { setCompletedCrop(c); completedCropRef.current = c; }}
                  aspect={1}
                  minWidth={50}
                  minHeight={50}
                  circularCrop={true}
                  keepSelection={true}
                  ruleOfThirds={true}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    style={{ maxHeight: 'calc(100vh - 220px)', maxWidth: '100%', width: 'auto', height: 'auto', touchAction: 'none' }}
                    draggable={false}
                  />
                </ReactCrop>
              )}
            </div>

            {/* Footer actions - sticky on mobile */}
            <div className="flex-shrink-0 border-t border-neutral-100 px-4 sm:px-6 py-3 sm:py-4 bg-white flex flex-col gap-2">
              {/* Face detection feedback */}
              {faceCheckState === 'none' && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>No face detected. Make sure your face is clearly visible and centred in the crop area, then try again.</span>
                </div>
              )}
              {faceCheckState === 'multiple' && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Multiple faces detected. Please crop to show only your own face.</span>
                </div>
              )}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCropping(false); setFaceCheckState('idle'); completedCropRef.current = undefined; }}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  disabled={faceCheckState === 'checking'}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg active:opacity-90 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {faceCheckState === 'checking' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Checking photo…</>
                  ) : (faceCheckState === 'none' || faceCheckState === 'multiple') ? (
                    'Try Again'
                  ) : (
                    'Confirm Crop'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            isDragOver ? 'border-primary-400 bg-primary-50 scale-105' : 
            error ? 'border-accent-400 bg-accent-50' : 
            preview ? 'border-secondary-400 bg-secondary-50' : 
            'border-neutral-300 bg-neutral-100'
          }`}
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={handleClick}
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
          
          {preview ? (
            <div className="relative p-4">
              <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden shadow-lg transition-all duration-300">
                <img src={preview} alt="Profile preview" className="w-full h-full object-cover"/>
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleClick(); }} className="p-2 bg-primary-500 text-white rounded-full transition-colors duration-200 shadow-lg hover:bg-primary-600"><RotateCw className="w-4 h-4" /></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(); }} className="p-2 bg-accent-500 text-white rounded-full transition-colors duration-200 shadow-lg hover:bg-accent-600"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-secondary-600"><CheckCircle className="w-5 h-5" /><span className="font-medium">Image uploaded!</span></div>
                <p className="text-sm text-neutral-500 mt-1">Click image to change</p>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="relative flex mx-auto mb-4 items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">{isDragOver ? <Upload className="w-10 h-10 text-primary-500" /> : <User className="w-10 h-10 text-neutral-400" />}</div>
                </div>
                
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-neutral-800">{isDragOver ? 'Drop your image here!' : 'Upload Picture'}</h3>
                <p className="text-neutral-500">Drag and drop or <span className="text-primary-500 font-medium">click to browse</span></p>
                <p className="text-xs text-neutral-400">Supports: JPG, PNG, GIF (Max 10MB)</p>
              </div>
            </div>
          )}
        </div>
        {error && (<p className="text-accent-600 text-sm mt-2 flex items-center space-x-1 animate-slide-up"><X className="w-4 h-4" /><span>{error.message}</span></p>)}

        {/* Camera button */}
        {!preview && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openCamera(); }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 text-primary-600 font-medium text-sm hover:bg-primary-100 hover:border-primary-400 transition-all"
          >
            <Camera className="w-4 h-4" />
            Take Photo with Camera
          </button>
        )}
      </div>
    </div>
  );
}