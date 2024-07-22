import {
  IWidget,
  IWidgetWithData,
  WidgetCreationParams,
} from "../interfaces/IWidget";
import Widget from "../models/Widget";
import { WidgetDataService } from "./WidgetDataService";

export class WidgetsService {
  private widgetDataService: WidgetDataService;

  constructor() {
    this.widgetDataService = new WidgetDataService();
  }

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
    if (!widget) return null;
    return widget.update(widgetData);
  }

  public async delete(widgetId: string): Promise<void> {
    const widget = await Widget.findByPk(widgetId);
    if (widget) await widget.destroy();
  }

  public async getWidgetWithData(
    widgetId: string
  ): Promise<IWidgetWithData | null> {
    const widget = await Widget.findByPk(widgetId);
    if (!widget) return null;
    const data = await this.widgetDataService.getDataForWidget(widget);
    return { ...widget.toJSON(), data };
  }

  public async getWidgetData(modelType: string): Promise<any> {
    return this.widgetDataService.getDataForModelType(modelType);
  }
}
