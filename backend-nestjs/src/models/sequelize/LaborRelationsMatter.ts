/**
 * Labor Relations Matter Model - Sequelize Model for Labor Relations Management
 * Tracks labor relations, union matters, and collective bargaining
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
  tableName: 'labor_relations_matters',
  timestamps: true
})
export class LaborRelationsMatter extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  matterNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('collective-bargaining', 'union-organizing', 'grievance', 'arbitration', 'unfair-labor-practice', 'strike', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  employerName!: string;

  @Column(DataType.STRING)
  unionName?: string;

  @Column(DataType.STRING)
  bargainingUnit?: string;

  @Column(DataType.DATE)
  contractExpirationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'negotiation', 'mediation', 'arbitration', 'hearing', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  grievances?: object[];

  @Column(DataType.JSONB)
  negotiations?: object[];

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
