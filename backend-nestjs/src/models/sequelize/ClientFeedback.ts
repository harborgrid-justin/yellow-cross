/**
 * ClientFeedback Model - Sequelize Model for Client Feedback Management
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
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Client } from './Client';

@Table({
  tableName: 'client_feedback',
  timestamps: true
})
export class ClientFeedback extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  clientId!: string;

  @BelongsTo(() => Client)
  client?: Client;

  @AllowNull(false)
  @Column(DataType.STRING)
  feedbackType!: string;

  @Column(DataType.INTEGER)
  rating?: number;

  @Column(DataType.TEXT)
  comments?: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  feedbackDate!: Date;

  @Column(DataType.STRING)
  relatedService?: string;

  @Column(DataType.STRING)
  relatedCaseId?: string;

  @Default('Pending')
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  respondedBy?: string;

  @Column(DataType.DATE)
  responseDate?: Date;

  @Column(DataType.TEXT)
  response?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default ClientFeedback;
