import React, { useEffect, useState } from "react";
import {Switch, cn} from "@nextui-org/react";
import InfinityIcon from "./iconinfinity";
import { SunFilledIcon } from "./icons";
import { useTheme } from "next-themes";

export default function SwitchFilled() {
  const { theme } = useTheme();
  const [wrapperClassNames, setWrapperClassNames] = useState("");

  useEffect(() => {
    // Compute class names based on the theme
    const classes = cn(
      "w-[80px] h-[40px]",
      theme === 'dark' ? "group-data-[selected=true]:bg-neutral-700 bg-neutral-700" : "group-data-[selected=true]:bg-neutral-200 bg-neutral-200"
    );
    setWrapperClassNames(classes);
  }, [theme]); // Dependency array includes theme to re-compute on change

  return (
    <div className="flex justify-center items-center">
    <Switch
      defaultSelected
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
          "w-6 h-6 border-2 shadow-lg",
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