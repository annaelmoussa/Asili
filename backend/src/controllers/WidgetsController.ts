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
import { IWidget, IWidgetWithData, WidgetCreationParams } from "../interfaces/IWidget";
import express from "express";
import { IJwtPayload } from "../interfaces/IJwtPayload";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

@Route("widgets")
@Tags("Widgets")
@Security("jwt", ["ROLE_ADMIN"])
export class WidgetsController extends Controller {
  private widgetsService: WidgetsService;

  constructor() {
    super();
    this.widgetsService = new WidgetsService();
  }

  @Get()
  public async getWidgets(
    @Request() request: AuthenticatedRequest
  ): Promise<IWidget[]> {
    const user = request.user as IJwtPayload;
    return this.widgetsService.getAllByUser(user.id);
  }

  @Get("{widgetId}")
  public async getWidget(
    @Path() widgetId: string
  ): Promise<IWidgetWithData | null> {
    return this.widgetsService.getWidgetWithData(widgetId);
  }

  @Post()
  public async createWidget(
    @Body() requestBody: WidgetCreationParams,
    @Request() request: AuthenticatedRequest
  ): Promise<IWidget> {
    const user = request.user as IJwtPayload;
    return this.widgetsService.create(user.id, requestBody);
  }

  @Put("{widgetId}")
  public async updateWidget(
    @Path() widgetId: string,
    @Body() requestBody: WidgetCreationParams
  ): Promise<IWidget | null> {
    return this.widgetsService.update(widgetId, requestBody);
  }

  @Delete("{widgetId}")
  public async deleteWidget(@Path() widgetId: string): Promise<void> {
    return this.widgetsService.delete(widgetId);
  }

  @Get("data/{modelType}")
  public async getWidgetData(@Path() modelType: string): Promise<any> {
    return this.widgetsService.getWidgetData(modelType);
  }
}
