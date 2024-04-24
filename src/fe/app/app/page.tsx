"use client"
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AiOutlineSwap } from "react-icons/ai";
import InputSearch from "@/components/inputsearch";
import { title } from "@/components/primitives";
import { Switch, Tab, Tabs } from "@nextui-org/react";
import LoadingButton from '@/components/button';
import SwitchFilled from '@/components/switch';
import { useTheme } from 'next-themes';
import ForceGraph from '@/components/graph';
import { request } from 'http';

export default function DocsPage() {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const [showRecommendationsFrom, setShowRecommendationsFrom] = useState(false);
    const [showRecommendationsTo, setShowRecommendationsTo] = useState(false);
    const [isBfs, setisBfs] = useState('color');
    const [isMulti, setisMulti] = useState(false);

    const [fromDisplay, setFromDisplay] = useState('');
    const [toDisplay, setToDisplay] = useState('');
    const [actualValue, setActualValue] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('');
    // console.log(fromDisplay,fromValue,toDisplay,toValue)

    const [tabClassNames, setTabClassNames] = useState({
        tabList: "gap-4 border-5 w-full",
        cursor: theme === 'dark' ? "bg-neutral-800" : "bg-zinc-300",
        base: "lg:flex md2:hidden sm:flex-[1.5] xl:flex-[1.2] w-full",
        tabContent: theme === 'dark' ? "text-white" : "text-black"
    });

    const handleMulti = () => {
        setisMulti(!isMulti);
    };

    useEffect(() => {
        setTabClassNames({
            tabList: "gap-4 border-5 w-full",
            cursor: theme === 'dark' ? "bg-neutral-800" : "bg-neutral-200",
            base: "lg:flex md2:hidden sm:flex-[1.5] xl:flex-[1.2] w-full",
            tabContent: theme === 'dark' ? "group-data-[selected=true]:text-white" : "group-data-[selected=true]:text-black"
        });
    }, [theme]); // Only re-run the effect if theme changes

    const handleSwap = () => {
        [setFromDisplay, setFromValue, setToDisplay, setToValue].forEach(func => func(''));
        // Logic to swap the actual values
        const tempValue = fromValue;
        setFromValue(toValue);
        setToValue(tempValue);
        // Logic to swap the display values
        const tempDisplay = fromDisplay;
        setFromDisplay(toDisplay);
        setToDisplay(tempDisplay);
    };

    const handleSearch = async () => {
        let url = 'https://localhost:7780/api/bfs'; // The URL to which the request is sent
    
        if (isBfs) {
            url = 'https://localhost:7780/api/bfs'
        } else {
            url = 'https://localhost:7780/api/ids'
        }

        let data = {
            start: fromValue,
            end: toValue,
            is_multi: isMulti
        };

        if (!toValue) {
            const formattedDisplay = toDisplay.replace(/ /g, '_');
            const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(formattedDisplay)}`;
            data.end = url;
        }

        if (!fromValue) {
            const formattedDisplay = fromDisplay.replace(/ /g, '_');
            const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(formattedDisplay)}`;
            data.end = url;
        }

        console.log(data)


        try {
            if (!fromValue || !toValue) {
                throw new Error('Data not completed');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleSelectionChange = (key: React.Key) => {
        if (typeof key === 'string') {
            setisBfs(key);
        } else {
            console.error('Unexpected key type:', typeof key);
        }
    };

    const nodes = [
        { id: 'node1' },
        { id: 'node2' },
        { id: 'node3' },
        { id: 'node5' },
        { id: 'node4' },
      ];
    
      const links = [
        { source: 'node1', target: 'node2' },
        { source: 'node2', target: 'node3' },
        { source: 'node2', target: 'node5' },
        { source: 'node5', target: 'node4'},
        { source: 'node3', target: 'node4'},
      ];

      const handleInputChange = (
        setActualValue: Dispatch<SetStateAction<string>>, 
        setDisplayValue: Dispatch<SetStateAction<string>>
      ) => (
        actualValue: string, 
        displayValue: string
      ) => {
        setActualValue(actualValue);
        setDisplayValue(displayValue);
      };

    return (
        <div className='flex justify-center flex-col items-center'>
            <h1 className={title()}>Search</h1>
            <div className="flex gap-5 py-10 mt-4 w-[400px]">
                <Tabs
                    size="lg"
                    aria-label="Options"
                    radius="md"
                    variant="bordered"
                    color="secondary"
                    classNames={tabClassNames}
                    selectedKey={isBfs}
                    onSelectionChange={handleSelectionChange}
                >
                    <Tab key="color " title="BFS" />
                    <Tab key="texture" title="IDS" />
                </Tabs>
            </div>
            <div className="flex gap-10 justify-center items-start">
            <InputSearch
                key="from"
                displayValue={fromDisplay}
                actualValue={fromValue}
                label="From"  // Set label to "From" for the first input
                onChange={handleInputChange(setFromValue, setFromDisplay)}
                showRecommendations={showRecommendationsFrom}
                setShowRecommendations={setShowRecommendationsFrom}
            />
                <div onClick={handleSwap} className="cursor-pointer">
                    <AiOutlineSwap className="w-[40px] h-[40px] mt-8 text-gray-500 hover:text-gray-700" />
                </div>
                <InputSearch
                    key="to"
                    displayValue={toDisplay}
                    actualValue={toValue}
                    label="To"  // Set label to "To" for the second input
                    onChange={handleInputChange(setToValue, setToDisplay)}
                    showRecommendations={showRecommendationsTo}
                    setShowRecommendations={setShowRecommendationsTo}
                />
            </div>
            <div className="flex justify-center items-center mt-8">
                <SwitchFilled isSelected={isMulti} onToggle={handleMulti} />
            </div>
            <div className="flex justify-center mt-8" >
                <LoadingButton handleSearch={handleSearch} />
            </div>
            <div className="flex justify-center items-center bg-zinc-800 bg-opacity-90 rounded-3xl mt-8 w-[800px]">
                <ForceGraph nodes={nodes} links={links} />
            </div>
        </div>
    );
}
