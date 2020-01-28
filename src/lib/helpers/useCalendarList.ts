import { ICalendar } from "../../types";
import { useEffect } from "react";

type callback = (cal: ICalendar[]) => void;

export default (cb: callback) => {
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/calendars");
            if (res.ok) {
                const json = await res.json();
                const filtered = json.map((item) => {
                    return {
                        id: item.id,
                        name: item.summary,
                        accessRole: item.accessRole,
                    };
                });
                cb(filtered);
            } else {
                cb([]);
            }
        })();
    }, []);
};
