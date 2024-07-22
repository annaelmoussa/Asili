export interface IWidget {
  id?: string;
  name: string;
  type: string;
  settings: any;
  x: number;
  y: number;
  w: number;
  h: number;
  userId: string;
  modelType: string;
}

export interface WidgetCreationParams {
  name: string;
  type: string;
  settings: any;
  x: number;
  y: number;
  w: number;
  h: number;
  userId: string;
  modelType: string;
}

export interface IWidgetWithData extends IWidget {
  data?: any;
}
