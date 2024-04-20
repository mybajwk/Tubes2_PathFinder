import React from "react";
import { Input } from "@nextui-org/input"; // Ensure the correct import path
import { SearchIcon } from "./icons";

// Extend the props type to include `value` and `onChange`
type InputSearchProps = {
    key: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Specify the type for the onChange event handler
};

const InputSearch: React.FC<InputSearchProps> = ({ key, value, onChange }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Input
                        size="lg"
                        key={key}
                        value={value} // Controlled component: value is controlled by parent component
                        onChange={onChange} // Controlled component: onChange event handler
                        type="text"
                        label="Search"
                        labelPlacement="outside"
                        endContent={
                            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        className="w-[400px]"
                    />
                </div>
            </div>
        </div>  
    );
};

export default InputSearch;
