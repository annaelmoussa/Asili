import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";
import Widget from "../models/Widget";

export class WidgetsService {
  public async getAll(): Promise<IWidget[]> {
    return Widget.findAll();
  }

  public async create(params: WidgetCreationParams): Promise<IWidget> {
    return Widget.create(params);
  }

  public async update(
    widgetId: string,
    params: WidgetCreationParams
  ): Promise<IWidget | null> {
    const widget = await Widget.findByPk(widgetId);
    if (!widget) {
      return null;
    }
    return widget.update(params);
  }

  public async delete(widgetId: string): Promise<void> {
    const widget = await Widget.findByPk(widgetId);
    if (widget) {
      await widget.destroy();
    }
  }
}
