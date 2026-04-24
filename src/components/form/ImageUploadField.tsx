import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, RotateCw, Crop } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadFieldProps {
  onImageChange: (value: string) => void;
  currentImage?: string;
  label: string;
  className?: string;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
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

export default function ImageUploadField({ 
  onImageChange, 
  currentImage, 
  label, 
  className = '',
  aspectRatio = 1,
  cropShape = 'rect'
}: ImageUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (currentImage && !preview) {
      setPreview(currentImage);
    }
  }, [currentImage, preview]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  };

  const uploadToServer = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('organizationLogo', file);

      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.filePath;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setCrop(undefined);
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

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const croppedFile = new File([blob], "logo.png", { type: 'image/png' });
            const uploadedPath = await uploadToServer(croppedFile);
            onImageChange(uploadedPath);
            setPreview(URL.createObjectURL(croppedFile));
            setIsCropping(false);
            setImgSrc('');
          } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
          }
        }
      }, 'image/png', 0.95);
    }
  }, [completedCrop, onImageChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files?.[0] || null);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => fileInputRef.current?.click();
  
  const handleRemove = () => {
    onImageChange('');
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Crop className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-neutral-900">Crop Your Logo</h3>
                <p className="text-neutral-600">Adjust the selection to fit your organization logo</p>
              </div>
            </div>
            
            {imgSrc && (
              <div className="bg-neutral-100 rounded-2xl p-4 mb-6">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  minWidth={50}
                  minHeight={50}
                  circularCrop={cropShape === 'round'}
                  className="max-w-full"
                >
                  <img 
                    ref={imgRef} 
                    alt="Crop me" 
                    src={imgSrc} 
                    onLoad={onImageLoad} 
                    className="max-w-full h-auto max-h-[50vh] rounded-lg"
                  />
                </ReactCrop>
              </div>
            )}
            
            <div className="flex justify-end items-center space-x-4">
              <button 
                type="button" 
                onClick={() => setIsCropping(false)} 
                className="px-6 py-3 rounded-xl font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleCropConfirm}
                disabled={isUploading}
                className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <div
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group ${
            isDragOver 
              ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-primary-100 scale-[1.02] shadow-lg' 
              : preview 
                ? 'border-secondary-300 bg-gradient-to-br from-secondary-50 to-secondary-100' 
                : 'border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)} 
          />
          
          {preview ? (
            <div className="relative p-6">
              <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white group-hover:shadow-2xl transition-all duration-300">
                <img 
                  src={preview.startsWith('http') ? preview : `http://localhost:4000${preview}`} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleClick(); }} 
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleRemove(); }} 
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-secondary-600 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Logo uploaded successfully!</span>
                </div>
                <p className="text-sm text-neutral-500">Click to change or remove</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {isDragOver ? (
                      <Upload className="w-10 h-10 text-primary-500 animate-bounce" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-neutral-400" />
                    )}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary-700 transition-colors">
                  {isDragOver ? 'Drop your logo here!' : 'Upload Organization Logo'}
                </h3>
                <p className="text-neutral-600">
                  Drag and drop or <span className="text-primary-600 font-semibold">click to browse</span>
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
                  <span className="bg-white px-3 py-1 rounded-full border">JPG</span>
                  <span className="bg-white px-3 py-1 rounded-full border">PNG</span>
                  <span className="bg-white px-3 py-1 rounded-full border">SVG</span>
                </div>
                <p className="text-xs text-neutral-400">Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 