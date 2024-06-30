import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";
import Widget from "../models/Widget";

export class WidgetsService {
  public async getAllByUser(userId: string): Promise<IWidget[]> {
    return Widget.findAll({ where: { userId } });
  }

  public async create(
    userId: string,
    widgetData: WidgetCreationParams
  ): Promise<IWidget> {
    return Widget.create({ ...widgetData, userId });
  }

  public async update(
    widgetId: string,
    widgetData: WidgetCreationParams
  ): Promise<IWidget | null> {
    const widget = await Widget.findByPk(widgetId);
    if (!widget) {
      return null;
    }
    return widget.update(widgetData);
  }

  public async delete(widgetId: string): Promise<void> {
    const widget = await Widget.findByPk(widgetId);
    if (widget) {
      await widget.destroy();
    }
  }
}
