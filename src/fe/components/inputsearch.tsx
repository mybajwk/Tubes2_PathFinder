import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./icons";
import debounce from "lodash.debounce";
import { useTheme } from "next-themes";

interface Option {
    label: string;
    value: string;
}

interface InputSearchProps {
    key: string;
    displayValue: string;
    actualValue: string;
    onChange: (actualValue: string, displayValue: string) => void;
    showRecommendations: boolean;
    setShowRecommendations: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputSearch: React.FC<InputSearchProps> = ({
    key, displayValue, actualValue, onChange, showRecommendations, setShowRecommendations
}) => {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const { theme } = useTheme();
    const [inputFocused, setInputFocused] = useState(false);

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
            const suggestions = data[1].map((item: string, index: number) => ({
                label: item,
                value: data[3][index],
            }));

            if (!isOptionSelected) {
                setFilteredOptions(suggestions);
                setShowRecommendations(true);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
            setFilteredOptions([]);
            setShowRecommendations(false);
        }
    }, [isOptionSelected]);

    const debounceFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions]);

    useEffect(() => {
        if (!isOptionSelected) {
            debounceFetchSuggestions(displayValue.toLowerCase());
        }
    }, [displayValue, debounceFetchSuggestions, isOptionSelected]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(actualValue, e.target.value); // Update display value while keeping actual value the same
    };
    
    const handleFocus = () => {
        setInputFocused(true);
        if (filteredOptions.length > 0) {
            setShowRecommendations(true);
        }
    };
    
    const handleBlur = () => {
        // Delay hiding recommendations to allow time for option selection
        setTimeout(() => {
            setShowRecommendations(false);
            setInputFocused(false);
        }, 100);
    };

    const handleOptionSelect = (option: Option) => {
        setIsOptionSelected(true); // Indicate an option has been selected
        onChange(option.value, option.label); // Update both actual and display values
    
        setTimeout(() => {
            setShowRecommendations(false);
            setIsOptionSelected(false); // Reset selection flag
            setInputFocused(false); // Remove focus from input after selection
        }, 100);
    };

    const suggestionBoxClasses = `absolute w-[500px] mt-[90px] max-h-[200px] overflow-y-auto z-10 rounded-2xl ${
        theme === 'dark' ? "bg-neutral-800 text-white" : "bg-neutral-100 text-gray-900"
    }`;

    const optionClasses = (index: number) => `p-2 cursor-pointer ${
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
                        value={displayValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        type="text"
                        label="Search"
                        labelPlacement="outside"
                        endContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
                        classNames={{
                            inputWrapper: "w-[500px] h-[60px]",
                        }}
                    />
                </div>
                {showRecommendations && inputFocused && !isOptionSelected && filteredOptions.length > 0 && (
                    <div className={suggestionBoxClasses}>
                        {filteredOptions.map((option, index) => (
                            <div
                                key={option.value}
                                className={optionClasses(index)}
                                onClick={() => handleOptionSelect(option)}
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
