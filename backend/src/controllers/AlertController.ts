import {
  Controller,
  Route,
  Get,
  Post,
  Put,
  Security,
  Request,
  Body,
} from "tsoa";
import { AlertService } from "../services/AlertService";
import { IAlertPreference } from "../interfaces/IAlertPreference";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";

@Route("alerts")
export class AlertController extends Controller {
  private alertService: AlertService;

  constructor() {
    super();
    this.alertService = new AlertService();
  }

  @Security("jwt")
  @Get("preferences")
  public async getAlertPreferences(
    @Request() request: AuthenticatedRequest
  ): Promise<IAlertPreference | null> {
    const userId = request.user.id;
    return this.alertService.getAlertPreference(userId);
  }

  @Security("jwt")
  @Put("preferences")
  public async updateAlertPreferences(
    @Request() request: AuthenticatedRequest,
    @Body() preferences: Partial<IAlertPreference>
  ): Promise<IAlertPreference | null> {
    const userId = request.user.id;
    console.log("Received preferences:", JSON.stringify(preferences));
    return this.alertService.updateAlertPreference(userId, preferences);
  }
}
