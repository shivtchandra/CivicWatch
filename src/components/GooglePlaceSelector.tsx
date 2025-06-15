import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';
import { COUNTRIES } from '@/data/countries';

interface GooglePlaceSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const GooglePlaceSelector = ({ value, onValueChange, placeholder = "Search for your country" }: GooglePlaceSelectorProps) => {
  const { places, loading, error, searchPlaces } = useGooglePlaces();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get the instantly filtered countries based on the user's input
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Only call the API if the user types >=2 chars and there are no local matches
  useEffect(() => {
    if (searchQuery.length >= 2 && filteredCountries.length === 0) {
      searchPlaces(searchQuery);
    }
    // Only call API if local results exhausted
  }, [searchQuery, filteredCountries.length, searchPlaces]);

  const handleItemSelect = useCallback((countryName: string) => {
    onValueChange(countryName);
    setOpen(false);
    setSearchQuery('');
  }, [onValueChange]);

  const placesList = useMemo(() => {
    // Prefer local results if any, else use Places API
    if (filteredCountries.length > 0) {
      // Map countries to PlaceResult-like objects for rendering
      return filteredCountries.map((c) => ({
        place_id: c.code,
        description: c.name,
        structured_formatting: {
          main_text: c.name,
          secondary_text: c.code,
        }
      }));
    }
    return places;
  }, [filteredCountries, places]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-left font-normal border-2 hover:border-red-300 focus:border-red-500"
        >
          {value ? (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-red-500" />
              <span className="font-medium">{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-50" align="start">
        <div className="border-b p-4 bg-red-500 text-white">
          <h3 className="font-semibold text-lg">Select Your Country</h3>
          <p className="text-red-100 text-sm">Start typing to search countries worldwide</p>
        </div>
        <Command shouldFilter={false} className="max-h-[400px]">
          <CommandInput 
            placeholder="Type country name..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 border-b rounded-none focus:ring-0"
          />
          <CommandList className="max-h-[300px] bg-white">
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching countries...
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-6">
                  {error}
                </div>
              ) : searchQuery.length < 2 && filteredCountries.length === COUNTRIES.length ? (
                "Type at least 2 characters to search"
              ) : (
                "No countries found"
              )}
            </CommandEmpty>
            
            {placesList.length > 0 && (
              <CommandGroup>
                {placesList.map((place) => (
                  <CommandItem
                    key={place.place_id}
                    value={place.structured_formatting.main_text} // Use main_text as the value for onSelect
                    onSelect={handleItemSelect} // Pass the memoized handler
                    className="flex items-center py-3 px-4 hover:bg-red-50 cursor-pointer bg-white"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-red-500",
                        value === place.structured_formatting.main_text ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Globe className="h-4 w-4 mr-3 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {place.structured_formatting.main_text}
                      </span>
                      <span className="text-sm text-gray-500">
                        {place.structured_formatting.secondary_text}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GooglePlaceSelector;
