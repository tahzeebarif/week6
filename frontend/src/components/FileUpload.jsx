import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../api/productApi';

const FileUpload = ({ onUploadSuccess, currentImage }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData);
      if (res.success) {
        onUploadSuccess(res.data);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onUploadSuccess('');
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-[24px] p-8 transition-all cursor-pointer overflow-hidden
          ${isDragActive ? 'border-black bg-gray-50' : 'border-black/10 hover:border-black/30 bg-gray-50/50'}
          ${preview ? 'h-64' : 'h-48'} flex flex-col items-center justify-center text-center`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white font-bold flex items-center gap-2">
                <Upload size={20} /> Change Image
              </p>
            </div>
            <button 
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all z-10"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/40">
              {loading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
            </div>
            <div>
              <p className="font-bold text-lg text-black">
                {isDragActive ? 'Drop it here' : 'Drag & drop image'}
              </p>
              <p className="text-black/40 text-sm mt-1">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
            <Loader2 size={40} className="animate-spin text-black mb-2" />
            <p className="font-bold text-black uppercase tracking-widest text-xs">Uploading...</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight">{error}</p>
      )}
      
      {preview && !loading && !error && (
        <div className="flex items-center gap-2 mt-3 text-emerald-500">
          <CheckCircle size={14} />
          <span className="text-xs font-bold uppercase tracking-tight">Ready to save</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
