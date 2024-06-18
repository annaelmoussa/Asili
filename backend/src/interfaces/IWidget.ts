export interface IWidget {
  id: string;
  name: string;
  type: string;
  settings: any;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetCreationParams {
  name: string;
  type: string;
  settings: any;
  x: number;
  y: number;
  w: number;
  h: number;
}
