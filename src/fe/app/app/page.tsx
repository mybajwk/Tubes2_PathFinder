"use client"
import React, { useState } from 'react';
import { AiOutlineSwap } from "react-icons/ai";
import InputSearch from "@/components/inputsearch";
import { title } from "@/components/primitives";
import { Switch, Tab, Tabs } from "@nextui-org/react";
import LoadingButton from '@/components/button';
import SwitchFilled from '@/components/switch';
  

export default function DocsPage() {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSwap = () => {
        setFromValue(toValue);
        setToValue(fromValue);
    };

    const handleSearch = () => {
        setIsLoading(true);

        // Your function goes here
        // For example, setTimeout simulates an asynchronous operation
        setTimeout(() => {
            // Once your function is done, update isLoading to false
            setIsLoading(false);
        }, 2000); // Simulated 2-second delay
    };

    return (
        <div>
            <h1 className={title()}>App</h1>
            <div className="flex gap-10 mt-10 justify-center items-start">
                <InputSearch key="from" value={fromValue} onChange={(e) => setFromValue(e.target.value)}/>
                <div onClick={handleSwap} className="cursor-pointer">
                    <AiOutlineSwap className="w-[40px] h-[40px] mt-8 text-gray-500 hover:text-gray-700"/>
                </div>
                <InputSearch key="to" value={toValue} onChange={(e) => setToValue(e.target.value)}/>
        

            </div>
            <SwitchFilled />
            <div className="flex gap-5 py-10">
            <Tabs
                    size="lg"
                    aria-label="Options"
                    radius="md"
                    variant="bordered"
                    color="primary"
                    classNames={{
                      tabList: "gap-4 border-5 w-full",
                      cursor:
                        "bg-black",
                      base: "lg:flex md2:hidden sm:flex-[1.5] xl:flex-[1.2] w-full",
                    }}
                  >
                    <Tab key="color" title="BFS" />
                    <Tab key="texture" title="IDS" />
                  </Tabs>
            </div>
            <div>
                <LoadingButton />;
            </div>
        </div>
    );
}
