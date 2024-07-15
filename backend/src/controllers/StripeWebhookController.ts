import { Body, Controller, Post, Route, Header, SuccessResponse } from "tsoa";
import { StripeWebhookService } from "../services/StripeWebhookService";
import express from "express";

@Route("stripe-webhook")
export class StripeWebhookController extends Controller {
  private stripeWebhookService: StripeWebhookService = new StripeWebhookService();

  @SuccessResponse("200", "OK")
  @Post("/")
  public async handleWebhook(@Body() rawBody: Buffer, @Header("stripe-signature") signature: string): Promise<void> {
    try {
      await this.stripeWebhookService.handleWebhook(rawBody, signature);
    } catch (error) {
      console.error('Error processing webhook:', error);
      this.setStatus(400);
    }
  }
}