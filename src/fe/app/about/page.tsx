import React from "react";
import { title } from "@/components/primitives";
import Tes from "@/components/card";

const cardData = [
  {
    title: "tes",
    nim: "13522047",
    nama: "Farel Winalda",
    image: "/img/tes.png",
  },
  {
    title: "tes",
    nim: "13522077",
    nama: "Enrique Yanuar",
    image: "/img/tes.png",
  },
  {
    title: "tes",
    nim: "13522113",
    nama: "William Glory Henderson",
    image: "/img/tes.png",
  },
];

export default function AboutPage() {
	return (
		<div>
			<h1 className={title()} >About Us</h1>
			<br />
			<div className="w-full flex gap-10 justify-center py-10">
				{cardData.map((card, index) => (
					<Tes key={index} {...card} />
				))}
			</div>
		</div>
	);
}