import { useState, useEffect } from "react";

const useDelayedStyles = (isActive, activeDelay = 50, inactiveDelay = 500) => {
  const [delayedActiveClass, setDelayedActiveClass] = useState("");
  const [delayedInactiveClass, setDelayedInactiveClass] = useState("");

  useEffect(() => {
    if (isActive) {
      setDelayedInactiveClass("");
      const activeTimer = setTimeout(() => {
        setDelayedActiveClass("active");
      }, activeDelay);

      return () => clearTimeout(activeTimer);
    } else {
      setDelayedActiveClass("");
      const inactiveTimer = setTimeout(() => {
        setDelayedInactiveClass("inactive");
      }, inactiveDelay);

      return () => clearTimeout(inactiveTimer);
    }
  }, [isActive, activeDelay, inactiveDelay]);

  return {
    delayedActiveClass,
    delayedInactiveClass,
  };
};

export default useDelayedStyles;