import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./icons"; 
import debounce from "lodash.debounce";
import { useTheme } from "next-themes";

interface Option {
    label: string;
    value: any;
}

interface InputSearchProps {
    key: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputSearch: React.FC<InputSearchProps> = ({ key, value, onChange }) => {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const lowercaseValue = value.toLowerCase();
    const { theme } = useTheme()

    const fetchSuggestions = useCallback(async (searchValue: string) => {
        if (!searchValue.trim()) {
            setFilteredOptions([]);
            setShowRecommendations(false);
            return;
        }

        const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchValue)}&format=json&origin=*`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const suggestions: Option[] = data[1].slice(0, 5).map((item: string, index: number) => ({
                label: item,
                value: data[3][index],
            }));
            
            setFilteredOptions(suggestions);
            setShowRecommendations(true);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
            setFilteredOptions([]);
            setShowRecommendations(false);
        }
    }, []);

    const debounceFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions]);

    useEffect(() => {
        if (!isOptionSelected) {
            const newValueLowercase = value.toLowerCase();
            debounceFetchSuggestions(newValueLowercase);
        }
    }, [value, debounceFetchSuggestions]);

    const handleOptionSelect = (selectedLabel: string) => {
        const event = {
            target: { value: selectedLabel },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(event);
        setShowRecommendations(false);
        setIsOptionSelected(true);
    };

    useEffect(() => {
        if (isOptionSelected) {
            setIsOptionSelected(false);
        }
    }, [value]);

    const suggestionBoxClasses = `absolute w-[500px] mt-[90px] max-h-60 overflow-auto z-10 rounded-2xl ${
        theme === 'dark' ? "bg-neutral-800 text-white" : "bg-neutral-100 text-gray-900"
    }`;

    const optionClasses = index => `p-2 cursor-pointer ${
        theme === 'dark' ? "hover:bg-black" : "hover:bg-zinc-300"
    } ${
        index === 0 ? "first:rounded-t-2xl" : ""
    } ${
        index === filteredOptions.length - 1 ? "last:rounded-b-2xl" : ""
    }`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        autoComplete="off"
                        size="lg"
                        key={key}
                        value={value}
                        onChange={onChange}
                        type="text"
                        label="Search"
                        labelPlacement="outside"
                        endContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
                        classNames={{
                            inputWrapper : "w-[500px] h-[60px]",
                        }}
                    />
                </div>
                {showRecommendations && filteredOptions.length > 0 && (
                    <div className={suggestionBoxClasses}>
                        {filteredOptions.map((option, index) => (
                            <div 
                                key={option.value} 
                                className={optionClasses(index)}
                                onClick={() => handleOptionSelect(option.label)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div> 
    );
};

export default InputSearch;
