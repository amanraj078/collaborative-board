"use client";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
    const searchParams = useSearchParams();
    const search = searchParams?.get("search") || "";
    const router = useRouter();
    const [value, setValue] = useState(search);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const params = new URLSearchParams(window.location.search);
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            const newUrl = `${window.location.pathname}?${params.toString()}`;
            router.push(newUrl);
        }
    };

    return (
        <div className="w-full relative">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                className="w-full max-w-[516px] pl-9"
                placeholder="Search Board"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={value}
            />
        </div>
    );
};
