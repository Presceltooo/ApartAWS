import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { NotificationService } from './notification.service';
import { NotificationEvent } from '../common/interfaces/notification-event.interface';

@Injectable()
export class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerService.name);
  private sqsClient: SQSClient;
  private queueUrl: string;
  private isRunning = false;

  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    const region = process.env.AWS_REGION || 'ap-southeast-1';
    const endpoint = process.env.SQS_ENDPOINT;

    this.logger.log(`Initializing SQS Consumer in region ${region}${endpoint ? ` with custom endpoint ${endpoint}` : ''}`);

    this.sqsClient = new SQSClient({
      region,
      ...(endpoint ? { endpoint } : {}),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
      },
    });

    this.queueUrl = process.env.SQS_NOTIFICATION_QUEUE_URL;
    if (!this.queueUrl) {
      this.logger.error('SQS_NOTIFICATION_QUEUE_URL is not defined in environment variables.');
      return;
    }

    this.isRunning = true;
    this.logger.log('Starting SQS polling loop...');
    // Run in the background
    this.pollMessages().catch((err) => {
      this.logger.error('Fatal error in SQS polling loop:', err);
    });
  }

  onModuleDestroy() {
    this.logger.log('Stopping SQS Consumer...');
    this.isRunning = false;
  }

  private async pollMessages() {
    while (this.isRunning) {
      try {
        const response = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20, // Long polling
            VisibilityTimeout: 60,
          }),
        );

        const messages = response.Messages ?? [];
        if (messages.length > 0) {
          this.logger.log(`Received ${messages.length} messages from SQS`);
        }

        for (const message of messages) {
          if (!this.isRunning) break;
          
          try {
            if (!message.Body) {
              throw new Error('Message body is empty');
            }

            const event: NotificationEvent = JSON.parse(message.Body);
            this.logger.log(`Processing message ${message.MessageId} with event type ${event.eventType}`);
            
            await this.notificationService.handleEvent(event);

            // Successfully processed, delete the message from the queue
            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              }),
            );
            this.logger.log(`Deleted message ${message.MessageId} from queue`);
          } catch (error) {
            // Keep message in queue for retry
            this.logger.error(`Error processing message ${message.MessageId}: ${error.message}`, error.stack);
          }
        }
      } catch (error) {
        this.logger.error(`Error polling SQS messages: ${error.message}`, error.stack);
        // Sleep briefly to avoid infinite rapid loops in case of network issues
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}
