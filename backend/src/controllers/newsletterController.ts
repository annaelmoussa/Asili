import { Controller, Post, Body, Security, Route, Get, Request } from "tsoa";
import { NewsletterService } from "../services/NewsletterService";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import  User  from "../models/User";

@Route("newsletter")
export class NewsletterController extends Controller {
  private newsletterService: NewsletterService;

  constructor() {
    super();
    this.newsletterService = new NewsletterService();
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Post("send")
  public async sendNewsletter(
    @Body() newsletterData: { subject: string; content: string }
  ): Promise<void> {
    await this.newsletterService.sendNewsletter(
      newsletterData.subject,
      newsletterData.content
    );
  }

@Security("jwt")
@Post("subscribe")
public async subscribeToNewsletter(@Request() request: AuthenticatedRequest): Promise<void> {
  const userId = request.user.id;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  await this.newsletterService.subscribeToNewsletter(user.email, userId);
}

@Post("subscribe-guest")
  public async subscribeGuestToNewsletter(@Body() body: { email: string }): Promise<void> {
    await this.newsletterService.subscribeToNewsletter(body.email);
}

@Security("jwt")
@Post("unsubscribe")
public async unsubscribeFromNewsletter(@Request() request: AuthenticatedRequest): Promise<void> {
  const userId = request.user.id;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  await this.newsletterService.unsubscribeFromNewsletter(user.email);
}

@Security("jwt")  
@Get("subscription-status")
public async getNewsletterSubscriptionStatus(@Request() request: AuthenticatedRequest): Promise<{ isSubscribed: boolean }> {
    const userId = request.user.id;
return await this.newsletterService.getSubscriptionStatus(userId);
}
}