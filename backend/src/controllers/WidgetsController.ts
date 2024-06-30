import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Route,
  Delete,
  Tags,
  Security,
  Request,
} from "tsoa";
import { WidgetsService } from "../services/WidgetsService";
import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";

@Route("widgets")
@Tags("Widgets")
@Security("jwt")
export class WidgetsController extends Controller {
  @Get()
  public async getWidgets(@Request() request: any): Promise<IWidget[]> {
    return new WidgetsService().getAllByUser(request.user.userId);
  }

  @Post()
  public async createWidget(
    @Body() requestBody: WidgetCreationParams,
    @Request() request: any
  ): Promise<IWidget> {
    const userId = request.user.userId;
    return new WidgetsService().create(userId, requestBody);
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
