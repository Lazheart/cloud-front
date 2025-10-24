"use client"

import { useState, useEffect, type SetStateAction } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import { useDatabase } from "../hooks/useDatabase"

interface City {
  value: string;
  label: string;
}

export default function CitySearch() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [cities, setCities] = useState<City[]>([])
  const { data: cinemas, loading, handleListCinemas } = useDatabase()

  useEffect(() => {
    // Load cinemas to get cities
    handleListCinemas()
  }, [])

  useEffect(() => {
    if (cinemas && Array.isArray(cinemas)) {
      // Extract unique cities from cinemas
      const uniqueCities = Array.from(
        new Set(cinemas.map((cinema: any) => cinema.ciudad))
      ).map(ciudad => ({
        value: ciudad,
        label: ciudad
      }))
      setCities(uniqueCities)
    }
  }, [cinemas])

  return (
    <div className="hidden lg:block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? cities.find((city) => city.value === value)?.label
              : "Select City"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search City..." />
            <CommandList>
              <CommandEmpty>No City found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.value}
                    value={city.value}
                    onSelect={(currentValue: SetStateAction<string>) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {city.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === city.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}