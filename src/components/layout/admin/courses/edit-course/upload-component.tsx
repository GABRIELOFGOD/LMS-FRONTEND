'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import Image from 'next/image'

interface UploadCompProps {
  image: string | null;
  setImage: (value: string | null) => void;
  setFile: (file: File | null) => void; // NEW PROP
  acceptedFileTypes?: string;
}

const UploadComp = ({ image, setImage, setFile }: Omit<UploadCompProps, 'acceptedFileTypes'>) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setFile(file);
    }
  }, [setImage, setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { acceptedFileTypes : [] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`relative flex items-center justify-center h-60 w-full max-w-lg border-2 border-dashed rounded-md cursor-pointer overflow-hidden transition ${
        isDragActive ? 'bg-slate-200 border-slate-500' : 'bg-slate-100 border-slate-400'
      }`}
    >
      <input {...getInputProps()} />

      {image ? (
        <Image
          src={image}
          alt="Uploaded preview"
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      ) : (
        <div className="flex flex-col items-center justify-center z-10">
          <UploadCloud className="h-10 w-10 text-slate-500 mb-2" />
          <p className="text-slate-600 text-center">Drag & drop image here, or click to select</p>
        </div>
      )}

      {/* Optional overlay to dim the image slightly on hover */}
      {image && (
        <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition z-0" />
      )}
    </div>
  )
}

export default UploadComp;