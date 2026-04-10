import Image from 'next/image';

interface AdminZoomModalProps {
  imagePath: string;
  onClose: () => void;
}

export default function AdminZoomModal({ imagePath, onClose }: AdminZoomModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
      >
        &times;
      </button>
      <Image
        src={imagePath}
        alt="Zoom"
        fill
        className="object-contain cursor-default"
        sizes="100vw"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
