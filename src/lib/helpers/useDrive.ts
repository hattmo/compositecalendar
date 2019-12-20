import { useState, useEffect } from "react";

export default <T>(key: string, initialValue: T, accessToken: string): [T, (newState: T) => void] => {
    const [val, setVal] = useState(initialValue);
    const [id, setId] = useState("");
    useEffect(() => {
        (async () => {
            const listRes = await fetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const content = await listRes.json();
            const filtered = content.files.filter((item) => {
                return item.name === key;
            });
            if (filtered.length === 0) {
                let body = "\n--sectionBreak\nContent-Type: application/json; charset=UTF-8\n\n";
                body += JSON.stringify({
                    name: key,
                    parents: ["appDataFolder"],
                });
                body += "\n--sectionBreak\nContent-Type: application/json; charset=UTF-8\n\n";
                body += JSON.stringify(initialValue);
                body += "\n--sectionBreak--\n";
                const newRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "multipart/related; boundary=sectionBreak",
                    },
                    body,
                });
                setId((await newRes.json()).id);
            } else {
                const fileID = filtered[0].id;
                setId(filtered[0].id);
                const contentRes = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setVal(await contentRes.json());
            }
        })();
    }, []);
    const backupSetVal = (newVal: T) => {
        setVal(newVal);
        fetch(`https://www.googleapis.com/upload/drive/v3/files/${id}?spaces=appDataFolder&uploadType=media`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newVal),
        });
    };
    return [val, backupSetVal];
};
