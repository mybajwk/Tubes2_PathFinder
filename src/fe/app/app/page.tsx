"use client"
import React, { useState, useEffect } from 'react';
import { AiOutlineSwap } from "react-icons/ai";
import InputSearch from "@/components/inputsearch";
import { title } from "@/components/primitives";
import { Switch, Tab, Tabs } from "@nextui-org/react";
import LoadingButton from '@/components/button';
import SwitchFilled from '@/components/switch';
import { useTheme } from 'next-themes';
import ForceGraph from '@/components/graph';

export default function DocsPage() {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const [tabClassNames, setTabClassNames] = useState({
        tabList: "gap-4 border-5 w-full",
        cursor: theme === 'dark' ? "bg-neutral-800" : "bg-zinc-300",
        base: "lg:flex md2:hidden sm:flex-[1.5] xl:flex-[1.2] w-full",
        tabContent: theme === 'dark' ? "text-white" : "text-black"
    });

    useEffect(() => {
        setTabClassNames({
            tabList: "gap-4 border-5 w-full",
            cursor: theme === 'dark' ? "bg-neutral-800" : "bg-neutral-200",
            base: "lg:flex md2:hidden sm:flex-[1.5] xl:flex-[1.2] w-full",
            tabContent: theme === 'dark' ? "group-data-[selected=true]:text-white" : "group-data-[selected=true]:text-black"
        });
    }, [theme]); // Only re-run the effect if theme changes

    const handleSwap = () => {
        setFromValue(toValue);
        setToValue(fromValue);
    };

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
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

    return (
        <div className='flex justify-center flex-col items-center'>
            <h1 className={title()}>App</h1>
            <div className="flex gap-10 mt-10 justify-center items-start">
                <InputSearch key="from" value={fromValue} onChange={(e) => setFromValue(e.target.value)} />
                <div onClick={handleSwap} className="cursor-pointer">
                    <AiOutlineSwap className="w-[40px] h-[40px] mt-8 text-gray-500 hover:text-gray-700" />
                </div>
                <InputSearch key="to" value={toValue} onChange={(e) => setToValue(e.target.value)} />
            </div>

           <div className="flex gap-5 py-10 w-[400px]">
                <Tabs
                    size="lg"
                    aria-label="Options"
                    radius="md"
                    variant="bordered"
                    color="secondary"
                    classNames={tabClassNames}
                >
                    <Tab key="color " title="BFS" />
                    <Tab key="texture" title="IDS" />
                </Tabs>
            </div>
            <div className="flex justify-center items-center">
            <SwitchFilled  />
            </div>
            <div className="flex justify-center mt-8" >
            <LoadingButton/>
            </div>
            <div className="flex justify-center items-center bg-zinc-800 bg-opacity-90 rounded-3xl mt-8 w-[800px]">
            <ForceGraph nodes={nodes} links={links} />
            </div>
        </div>
    );
}
