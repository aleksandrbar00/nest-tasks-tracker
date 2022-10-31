import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailingService {
  constructor(private mailerService: MailerService) {}

  async sendMail<T>(
    to: string,
    {
      subject,
      template,
    }: {
      subject: string;
      template: string;
    },
    context?: T,
  ) {
    this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendConfirmationMail(to: string, url: string, name: string) {
    try {
      await this.sendMail<{
        url: string;
        name: string;
      }>(
        to,
        {
          subject: 'Welcome to tasker app',
          template: './registration',
        },
        {
          url,
          name,
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  async sendExpirationTaskMail(to: string, task: string) {
    try {
      await this.sendMail<{
        url: string;
        task: string;
      }>(
        to,
        {
          subject: 'Expiration task',
          template: './notify-expiration',
        },
        {
          task,
          url: 'http://localhost:3000/tasks',
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
