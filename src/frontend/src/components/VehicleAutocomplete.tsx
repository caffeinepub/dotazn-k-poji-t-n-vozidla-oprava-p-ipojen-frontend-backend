import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Local dataset of Czech and international car brands
const CAR_BRANDS = [
  'Abarth', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Ferrari',
  'Fiat', 'Ford', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep',
  'Kia', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Maserati', 'Mazda',
  'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Porsche',
  'Renault', 'Rolls-Royce', 'Rover', 'Saab', 'Seat', 'Škoda', 'Smart', 'Subaru', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

// Local dataset of car models by brand
const CAR_MODELS: Record<string, string[]> = {
  'Škoda': ['Citigo', 'Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'],
  'BMW': ['Řada 1', 'Řada 2', 'Řada 3', 'Řada 4', 'Řada 5', 'Řada 6', 'Řada 7', 'Řada 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX'],
  'Mercedes-Benz': ['Třída A', 'Třída B', 'Třída C', 'Třída E', 'Třída S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'e-tron', 'TT'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'ID.3', 'ID.4', 'ID.5', 'ID.7'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'Puma', 'Kuga', 'Explorer', 'Ranger'],
  'Toyota': ['Aygo', 'Yaris', 'Corolla', 'Camry', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Prius'],
  'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Ioniq', 'Kona', 'Tucson', 'Santa Fe'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6'],
  'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008'],
  'Renault': ['Twingo', 'Clio', 'Megane', 'Talisman', 'Captur', 'Kadjar', 'Koleos', 'Zoe'],
  'Citroën': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross'],
  'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka'],
  'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
  'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'e'],
  'Volvo': ['V40', 'V60', 'V90', 'S60', 'S90', 'XC40', 'XC60', 'XC90'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X'],
  'Dacia': ['Sandero', 'Logan', 'Duster', 'Jogger', 'Spring'],
  'Suzuki': ['Ignis', 'Swift', 'Vitara', 'S-Cross'],
  'Mitsubishi': ['Space Star', 'ASX', 'Eclipse Cross', 'Outlander'],
  'Subaru': ['Impreza', 'XV', 'Forester', 'Outback'],
  'Jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque'],
  'Porsche': ['718', '911', 'Taycan', 'Panamera', 'Macan', 'Cayenne'],
  'Lexus': ['CT', 'IS', 'ES', 'LS', 'UX', 'NX', 'RX'],
  'Alfa Romeo': ['Giulietta', 'Giulia', 'Stelvio', 'Tonale'],
  'Mini': ['Cooper', 'Countryman', 'Clubman'],
};

interface VehicleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  type: 'brand' | 'model';
  selectedBrand?: string;
  className?: string;
  hasError?: boolean;
}

export default function VehicleAutocomplete({
  value,
  onChange,
  label,
  placeholder = 'Začněte psát...',
  type,
  selectedBrand,
  className = '',
  hasError = false,
}: VehicleAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterSuggestions = (query: string) => {
    if (query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    let filtered: string[] = [];

    if (type === 'brand') {
      // Filter brands
      filtered = CAR_BRANDS.filter(brand =>
        brand.toLowerCase().includes(normalizedQuery)
      ).slice(0, 10);
    } else if (type === 'model' && selectedBrand) {
      // Filter models for selected brand
      const models = CAR_MODELS[selectedBrand] || [];
      filtered = models.filter(model =>
        model.toLowerCase().includes(normalizedQuery)
      ).slice(0, 10);
    }

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce filtering with 400ms delay for consistency with address autocomplete
    debounceTimer.current = setTimeout(() => {
      filterSuggestions(newValue);
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Label className="text-xs font-semibold block mb-1 text-gray-700">{label}</Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (value.length > 0) {
              filterSuggestions(value);
            }
          }}
          className={`border-gray-300 focus:border-red-500 focus:ring-red-500 shadow-sm bg-white h-8 text-xs ${hasError ? 'border-red-600 bg-red-50 animate-error-blink' : ''}`}
          placeholder={placeholder}
          autoComplete="off"
          disabled={type === 'model' && !selectedBrand}
          data-error={hasError}
        />
      </div>

      {/* Enhanced suggestions dropdown with proper z-index and contrasting background */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[100] w-full mt-1 bg-white border-2 border-gray-400 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-inset text-xs"
            >
              <div className="font-medium text-gray-900">
                {suggestion}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && value.length > 0 && (
        <div className="absolute z-[100] w-full mt-1 bg-white border-2 border-gray-400 rounded-lg shadow-xl p-3 text-center text-gray-500 text-xs">
          Žádné výsledky nenalezeny
        </div>
      )}
    </div>
  );
}
