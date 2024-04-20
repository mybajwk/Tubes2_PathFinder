"use client"
import React, { useState } from 'react';
import { AiOutlineSwap } from "react-icons/ai";
import InputSearch from "@/components/inputsearch";
import { title } from "@/components/primitives";

export default function DocsPage() {
    // State to hold the values of the inputs
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    // Function to swap the values
    const handleSwap = () => {
        setFromValue(toValue);
        setToValue(fromValue);
    };

    return (
        <div>
            <h1 className={title()}>App</h1>
            <div className="flex gap-10 mt-10 justify-center items-center">
                <InputSearch key="from" value={fromValue} onChange={(e) => setFromValue(e.target.value)} />
                <div onClick={handleSwap} className="cursor-pointer">
                    <AiOutlineSwap className="w-[40px] h-[40px] text-gray-500 hover:text-gray-700"/>
                </div>
                <InputSearch key="to" value={toValue} onChange={(e) => setToValue(e.target.value)} />
            </div>
        </div>
    );
}
