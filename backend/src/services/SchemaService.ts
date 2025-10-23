/**
 * SchemaService - Dynamic schema management (Feature 6)
 * Allows runtime field creation without database migrations
 */

import winston from 'winston';
import { CustomField, CustomFieldValue } from '../models/sequelize';
import ActivityService from './ActivityService';

export class SchemaService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
  }

  async createField(data: {
    entityType: string;
    displayName: string;
    fieldType: string;
    description?: string;
    required?: boolean;
    validation?: object;
    options?: object;
    defaultValue?: string;
    helpText?: string;
    groupName?: string;
  }, userId: string): Promise<CustomField> {
    const fieldName = `custom_${data.entityType}_${Date.now()}`;
    
    const field = await CustomField.create({
      ...data,
      fieldName,
      displayOrder: await CustomField.count({ where: { entityType: data.entityType } })
    });

    await ActivityService.logSystemActivity(
      'custom_field_created',
      `Custom field "${data.displayName}" created for ${data.entityType}`,
      { fieldId: field.id, entityType: data.entityType, userId }
    );

    return field;
  }

  async getFieldsForEntity(entityType: string): Promise<CustomField[]> {
    return await CustomField.getFieldsForEntity(entityType);
  }

  async getEntityWithCustomFields(entityType: string, entityId: string, baseData: any): Promise<any> {
    const customValues = await CustomFieldValue.getValuesForEntity(entityType, entityId);
    return { ...baseData, customFields: customValues };
  }

  async setCustomFieldValue(
    entityType: string,
    entityId: string,
    fieldId: string,
    value: any,
    userId: string
  ): Promise<void> {
    const field = await CustomField.findByPk(fieldId);
    if (!field) throw new Error('Field not found');

    const validation = field.validateValue(value);
    if (!validation.valid) throw new Error(validation.error);

    await CustomFieldValue.setValueForEntity(entityType, entityId, fieldId, field, value);
  }
}

export default new SchemaService();
