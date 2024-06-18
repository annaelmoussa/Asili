import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Tags,
  Put,
  Delete,
  Path,
} from "tsoa";
import { WidgetsService } from "../services/WidgetsService";
import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";

@Route("widgets")
@Tags("Widgets")
export class WidgetsController extends Controller {
  @Get()
  public async getWidgets(): Promise<IWidget[]> {
    return new WidgetsService().getAll();
  }

  @Post()
  public async createWidget(
    @Body() requestBody: WidgetCreationParams
  ): Promise<IWidget> {
    return new WidgetsService().create(requestBody);
  }

  @Put("{widgetId}")
  public async updateWidget(
    @Path() widgetId: string,
    @Body() requestBody: WidgetCreationParams
  ): Promise<IWidget | null> {
    return new WidgetsService().update(widgetId, requestBody);
  }

  @Delete("{widgetId}")
  public async deleteWidget(@Path() widgetId: string): Promise<void> {
    return new WidgetsService().delete(widgetId);
  }
}
