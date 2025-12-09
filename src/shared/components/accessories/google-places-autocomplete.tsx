import { cn } from "@utils/classnames";
import React, { useEffect, useRef, useCallback } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface GooglePlacesAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  className?: string;
  parentClassName?: string;
  error?: string;
}

export const GooglePlacesAutocomplete: React.FC<
  GooglePlacesAutocompleteProps
> = ({
  label,
  placeholder = "Enter location",
  value,
  onChange,
  onPlaceSelect,
  className = "",
  parentClassName = "",
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const scriptLoadAttemptedRef = useRef(false);
  const isUserTypingRef = useRef(false);

  // Hook setup - disable init on mount, we'll handle it manually
  const {
    ready,
    value: autoValue,
    setValue: setAutoValue,
    suggestions: { status, data },
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: false,
    defaultValue: value,
    requestOptions: {
      componentRestrictions: {
        country: "ng",
      },
    },
  });

  /**
   * Load Google Maps script only once
   */
  useEffect(() => {
    if (scriptLoadAttemptedRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.warn("Google Places API key missing.");
      scriptLoadAttemptedRef.current = true;
      return;
    }

    // If already exists & loaded
    if (window.google?.maps?.places) {
      scriptLoadAttemptedRef.current = true;
      // Initialize the hook if script is already loaded
      if (init) {
        init();
      }
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    ) as HTMLScriptElement;

    if (existingScript) {
      scriptLoadAttemptedRef.current = true;
      // Wait for existing script to load
      const checkReady = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkReady);
          if (init) {
            init();
          }
        }
      }, 100);
      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkReady), 10000);
      return;
    }

    // Create script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Initialize the hook when script loads
      if (init) {
        init();
      }
    };

    script.onerror = () => {
      console.warn("Google Maps failed to load.");
    };

    document.head.appendChild(script);
    scriptLoadAttemptedRef.current = true;
  }, [init]);

  /**
   * Initialize autocomplete value when hook becomes ready
   */
  useEffect(() => {
    if (ready && value && value !== autoValue) {
      setAutoValue(value, false);
    }
  }, [ready]); // Run when ready state changes

  /**
   * Sync parent value to autocomplete only when value changes externally (not from typing)
   */
  useEffect(() => {
    // Skip sync if user just typed (handled in handleInputChange)
    if (isUserTypingRef.current) {
      isUserTypingRef.current = false;
      return;
    }

    // Skip if not ready yet
    if (!ready) return;

    // Sync external value changes to autocomplete
    // This handles programmatic value changes from parent
    if (value !== autoValue) {
      setAutoValue(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // Sync when parent value changes

  /**
   * Handle typing - always update parent, conditionally update autocomplete
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Mark that user is typing to prevent sync conflicts
      isUserTypingRef.current = true;

      // Always update parent immediately
      onChange(newValue);

      // Update autocomplete if ready (this triggers suggestions)
      if (ready) {
        setAutoValue(newValue, true);
      }
    },
    [onChange, ready, setAutoValue]
  );

  /**
   * Handle selecting a suggestion
   */
  const handleSelect = useCallback(
    async (suggestion: { place_id: string; description: string }) => {
      const text = suggestion.description;

      setAutoValue(text, false);
      clearSuggestions();
      onChange(text);

      if (onPlaceSelect) {
        try {
          const geo = await getGeocode({ address: text });
          const { lat, lng } = await getLatLng(geo[0]);

          onPlaceSelect({ address: text, lat, lng });
        } catch (err) {
          console.error("Geocode error:", err);
          onPlaceSelect({ address: text, lat: 0, lng: 0 });
        }
      }

      inputRef.current?.focus();
    },
    [clearSuggestions, onChange, onPlaceSelect, setAutoValue]
  );

  /**
   * Click outside to close suggestions
   */
  useEffect(() => {
    if (!ready) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ready, clearSuggestions]);

  return (
    <div className={cn("w-full relative", parentClassName)}>
      {label && (
        <label className="block text-gray-600 text-sm mb-2 font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all",
            error && "ring-2 ring-red-500",
            className
          )}
        />

        {ready && status === "OK" && data.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {data.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelect(item)}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {item.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500">
                  {item.structured_formatting.secondary_text}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
