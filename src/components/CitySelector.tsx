
import React, { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCities } from '@/hooks/useCities';

interface CitySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const CitySelector = ({ value, onValueChange, placeholder = "Search for your city", required = false }: CitySelectorProps) => {
  const { cities, loading, error } = useCities();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('CitySelector render - cities:', cities.length, 'loading:', loading, 'error:', error);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [cities, searchQuery]);

  // Group cities for better organization (Metro cities first)
  const { metrocities, otherCities } = useMemo(() => {
    const metroList = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
    const metro = filteredCities.filter(city => metroList.includes(city.name));
    const others = filteredCities.filter(city => !metroList.includes(city.name));
    return { metrocities: metro, otherCities: others };
  }, [filteredCities]);

  const selectedCity = cities.find(city => city.name === value);

  if (error) {
    return (
      <div className="w-full p-3 border-2 border-red-300 rounded-md bg-red-50">
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">Error loading cities: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-left font-normal border-2 hover:border-red-300 focus:border-red-500"
          disabled={loading}
        >
          {selectedCity ? (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-red-500" />
              <span className="font-medium">{selectedCity.name}</span>
              {selectedCity.state && (
                <span className="text-muted-foreground ml-1">, {selectedCity.state}</span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {loading ? "Loading cities..." : placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-50" align="start">
        <div className="border-b p-4 bg-red-500 text-white">
          <h3 className="font-semibold text-lg">Select Your City</h3>
          <p className="text-red-100 text-sm">Choose your city to see relevant content</p>
        </div>
        <Command shouldFilter={false} className="max-h-[400px]">
          <CommandInput 
            placeholder="Type to search cities..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 border-b rounded-none focus:ring-0"
          />
          <CommandList className="max-h-[300px] bg-white">
            <CommandEmpty>
              {loading ? "Loading cities..." : "No cities found. Try a different search term."}
            </CommandEmpty>
            
            {metrocities.length > 0 && (
              <CommandGroup heading="Metro Cities">
                {metrocities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      console.log('Selected city:', city.name);
                      onValueChange(city.name);
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center py-3 px-4 hover:bg-red-50 cursor-pointer bg-white"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-red-500",
                        value === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{city.name}</span>
                      {city.state && (
                        <span className="text-sm text-gray-500">{city.state}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {otherCities.length > 0 && (
              <CommandGroup heading={metrocities.length > 0 ? "Other Cities" : "Cities"}>
                {otherCities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      console.log('Selected city:', city.name);
                      onValueChange(city.name);
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center py-3 px-4 hover:bg-red-50 cursor-pointer bg-white"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-red-500",
                        value === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{city.name}</span>
                      {city.state && (
                        <span className="text-sm text-gray-500">{city.state}</span>
                      )}
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

export default CitySelector;
