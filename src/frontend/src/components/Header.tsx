import { Mail } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onEnvelopeClick?: () => void;
}

export default function Header({ onEnvelopeClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-red-950 to-red-900 border-b-2 border-red-800 shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Car image with 3D red glow effect */}
        <div className="flex items-center gap-4">
          <img 
            src="/assets/image.png" 
            alt="Car" 
            className="h-12 w-auto"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.6)) drop-shadow(0 0 16px rgba(220, 38, 38, 0.4))',
            }}
          />
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
            Dotazník pojištění vozidla
          </h1>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          {onEnvelopeClick && (
            <Button
              onClick={onEnvelopeClick}
              variant="outline"
              size="icon"
              className="border-red-300 text-white hover:bg-red-900/30"
              title="Správa formulářů"
            >
              <Mail className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
