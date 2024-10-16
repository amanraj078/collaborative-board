"use client";
import { memo } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useMutation, useSelf } from "@liveblocks/react/suspense";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Color, camera } from "@/types/canvas";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface SelectionToolsProps {
    camera: camera;
    setLastColorUsed: (color: Color) => void;
}

export const SelectionTools = memo(
    ({ camera, setLastColorUsed }: SelectionToolsProps) => {
        const selection = useSelf((me) => me.presence.selection);

        const moveToBack = useMutation(
            ({ storage }) => {
                const liveLayerIds = storage.get("layerIds");
                const indices: number[] = [];

                const arr = liveLayerIds.toArray();

                for (let i = 0; i < arr.length; i++) {
                    if (selection.includes(arr[i])) {
                        indices.push(i);
                    }
                }

                for (let i = 0; i < indices.length; i++) {
                    liveLayerIds.move(indices[i], i);
                }
            },
            [selection]
        );

        const moveToFront = useMutation(
            ({ storage }) => {
                const liveLayerIds = storage.get("layerIds");
                const indices: number[] = [];

                const arr = liveLayerIds.toArray();

                for (let i = 0; i < arr.length; i++) {
                    if (selection.includes(arr[i])) {
                        indices.push(i);
                    }
                }

                for (let i = indices.length - 1; i >= 0; i--) {
                    liveLayerIds.move(
                        indices[i],
                        arr.length - 1 - (indices.length - 1 - i)
                    );
                }
            },
            [selection]
        );

        const setfill = useMutation(
            ({ storage }, fill: Color) => {
                const liveLayers = storage.get("layers");
                setLastColorUsed(fill);

                selection.forEach((id) =>
                    liveLayers.get(id)?.set("fill", fill)
                );
            },
            [selection, setLastColorUsed]
        );

        const deleteLayers = useDeleteLayers();

        const selectionBounds = useSelectionBounds();

        if (!selectionBounds) {
            return null;
        }

        const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
        const y = selectionBounds.y + camera.y;
        return (
            <div
                className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
                style={{
                    transform: `translate(
                    calc(${x}px - 50%),
                    calc(${y - 16}px - 100%)
                )`,
                }}
            >
                <ColorPicker onChange={setfill} />
                <div className="flex flex-col gap-y-0.5">
                    <Hint label="Bring to front">
                        <Button
                            variant="board"
                            size="icon"
                            onClick={moveToFront}
                        >
                            <BringToFront />
                        </Button>
                    </Hint>
                    <Hint label="Send to back" side="bottom">
                        <Button
                            variant="board"
                            size="icon"
                            onClick={moveToBack}
                        >
                            <SendToBack />
                        </Button>
                    </Hint>
                </div>
                <div className="flex items-center p;-2 ml-2 border-l border-neutral-200">
                    <Hint label="Delete">
                        <Button
                            variant="board"
                            size="icon"
                            onClick={deleteLayers}
                        >
                            <Trash2 />
                        </Button>
                    </Hint>
                </div>
            </div>
        );
    }
);

SelectionTools.displayName = "SelectionTools";
