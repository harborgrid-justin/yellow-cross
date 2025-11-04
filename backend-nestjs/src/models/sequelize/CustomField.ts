/**
 * CustomField Model - Dynamic schema fields without migrations
 * Allows runtime field creation for flexible data models
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
  tableName: 'custom_fields',
  timestamps: true
})
export class CustomField extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  entityType!: string; // 'case', 'client', 'document', etc.

  @AllowNull(false)
  @Column(DataType.STRING)
  fieldName!: string; // Internal field name (e.g., 'custom_field_1')

  @AllowNull(false)
  @Column(DataType.STRING)
  displayName!: string; // Human-readable label

  @AllowNull(false)
  @Column(DataType.STRING)
  fieldType!: string; // 'text', 'number', 'date', 'boolean', 'select', 'multi_select', 'url', 'email', 'phone'

  @Column(DataType.TEXT)
  description?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  required!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  enabled!: boolean;

  @Column(DataType.JSONB)
  validation?: object; // Validation rules: { min, max, pattern, etc. }

  @Column(DataType.JSONB)
  options?: object; // For select/multi-select: { choices: ['option1', 'option2'] }

  @Column(DataType.STRING)
  defaultValue?: string;

  @Column(DataType.TEXT)
  helpText?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  displayOrder!: number;

  @Column(DataType.STRING)
  groupName?: string; // For organizing fields into groups

  @Column(DataType.JSONB)
  metadata?: object; // Additional configuration

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Instance methods
  validateValue(value: any): { valid: boolean; error?: string } {
    // Type validation
    switch (this.fieldType) {
      case 'number':
        if (isNaN(Number(value))) {
          return { valid: false, error: 'Value must be a number' };
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, error: 'Value must be a boolean' };
        }
        break;
      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          return { valid: false, error: 'Value must be a valid date' };
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { valid: false, error: 'Value must be a valid email' };
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return { valid: false, error: 'Value must be a valid URL' };
        }
        break;
    }

    // Required validation
    if (this.required && (value === null || value === undefined || value === '')) {
      return { valid: false, error: 'Field is required' };
    }

    // Custom validation rules
    if (this.validation) {
      const rules = this.validation as any;
      
      if (rules.min !== undefined && value < rules.min) {
        return { valid: false, error: `Value must be at least ${rules.min}` };
      }
      
      if (rules.max !== undefined && value > rules.max) {
        return { valid: false, error: `Value must be at most ${rules.max}` };
      }
      
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        return { valid: false, error: `Value does not match required pattern` };
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        return { valid: false, error: `Value must be at least ${rules.minLength} characters` };
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        return { valid: false, error: `Value must be at most ${rules.maxLength} characters` };
      }
    }

    return { valid: true };
  }

  // Static methods
  static async getFieldsForEntity(entityType: string): Promise<CustomField[]> {
    return await CustomField.findAll({
      where: { entityType, enabled: true },
      order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']]
    });
  }

  static async getFieldByName(entityType: string, fieldName: string): Promise<CustomField | null> {
    return await CustomField.findOne({
      where: { entityType, fieldName }
    });
  }
}

export default CustomField;
