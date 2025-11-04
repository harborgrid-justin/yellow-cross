/**
 * Corporate Governance Model - Sequelize Model for Corporate Governance
 * Tracks board meetings, shareholder meetings, and corporate resolutions
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  Unique,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'corporate_governance',
  timestamps: true
})
export class CorporateGovernance extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  governanceNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('board-meeting', 'shareholder-meeting', 'resolution', 'filing'))
  governanceType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  companyName?: string;

  @Column(DataType.DATE)
  meetingDate?: Date;

  @Column(DataType.STRING)
  location?: string;

  @Default('pending')
  @Index
  @Column(DataType.ENUM('pending', 'scheduled', 'completed', 'cancelled'))
  status!: string;

  @Column(DataType.TEXT)
  agenda?: string;

  @Column(DataType.TEXT)
  minutes?: string;

  @Column(DataType.JSONB)
  attendees?: object[];

  @Column(DataType.JSONB)
  resolutions?: object[];

  @Column(DataType.ARRAY(DataType.STRING))
  documents?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  updatedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
