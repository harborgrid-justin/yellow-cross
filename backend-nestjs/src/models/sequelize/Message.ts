/**
 * Message Model - Sequelize Model for Communication Messages
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'messages',
  timestamps: true
})
export class Message extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  senderId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  recipientId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  messageType!: string;

  @Column(DataType.STRING)
  subject?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @Default('Sent')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  read!: boolean;

  @Column(DataType.DATE)
  readAt?: Date;

  @Column(DataType.STRING)
  threadId?: string;

  @Column(DataType.STRING)
  replyToId?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

  @Default('Normal')
  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.STRING)
  relatedCaseId?: string;

  @Column(DataType.STRING)
  relatedClientId?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  ccRecipients?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  bccRecipients?: string[];

  @Column(DataType.DATE)
  scheduledFor?: Date;

  @Column(DataType.TEXT)
  metadata?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default Message;
