import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import sendEmail from "../services/emailService";
import { SendEmailRequest } from "../interfaces/ISendEmailRequest";


@Route("email")
export class EmailController extends Controller {
  @Post("send")
  @SuccessResponse("200", "Email sent successfully")
  public async sendEmail(@Body() requestBody: SendEmailRequest): Promise<{ message: string }> {
    const { to, subject, text,html } = requestBody;
    try {
      await sendEmail(to, subject, text,html);
      return { message: "Email sent successfully" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
          throw new Error("Unknown error");
      }
    }
  }
}
