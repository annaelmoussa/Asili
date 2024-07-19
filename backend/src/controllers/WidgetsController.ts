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
import express from "express";
import { IJwtPayload } from "../interfaces/IJwtPayload";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

@Route("widgets")
@Tags("Widgets")
@Security("jwt", ["ROLE_ADMIN"])
export class WidgetsController extends Controller {
  @Get()
  public async getWidgets(
    @Request() request: AuthenticatedRequest
  ): Promise<IWidget[]> {
    const user = request.user as IJwtPayload;
    return new WidgetsService().getAllByUser(user.id);
  }

  @Post()
  public async createWidget(
    @Body() requestBody: WidgetCreationParams,
    @Request() request: AuthenticatedRequest
  ): Promise<IWidget> {
    const user = request.user as IJwtPayload;
    return new WidgetsService().create(user.id, requestBody);
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
