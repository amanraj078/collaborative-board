"use client";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoard = () => {
    const router = useRouter();
    const { organization } = useOrganization();
    const { mutate, pending } = useApiMutation(api.board.create);

    const onClick = () => {
        if (!organization) return;
        mutate({
            orgId: organization.id,
            title: "Untitled Board",
        })
            .then((id) => {
                toast.success("Board created successfully");
                router.push(`/board/${id}`);
            })
            .catch(() => {
                toast.error("Failed to create board");
            });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-board.png"
                alt="Empty Search"
                width={110}
                height={110}
                className=""
            />
            <h2 className="text-2xl font-semibold mt-6">No Boards Found</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <Button disabled={pending} onClick={onClick} size="lg">
                    Create Board
                </Button>
            </div>
        </div>
    );
};
