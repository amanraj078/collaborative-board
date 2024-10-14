export type Color = {
    r: number;
    g: number;
    b: number;
};

export type camera = {
    x: number;
    y: number;
};

export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note,
}

export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    points: number[][];
    value?: string;
};

export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type NoteLayer = {
    type: LayerType.Note;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type Point = {
    x: number;
    y: number;
};

export type XYWH = {
    x: number;
    y: number;
    height: number;
    width: number;
};

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

/**
 * The current state of the canvas, which determines how user interactions are interpreted.
 * For example, if the state is "drawing", then mouse clicks will create new shapes.
 */
export type CanvasState =
    | { mode: CanvasMode.None }
    | { mode: CanvasMode.SelectionNet; origin: Point; current?: Point }
    | { mode: CanvasMode.Translating; current: Point }
    | {
          mode: CanvasMode.Inserting;
          LayerType:
              | LayerType.Ellipse
              | LayerType.Rectangle
              | LayerType.Text
              | LayerType.Note;
      }
    | { mode: CanvasMode.Pencil }
    | { mode: CanvasMode.Pressing; origin: Point }
    | { mode: CanvasMode.Resizing; initialBounds: XYWH; corner: Side };

/**
 * The different modes the canvas can be in.
 * For example, in "drawing" mode, the user can draw new shapes on the canvas.
 * In "selecting" mode, the user can select existing shapes on the canvas.
 */
export enum CanvasMode {
    /**
     * The default mode, in which the user can't do anything.
     */
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}

export type Layer =
    | RectangleLayer
    | EllipseLayer
    | PathLayer
    | TextLayer
    | NoteLayer;
