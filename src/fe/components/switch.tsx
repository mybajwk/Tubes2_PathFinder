import React from "react";
import {Switch, cn} from "@nextui-org/react";
import InfinityIcon from "./iconinfinity";
import { SunFilledIcon } from "./icons";

export default function SwitchFilled() {
  return (
    <Switch
      defaultSelected
      size="lg"
      color="secondary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <InfinityIcon className={className} />
        ) : (
          <SunFilledIcon className={className} />
        )
      }
      classNames={{
        wrapper : "w-[100px] h-[40px]",
        // thumbIcon : ""
        thumb: cn("w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",
          //selected
          "group-data-[selected=true]:ml-16",
          // pressed
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-10",
        ),
      }}
    >
    </Switch>
  );
}
