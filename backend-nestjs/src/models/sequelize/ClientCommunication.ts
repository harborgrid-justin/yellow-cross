/**
 * ClientCommunication Model - Sequelize Model for Client Communication Tracking
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
  tableName: 'client_communications',
  timestamps: true
})
export class ClientCommunication extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  clientId!: string;

  @BelongsTo(() => Client)
  client?: Client;

  @AllowNull(false)
  @Column(DataType.STRING)
  communicationType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  subject!: string;

  @Column(DataType.TEXT)
  content?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  direction!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  contactedBy!: string;

  @Column(DataType.DATE)
  communicationDate!: Date;

  @Column(DataType.STRING)
  duration?: string;

  @Default('Completed')
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default ClientCommunication;
