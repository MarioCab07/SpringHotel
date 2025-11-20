import { useState, useEffect } from "react";

export const useShift = () => {
  const calculateShift = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "MORNING" : "EVENING";
  };

  const [shift, setShift] = useState(calculateShift());

  useEffect(() => {
    const interval = setInterval(() => {
      setShift(calculateShift());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return shift;
};

