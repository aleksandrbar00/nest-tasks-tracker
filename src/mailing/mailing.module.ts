import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailingService } from './mailing.service';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'koashop0011@gmail.com',
          pass: 'gqitaqlupuvhoydz',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
