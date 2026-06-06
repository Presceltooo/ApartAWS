import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { NotificationEvent } from './notification-event.interface';

@Injectable()
export class SqsProducerService {
  private readonly logger = new Logger(SqsProducerService.name);
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    const region = process.env.AWS_REGION || 'ap-southeast-1';
    const endpoint = process.env.SQS_ENDPOINT;

    this.logger.log(`Initializing SQS client in region ${region}${endpoint ? ` with custom endpoint ${endpoint}` : ''}`);

    this.sqsClient = new SQSClient({
      region,
      ...(endpoint ? { endpoint } : {}),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
      },
    });
    this.queueUrl = process.env.SQS_NOTIFICATION_QUEUE_URL;
  }

  async publishNotification(event: NotificationEvent): Promise<void> {
    try {
      this.logger.log(`Publishing event ${event.eventType} to SQS...`);
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(event),
      });
      const response = await this.sqsClient.send(command);
      this.logger.log(`Event ${event.eventType} published successfully. MessageId: ${response.MessageId}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventType} to SQS: ${error.message}`, error.stack);
      throw error;
    }
  }
}
