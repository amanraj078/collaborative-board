import Image from "next/image";

export const EmptySearch = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-search.png"
                alt="Empty Search"
                width={140}
                height={140}
                className=""
            />
            <h2 className="text-2xl font-semibold mt-6">No Result found</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try searching something else
            </p>
        </div>
    );
};
