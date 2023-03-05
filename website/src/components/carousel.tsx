import Image from "next/image";
import { useState, useEffect } from "react";

const CarouselColumn = ({
  items,
  speed,
  initOffset,
}: {
  items: string[];
  speed: number;
  initOffset: number;
}) => {
  const [offset, setOffset] = useState(initOffset);
  const itemHeight = 500; // assuming each item has a height of 384px
  const totalHeight = items.length * itemHeight * 2; // double the height to create a seamless loop

  useEffect(() => {
    let lastTimestamp: number | null = null;
    let requestId: number | null = null;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const elapsed = timestamp - lastTimestamp;
      const distance = (speed * elapsed) / 1500;
      const newOffset = (offset + distance) % totalHeight;
      setOffset(newOffset);

      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      requestId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      window.cancelAnimationFrame(requestId!);
      requestId = null;
      lastTimestamp = null;
    };

    // Start the animation when the component mounts
    startAnimation();

    // Stop the animation when the component unmounts
    return stopAnimation;
  }, [offset, speed, totalHeight]);

  return (
    <ul
      className="space-y-4 overflow-hidden"
      style={{ height: itemHeight * 3 }}
    >
      {items.concat(items).map((item, index) => (
        <li
          key={index}
          className="transform "
          style={{ transform: `translateY(${-offset}px)` }}
        >
          <Image
            src={item}
            alt="Shortzoo Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="h-full w-full rounded-md"
          />
        </li>
      ))}
    </ul>
  );
};

export const ThreeCarouselColumns = () => {
  const items1 = [
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
  ];
  const items2 = [
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
  ];
  const items3 = [
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
    "/images/Test.png",
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      <CarouselColumn items={items1} speed={56} initOffset={550} />
      <CarouselColumn items={items2} speed={147} initOffset={230} />
      <CarouselColumn items={items3} speed={110} initOffset={350} />
    </div>
  );
};
