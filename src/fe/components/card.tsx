// Assuming you're using TypeScript with React
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

// Define a type for your component's props
type TesProps = {
  title: string;
  nim: string;
  nama: string;
  image: string;
};

const Tes: React.FC<TesProps> = ({ title, nim, nama, image }) => {
  return (
    <Card className="py-4 my-2">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{nim}</p>
        <small className="text-default-500">{nama}</small>
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={image}
          width={270}
        />
      </CardBody>
    </Card>
  );
};

export default Tes;