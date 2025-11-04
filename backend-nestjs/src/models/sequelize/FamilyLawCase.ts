/**
 * Family Law Case Model - Sequelize Model for Family Law
 * Tracks divorce, custody, child support, and family law matters
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
  tableName: 'family_law_cases',
  timestamps: true
})
export class FamilyLawCase extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Index
  @Column(DataType.ENUM('divorce', 'custody', 'child-support', 'adoption', 'domestic-violence', 'other'))
  caseType?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.STRING)
  petitioner?: string;

  @Column(DataType.STRING)
  respondent?: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  hearingDate?: Date;

  @Column(DataType.JSONB)
  children?: object[];

  @Column(DataType.JSONB)
  assets?: object[];

  @Column(DataType.TEXT)
  custodyArrangement?: string;

  @Column(DataType.DECIMAL(10, 2))
  supportAmount?: number;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  documents?: object[];

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  updatedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
