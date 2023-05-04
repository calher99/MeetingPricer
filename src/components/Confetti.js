import { useWindowSize } from "@react-hook/window-size";
import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

const Confetti = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    showConfetti && (
      <ReactConfetti
        width={width}
        height={height}
        tweenDuration={100}
        style={{ zIndex: 30 }}
      />
    )
  );
};

export default Confetti;
