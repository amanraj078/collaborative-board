"use client";
import { useEffect, useState } from "react";
import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
    const [isMounted, settIsMounted] = useState(false);

    useEffect(() => {
        settIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <RenameModal />
        </>
    );
};
