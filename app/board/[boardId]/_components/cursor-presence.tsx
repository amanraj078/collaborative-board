"use client";

import { memo } from "react";

import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionsId) => (
                <Cursor key={connectionsId} connectionID={connectionsId} />
            ))}
        </>
    );
};

export const CursorPresence = memo(() => {
    return (
        <>
            <Cursors />
        </>
    );
});

CursorPresence.displayName = "CursorPresence";
