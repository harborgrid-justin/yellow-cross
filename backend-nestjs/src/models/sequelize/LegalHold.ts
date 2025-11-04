/**
 * LegalHold Model - Sequelize Model
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
  tableName: 'legal_holds',
  timestamps: true
})
export class LegalHold extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  holdName!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  custodians!: string[];

  @AllowNull(false)
  @Column(DataType.DATE)
  issueDate!: Date;

  @Column(DataType.DATE)
  releaseDate?: Date;

  @Default('Active')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  acknowledgments?: object;

  @Column(DataType.JSONB)
  escalations?: object;

  @AllowNull(false)
  @Column(DataType.STRING)
  issuedBy!: string;

  @Column(DataType.STRING)
  releasedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default LegalHold;
