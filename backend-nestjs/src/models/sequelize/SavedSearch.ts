/**
 * SavedSearch Model - Stores user's saved search criteria
 * Allows users to save and reuse complex search queries
 * 
 * @module SavedSearch
 */

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from './User';

/**
 * SavedSearch model for storing search criteria
 */
@Table({
  tableName: 'saved_searches',
  timestamps: true,
})
export default class SavedSearch extends Model {
  /**
   * Unique identifier for the saved search
   */
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  /**
   * User-friendly name for the saved search
   */
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  })
  name!: string;

  /**
   * Search criteria stored as JSON string
   */
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  criteria!: string;

  /**
   * Type of search (case, client, document, etc.)
   */
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['case', 'client', 'document', 'task', 'all']],
    },
  })
  type!: string;

  /**
   * Whether this search is shared with team
   */
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isShared!: boolean;

  /**
   * Description of what this search does
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  /**
   * User who created this saved search
   */
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  /**
   * Timestamp when the search was created
   */
  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  /**
   * Timestamp when the search was last updated
   */
  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  /**
   * Timestamp when the search was last used
   */
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastUsedAt?: Date;

  /**
   * Count of how many times this search has been used
   */
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  useCount!: number;

  /**
   * User association
   */
  @BelongsTo(() => User)
  user!: User;

  /**
   * Get parsed criteria object
   */
  getParsedCriteria(): any {
    try {
      return JSON.parse(this.criteria);
    } catch (error) {
      return {};
    }
  }

  /**
   * Update use statistics
   */
  async recordUsage(): Promise<void> {
    this.lastUsedAt = new Date();
    this.useCount += 1;
    await this.save();
  }
}
