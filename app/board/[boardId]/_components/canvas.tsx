"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

import {
    CanvasMode,
    CanvasState,
    Color,
    LayerType,
    camera,
    Point,
    Side,
    XYWH,
} from "@/types/canvas";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {
    useHistory,
    useCanRedo,
    useCanUndo,
    useMutation,
    useStorage,
    useOthersMapped,
} from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import {
    connectionIdToColor,
    pointerEventToCanvasPoint,
    resizeBounds,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selectionBox";
import { SelectionTools } from "./selection-tools";

//good practice to have limited layers
const MAX_LAYERS = 101;

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const [camera, setCamera] = useState<camera>({ x: 0, y: 0 });
    const [lastColorUsed, setLastColorUsed] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    //Function to insert a layer
    const insertLayer = useMutation(
        (
            { storage, setMyPresence },
            layerType:
                | LayerType.Ellipse
                | LayerType.Rectangle
                | LayerType.Text
                | LayerType.Note,
            position: Point
        ) => {
            const liveLayers = storage.get("layers");
            if (liveLayers.size >= MAX_LAYERS) {
                return;
            }
            const livelayerIds = storage.get("layerIds");
            const layerId = nanoid();
            const layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100,
                width: 100,
                fill: lastColorUsed,
            });

            livelayerIds.push(layerId);
            liveLayers.set(layerId, layer);

            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            setCanvasState({ mode: CanvasMode.None });
        },
        [lastColorUsed]
    );

    const translatedSelectedLayer = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Translating) {
                return;
            }

            const offset = {
                x: point.x - canvasState.current.x,
                y: point.y - canvasState.current.y,
            };

            const liveLayers = storage.get("layers");
            for (const id of self.presence.selection) {
                const layer = liveLayers.get(id);
                if (layer) {
                    layer.update({
                        x: layer.get("x") + offset.x,
                        y: layer.get("y") + offset.y,
                    });
                }
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [canvasState]
    );

    const unSelectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const resizeSelectedLayer = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Resizing) {
                return;
            }
            const bounds = resizeBounds(
                canvasState.initialBounds,
                canvasState.corner,
                point
            );

            const liveLayers = storage.get("layers");
            const layer = liveLayers.get(self.presence.selection[0]);

            if (layer) {
                layer.update(bounds);
            }
        },
        [canvasState]
    );

    const onResizeHandlePointerDown = useCallback(
        (corner: Side, initialBounds: XYWH) => {
            history.pause();
            setCanvasState({
                mode: CanvasMode.Resizing,
                initialBounds,
                corner,
            });
        },
        [history]
    );

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault();

            const current = pointerEventToCanvasPoint(e, camera);

            if (canvasState.mode === CanvasMode.Translating) {
                translatedSelectedLayer(current);
            } else if (canvasState.mode === CanvasMode.Resizing) {
                resizeSelectedLayer(current);
            }

            setMyPresence({ cursor: current });
        },
        [canvasState, resizeSelectedLayer, camera, translatedSelectedLayer]
    );

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            const point = pointerEventToCanvasPoint(e, camera);
            if (canvasState.mode === CanvasMode.None) {
                return;
            }

            setCanvasState({ origin: point, mode: CanvasMode.Pressing });
        },
        [camera, canvasState.mode, setCanvasState]
    );

    const onPointerUp = useMutation(
        ({}, e) => {
            const point = pointerEventToCanvasPoint(e, camera);

            if (
                canvasState.mode === CanvasMode.None ||
                canvasState.mode === CanvasMode.Pressing
            ) {
                unSelectLayers();
                setCanvasState({ mode: CanvasMode.None });
            } else if (canvasState.mode === CanvasMode.Inserting) {
                insertLayer(canvasState.LayerType, point);
            } else {
                setCanvasState({
                    mode: CanvasMode.None,
                });
            }
            history.resume();
        },
        [camera, canvasState, insertLayer, history, unSelectLayers]
    );

    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
            if (
                canvasState.mode === CanvasMode.Pencil ||
                canvasState.mode === CanvasMode.Inserting
            ) {
                return;
            }
            history.pause();
            e.stopPropagation();

            const point = pointerEventToCanvasPoint(e, camera);

            if (!self.presence.selection.includes(layerId)) {
                setMyPresence({ selection: [layerId] }, { addToHistory: true });
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [setCanvasState, camera, history, canvasState.mode]
    );

    const layersIdsToColorSelection = useMemo(() => {
        const layersIdsToColor: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layersIdsToColorSelection[layerId] =
                    connectionIdToColor(connectionId);
            }
        }
        return layersIdsToColor;
    }, [selections]);

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
            <SelectionTools
                camera={camera}
                setLastColorUsed={setLastColorUsed}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layersIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
};
