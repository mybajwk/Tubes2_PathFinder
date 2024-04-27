import React, { useState } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react'; // Import Button from Next UI
import { WikiCard } from '@/types';
import Image from 'next/image';

interface WikiCardListProps {
  listCard: WikiCard[];
}

const WikiCardList: React.FC<WikiCardListProps> = ({ listCard }) => {
    const highestDegree = Math.max(...listCard.map(card => card.degree));
    const getDegreeClass = (degree:number) => {
        if (degree === highestDegree) return 'bg-red-600';
        switch (degree) {
            case 0:
                return 'bg-green-700';
            case 1:
                return 'bg-orange-400';
            case 2:
                return 'bg-yellow-300';
            case 3:
                return 'bg-purple-400';
            case 5:
                return 'bg-pink-400';
            case 6:
                return 'bg-gray-700';
            default:
                return 'bg-green-900';
        }
    }

    return (
        <div className='mb-8'>
            {listCard.map((card, index) => (
                <Card
                    key={index}
                    isBlurred
                    className="border-none bg-background/40 dark:bg-default-100/40 dark max-w-[250px]"
                    shadow="sm"
                    radius='none'
                >
                    <div className={`relative h-1 ${getDegreeClass(card.degree)}`}></div>
                    <CardBody>
                        <div 
                            className="grid grid-cols-12 gap-4 items-center justify-center cursor-pointer"
                            onClick={()=>(window.open(card.value,'_blank'))}
                        >
                            <div 
                                className="relative col-span-4 w-[60px] h-[80px]"
                                onClick={()=>(window.open(card.value,'_blank'))}
                            >
                                <Image
                                    alt="Album cover"
                                    className="object-cover"
                                    fill={true}
                                    layout='fill'
                                    objectFit='contain'
                                    src={card.thumbnail.source? card.thumbnail.source : "/img/wikipedia.png"}
                                />
                            </div>

                            <div className="flex flex-col col-span-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold w-[150px] text-foreground/90 truncate">{card.title}</h3>
                                        <p className="text-xs w-[150px] text-foreground/80 truncate">{card.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default WikiCardList;