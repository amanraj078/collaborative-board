"use client";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Hint } from "@/components/hint";

interface ItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const Items = ({ id, name, imageUrl }: ItemProps) => {
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();
    const isActive = organization?.id === id;
    const onClick = () => {
        if (!setActive) return;
        setActive({ organization: id });
    };
    return (
        <div className="aspect-square relative">
            <Hint label={name} side="right" align="start" sideOffset={18}>
                <Image
                    alt={name}
                    src={imageUrl}
                    fill={true}
                    onClick={onClick}
                    className={cn(
                        "rounded-md cursor-pointer opacity-50 hover:opacity-100 transition",
                        isActive && "opacity-100"
                    )}
                />
            </Hint>
        </div>
    );
};
