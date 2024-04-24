"use client"
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AiOutlineSwap } from "react-icons/ai";
import InputSearch from "@/components/inputsearch";
import { title } from "@/components/primitives";
import { Switch, Tab, Tabs } from "@nextui-org/react";
import LoadingButton from '@/components/button';
import SwitchFilled from '@/components/switch';
import { useTheme } from 'next-themes';
import ForceGraph from '@/components/Graph';

interface ApiResponse {
    result: string[][];
    success: boolean;
    total: number;
    total_compare: number;
}

interface Node {
    id: string;
    group?: number;
    value:string;
    degree:number;
}

interface Link {
    source: string;
    target: string;
    value?: number;
}

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
    const [graphBg,setGraphBg] = useState("bg-zinc-800");

    const [response,setResponse] = useState<ApiResponse>();
    const [responseTime,setResponseTime] = useState<number | undefined>();

    const [dataNode,setDataNode] = useState<Node[]>();
    const [dataLink,setDataLink] = useState<Link[]>();

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

        const bgGraph = theme === 'dark' ? "bg-zinc-800" : "bg-zinc-200"
        setGraphBg(bgGraph);
    }, [theme]);

    useEffect(() =>{
        const dataInsert = response?.result;
        if (dataInsert) {
            const newNodes: Node[] = [];
            const newLinks: Link[] = [];
            for (let i = 0; i < dataInsert?.length; i++) {
                for (let j = 0; j < dataInsert[i].length; j++) {
                    const title = extractTitle(dataInsert[i][j]);

                    let exists = false;
                    if (newNodes) {
                        for (let k = 0; k < newNodes.length; k++) {
                            if (newNodes[k].id === title) {
                                exists = true;
                                break;
                            }
                        }
                    }

                    if (!exists) {
                        newNodes.push({ id: title, value:dataInsert[i][j], degree:j});
                    }

                    if (j < dataInsert[i].length - 1) {
                        newLinks.push({ source: extractTitle(dataInsert[i][j]), target: extractTitle(dataInsert[i][j + 1]) });
                    }
                }
            }

            setDataNode([]);
            setDataLink([]);

            if (newNodes.length > 0) {
                setDataNode(prevNodes => {
                    const nodes = prevNodes || [];
                    return [...nodes, ...newNodes];
                });
            }

            if (newLinks.length > 0) {
                setDataLink(prevLinks => {
                    const links = prevLinks || [];
                    return [...links, ...newLinks];
                });
            }
            
        }
    }, [response]);

    const handleSwap = () => {
        [setFromDisplay, setFromValue, setToDisplay, setToValue].forEach(func => func(''));
        const tempValue = fromValue;
        setFromValue(toValue);
        setToValue(tempValue);
        const tempDisplay = fromDisplay;
        setFromDisplay(toDisplay);
        setToDisplay(tempDisplay);
    };

    const handleSearch = async () => {
        let url = 'http://localhost:3000/api/bfs'; // The URL to which the request is sent
    
        if (isBfs=="color") {
            url = 'http://localhost:3000/api/bfs'
        } else if (isBfs=="texture") {
            url = 'http://localhost:3000/api/ids'
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

        try {
            if (!fromValue || !toValue) {
                throw new Error('Data not completed');
            }

            const startTime = performance.now();
            
            const api = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            setResponseTime(timeTaken)
    
            if (!api.ok) {
                throw new Error('Network response was not ok');
            }
    
            const responseData = await api.json();
            setResponse(responseData);
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

    // const nodes = [
    //     { id: 'node1' },
    //     { id: 'node2' },
    //     { id: 'node3' },
    //     { id: 'node5' },
    //     { id: 'node4' },
    // ];
    
    //   const links = [
    //     { source: 'node1', target: 'node2' },
    //     { source: 'node2', target: 'node3' },
    //     { source: 'node2', target: 'node5' },
    //     { source: 'node5', target: 'node4'},
    //     { source: 'node3', target: 'node4'},
    // ];

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

    const extractTitle = (url: string) => {
        const parts = url.split('/wiki/');
        const titleWithUnderscores = parts[1];
        const titleWithSpaces = titleWithUnderscores.replace(/_/g, ' '); // Replace all underscores with spaces
        return titleWithSpaces;
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
            {response && responseTime && dataNode && dataLink &&
                <>
                    <div className="flex flex-wrap items-center justify-center mt-8 mb-8 text-lg w-[120%]">
                        Found 
                        <b className="text-2xl mx-2">{response.result.length}</b> 
                        paths with 
                        <b className="text-2xl mx-2">{response.result[0].length-1}</b> 
                        degrees of separation from 
                        <b className="text-2xl mx-2">{dataNode.find(node => node.degree === 0)?.id}</b> 
                        to 
                        <b className="text-2xl mx-2">{dataNode.reduce((prev, current) => (prev.degree > current.degree) ? prev : current)?.id}</b> 
                        in 
                        <b className="text-2xl mx-2">{(responseTime / 1000).toFixed(3)} seconds</b>
                        with
                        <b className="text-2xl mx-2">{response.total_compare}</b>
                        total compare.
                    </div>
                    <div className={`flex justify-center items-center ${graphBg} bg-opacity-90 rounded-3xl mt-8 w-[800px]`}>
                        <ForceGraph nodes={dataNode} links={dataLink}/>
                    </div>
                </>
            }
        </div>
    );
}
