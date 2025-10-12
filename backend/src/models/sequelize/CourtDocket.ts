/**
 * CourtDocket Model - Sequelize Model for Court Docket Management
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
  tableName: 'court_dockets',
  timestamps: true
})
export class CourtDocket extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  docketNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  court!: string;

  @Column(DataType.STRING)
  courtDivision?: string;

  @Column(DataType.STRING)
  judge?: string;

  @Column(DataType.STRING)
  caseType?: string;

  @Column(DataType.STRING)
  caseTitle?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  parties?: string[];

  @Column(DataType.DATE)
  filingDate?: Date;

  @Default('Active')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  entries?: object;

  @Column(DataType.JSONB)
  hearings?: object;

  @Column(DataType.JSONB)
  filings?: object;

  @Column(DataType.JSONB)
  rulings?: object;

  @Column(DataType.DATE)
  nextHearingDate?: Date;

  @Column(DataType.STRING)
  nextHearingType?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Add docket entry
  addEntry(entry: any): void {
    const entries = (this.entries as any[]) || [];
    entries.push({
      ...entry,
      timestamp: new Date()
    });
    this.entries = entries;
  }
}

export default CourtDocket;
