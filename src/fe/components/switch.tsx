import React, { useEffect, useState } from "react";
import {Switch, cn} from "@nextui-org/react";
import InfinityIcon from "./iconinfinity";
import { SunFilledIcon } from "./icons";
import { useTheme } from "next-themes";

interface SwitchFilledProps {
  isSelected: boolean; 
  onToggle: () => void;
}

const SwitchFilled: React.FC<SwitchFilledProps> = ({ isSelected, onToggle }) => {
  const { theme } = useTheme();
  const [wrapperClassNames, setWrapperClassNames] = useState("");

  useEffect(() => {
   
    const classes = cn(
      "w-[80px] h-[40px] mr-0",
      theme === 'dark' ? "group-data-[selected=true]:bg-neutral-700 bg-neutral-700" : "group-data-[selected=true]:bg-neutral-200 bg-neutral-200"
    );
    setWrapperClassNames(classes);
  }, [theme]);
  
  const handleToggle = () => onToggle();

  return (
    <div className="flex justify-center items-center">
    <Switch
      defaultSelected
      isSelected={isSelected}
      onChange={handleToggle}
      size="lg"
      color="default"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <InfinityIcon className={className} />
        ) : (
          <SunFilledIcon className={className} />
        )
      }
      classNames={{
        wrapper: wrapperClassNames,
        thumb: cn(
          "w-6 h-6 border-2 shadow-lg mr-0",
          "group-data-[hover=true]:border-primary",
          "group-data-[selected=true]:ml-12",
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-12",
        ),
      }}
    >
    </Switch>
    </div>
  );
}

export default SwitchFilled;