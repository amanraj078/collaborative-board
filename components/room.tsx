"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({
    children,
    roomId,
    fallback,
}: {
    children: ReactNode;
    roomId: string;
    fallback: ReactNode;
}) {
    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
            <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
