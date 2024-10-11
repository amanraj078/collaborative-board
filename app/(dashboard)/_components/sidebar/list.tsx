"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { Items } from "./items";

export const List = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    if (!userMemberships.data?.length) return null;
    return (
        <ul className="space-y-4">
            {userMemberships.data?.map((membership) => (
                <Items
                    id={membership.organization.id}
                    key={membership.organization.id}
                    name={membership.organization.name}
                    imageUrl={membership.organization.imageUrl}
                />
            ))}
        </ul>
    );
};
