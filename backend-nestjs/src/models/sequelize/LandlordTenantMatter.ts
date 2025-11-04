/**
 * Landlord Tenant Matter Model - Sequelize Model for Landlord-Tenant Law Management
 * Tracks landlord-tenant disputes and housing matters
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
  tableName: 'landlord_tenant_matters',
  timestamps: true
})
export class LandlordTenantMatter extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  matterNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('eviction', 'non-payment', 'lease-dispute', 'habitability', 'security-deposit', 'unlawful-detainer', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  landlordName!: string;

  @Column(DataType.STRING)
  tenantName?: string;

  @Column(DataType.STRING)
  propertyAddress?: string;

  @Column(DataType.DECIMAL(10, 2))
  monthlyRent?: number;

  @Column(DataType.DATE)
  leaseStartDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'notice-served', 'court-filed', 'hearing', 'judgment', 'appeal', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  notices?: object[];

  @Column(DataType.JSONB)
  payments?: object[];

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
