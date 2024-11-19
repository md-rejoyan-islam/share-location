"use client";

import { useEffect, useState } from "react";

const TimeDifference = ({ joinedTime }: { joinedTime: Date }) => {
  const [timeDiff, setTimeDiff] = useState<string>("");

  useEffect(() => {
    const startDate = new Date(joinedTime);

    const updateDiff = () => {
      const now = new Date();
      const diffInMs = now.getTime() - startDate.getTime();

      const seconds = Math.floor((diffInMs / 1000) % 60);
      const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));

      let result = "";
      if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""} `;
      if (minutes > 0) result += `${minutes} min `;
      result += `${seconds} s`;

      setTimeDiff(result.trim());
    };

    updateDiff();
    const intervalId = setInterval(updateDiff, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [joinedTime]);

  return timeDiff ? <span>{timeDiff}</span> : null;
};

export default TimeDifference;
