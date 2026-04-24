import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Camera, User, CheckCircle, Crop, RotateCw } from "lucide-react";
import { FieldError } from "react-hook-form";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
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
      setCrop(undefined); // Reset crop
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
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      canvas.width = Math.floor(completedCrop.width * scaleX);
      canvas.height = Math.floor(completedCrop.height * scaleY);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelRatio = window.devicePixelRatio;
      canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped_image.png", { type: 'image/png' });
          onChange(croppedFile);
          setPreview(URL.createObjectURL(croppedFile));
          setIsCropping(false);
          setImgSrc('');
        }
      }, 'image/png', 1);
    }
  }, [completedCrop, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); handleFileChange(e.dataTransfer.files?.[0] || null); }, [handleFileChange]);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleClick = () => fileInputRef.current?.click();
  const handleRemove = () => { onChange(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div className="mb-6">
      <label className="block text-neutral-800 font-semibold mb-3 text-lg">{label}</label>
      
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
                  onComplete={(c) => setCompletedCrop(c)}
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
            <div className="flex-shrink-0 border-t border-neutral-100 px-4 sm:px-6 py-3 sm:py-4 bg-white flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg active:opacity-90 transition-shadow"
              >
                Confirm Crop
              </button>
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
            <div className="p-8 text-center">
              <div className="relative mx-auto mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">{isDragOver ? <Upload className="w-10 h-10 text-primary-500" /> : <User className="w-10 h-10 text-neutral-400" />}</div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center"><Camera className="w-4 h-4 text-white" /></div>
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
      </div>
    </div>
  );
}