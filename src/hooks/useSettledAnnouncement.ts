import { useEffect, useRef, useState } from "react";

/**
 * Returns `message` once it has stopped changing for `delay` ms, for use in an
 * aria-live region. Nothing is announced until the message first changes, so
 * screen readers aren't flooded on page load or on every keystroke.
 */
export const useSettledAnnouncement = (message: string, delay = 1000) => {
    const initialMessage = useRef(message);
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        if (message === initialMessage.current) {
            return;
        }
        initialMessage.current = "";

        const timer = setTimeout(() => setAnnouncement(message), delay);
        return () => clearTimeout(timer);
    }, [message, delay]);

    return announcement;
};
