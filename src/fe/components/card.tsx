// Assuming you're using TypeScript with React
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

// Define a type for your component's props
type TesProps = {
  title: string;
  nim: string;
  image: string;
};

const Tes: React.FC<TesProps> = ({ title, nim, image }) => {
  return (
    <Card className="py-4 my-2 min-w-[200px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{nim}</p>
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={image}
          width={250}
        />
      </CardBody>
    </Card>
  );
};

export default Tes;