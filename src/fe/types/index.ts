import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ApiResponse {
  result: string[][];
  success: boolean;
  total: number;
  total_compare: number;
}

export interface Node {
  id: string;
  group?: number;
  value:string;
  degree:number;
}

export interface Link {
  source: string;
  target: string;
  value?: number;
}

export interface WikiCard {
  title:string;
  thumbnail:{
      source:string;
  }
  description:string;
  degree:number;
  value:string;
}