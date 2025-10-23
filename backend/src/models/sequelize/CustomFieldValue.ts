/**
 * CustomFieldValue Model - Stores values for custom fields
 * EAV (Entity-Attribute-Value) pattern for flexible data storage
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  AllowNull,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { CustomField } from './CustomField';

@Table({
  tableName: 'custom_field_values',
  timestamps: true
})
export class CustomFieldValue extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => CustomField)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  fieldId!: string;

  @BelongsTo(() => CustomField)
  field?: CustomField;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  entityType!: string; // 'case', 'client', 'document', etc.

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  entityId!: string; // ID of the entity this value belongs to

  @Column(DataType.TEXT)
  textValue?: string;

  @Column(DataType.DECIMAL)
  numberValue?: number;

  @Column(DataType.BOOLEAN)
  booleanValue?: boolean;

  @Column(DataType.DATE)
  dateValue?: Date;

  @Column(DataType.JSONB)
  jsonValue?: object; // For complex types like multi-select, arrays, objects

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Instance methods
  getValue(): any {
    // Return the appropriate value based on the field type
    if (this.textValue !== null && this.textValue !== undefined) return this.textValue;
    if (this.numberValue !== null && this.numberValue !== undefined) return this.numberValue;
    if (this.booleanValue !== null && this.booleanValue !== undefined) return this.booleanValue;
    if (this.dateValue !== null && this.dateValue !== undefined) return this.dateValue;
    if (this.jsonValue !== null && this.jsonValue !== undefined) return this.jsonValue;
    return null;
  }

  async setValue(field: CustomField, value: any): Promise<void> {
    // Clear all values first
    this.textValue = undefined;
    this.numberValue = undefined;
    this.booleanValue = undefined;
    this.dateValue = undefined;
    this.jsonValue = undefined;

    // Set the appropriate value based on field type
    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        this.textValue = String(value);
        break;
      case 'number':
        this.numberValue = Number(value);
        break;
      case 'boolean':
        this.booleanValue = Boolean(value);
        break;
      case 'date':
        this.dateValue = value instanceof Date ? value : new Date(value);
        break;
      case 'select':
        this.textValue = String(value);
        break;
      case 'multi_select':
        this.jsonValue = Array.isArray(value) ? value : [value];
        break;
      default:
        this.jsonValue = value;
    }
  }

  // Static methods
  static async getValuesForEntity(
    entityType: string,
    entityId: string
  ): Promise<Record<string, any>> {
    const values = await CustomFieldValue.findAll({
      where: { entityType, entityId },
      include: [CustomField]
    });

    const result: Record<string, any> = {};
    
    for (const value of values) {
      if (value.field) {
        result[value.field.fieldName] = value.getValue();
      }
    }

    return result;
  }

  static async setValueForEntity(
    entityType: string,
    entityId: string,
    fieldId: string,
    field: CustomField,
    value: any
  ): Promise<CustomFieldValue> {
    // Find existing value or create new one
    let fieldValue = await CustomFieldValue.findOne({
      where: { entityType, entityId, fieldId }
    });

    if (!fieldValue) {
      fieldValue = CustomFieldValue.build({
        entityType,
        entityId,
        fieldId
      });
    }

    await fieldValue.setValue(field, value);
    await fieldValue.save();

    return fieldValue;
  }

  static async deleteValuesForEntity(
    entityType: string,
    entityId: string
  ): Promise<number> {
    return await CustomFieldValue.destroy({
      where: { entityType, entityId }
    });
  }
}

export default CustomFieldValue;
