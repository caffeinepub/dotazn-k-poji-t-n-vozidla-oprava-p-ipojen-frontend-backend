import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface MapyCzSuggestion {
  userData: {
    suggestFirstRow: string;
    suggestSecondRow: string;
    latitude: number;
    longitude: number;
    ward?: string;
    quarter?: string;
    municipality?: string;
    district?: string;
    region?: string;
    zip?: string;
  };
}

interface CombinedSuggestion {
  displayText: string;
  secondaryText: string;
  fullAddress: string;
  source: 'mapy' | 'nominatim';
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  label,
  placeholder = 'Začněte psát adresu...',
  className = '',
  hasError = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CombinedSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchMapyCzSuggestions = async (query: string): Promise<CombinedSuggestion[]> => {
    try {
      const response = await fetch(
        `https://api.mapy.cz/v1/suggest?lang=cs&limit=10&type=regional&query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          return data.items.map((item: MapyCzSuggestion) => {
            const { userData } = item;
            let fullAddress = userData.suggestFirstRow;
            
            // Add additional details if available (city, postal code, region)
            const parts: string[] = [];
            if (userData.municipality && !fullAddress.includes(userData.municipality)) {
              parts.push(userData.municipality);
            }
            if (userData.zip) {
              parts.push(userData.zip);
            }
            if (userData.region && !fullAddress.includes(userData.region)) {
              parts.push(userData.region);
            }
            
            if (parts.length > 0) {
              fullAddress += ', ' + parts.join(', ');
            }

            return {
              displayText: userData.suggestFirstRow,
              secondaryText: userData.suggestSecondRow || '',
              fullAddress,
              source: 'mapy' as const,
            };
          });
        }
      }
    } catch (error) {
      console.error('Mapy.cz API error:', error);
    }
    return [];
  };

  const fetchNominatimSuggestions = async (query: string): Promise<CombinedSuggestion[]> => {
    try {
      // Using OpenStreetMap Nominatim API as fallback for Czech addresses
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=cz&limit=5&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'InsuranceFormApp/1.0', // Required by Nominatim
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          return data.map((item: any) => {
            const displayName = item.display_name || '';
            const parts = displayName.split(', ');
            const primaryText = parts.slice(0, 2).join(', ');
            const secondaryText = parts.slice(2).join(', ');

            return {
              displayText: primaryText,
              secondaryText: secondaryText,
              fullAddress: displayName,
              source: 'nominatim' as const,
            };
          });
        }
      }
    } catch (error) {
      console.error('Nominatim API error:', error);
    }
    return [];
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch from both APIs in parallel
      const [mapyCzResults, nominatimResults] = await Promise.all([
        fetchMapyCzSuggestions(query),
        fetchNominatimSuggestions(query),
      ]);

      // Combine results, prioritizing Mapy.cz
      const combinedResults: CombinedSuggestion[] = [];
      const seenAddresses = new Set<string>();

      // Add Mapy.cz results first
      for (const result of mapyCzResults) {
        const normalizedAddress = result.fullAddress.toLowerCase().trim();
        if (!seenAddresses.has(normalizedAddress)) {
          combinedResults.push(result);
          seenAddresses.add(normalizedAddress);
        }
      }

      // Add Nominatim results if we have few results from Mapy.cz
      if (combinedResults.length < 5) {
        for (const result of nominatimResults) {
          const normalizedAddress = result.fullAddress.toLowerCase().trim();
          if (!seenAddresses.has(normalizedAddress) && combinedResults.length < 10) {
            combinedResults.push(result);
            seenAddresses.add(normalizedAddress);
          }
        }
      }

      setSuggestions(combinedResults);
      setShowSuggestions(combinedResults.length > 0);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce API calls with 400ms delay for optimal performance
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: CombinedSuggestion) => {
    onChange(suggestion.fullAddress);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && (
        <Label className="text-sm font-semibold block mb-2 text-gray-700">{label}</Label>
      )}
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`border-gray-300 focus:border-red-500 focus:ring-red-500 shadow-sm ${hasError ? 'border-red-600 bg-red-50 animate-error-blink' : ''}`}
          placeholder={placeholder}
          autoComplete="off"
          data-error={hasError}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Enhanced suggestions dropdown with opaque white background */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-red-300 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.source}-${index}`}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-inset bg-white"
            >
              <div className="font-medium text-gray-900">
                {suggestion.displayText}
              </div>
              {suggestion.secondaryText && (
                <div className="text-sm text-gray-600 mt-1">
                  {suggestion.secondaryText}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-red-300 rounded-lg shadow-xl p-4 text-center text-gray-500 text-sm">
          Žádné výsledky nenalezeny
        </div>
      )}
    </div>
  );
}
