/**
 * NotificationPreference Model - User notification preferences
 * Allows users to control how and when they receive notifications
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'notification_preferences',
  timestamps: true
})
export class NotificationPreference extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  // Channel preferences
  @Default(true)
  @Column(DataType.BOOLEAN)
  inAppEnabled!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  emailEnabled!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  socketEnabled!: boolean;

  // Category preferences
  @Column(DataType.JSONB)
  categoryPreferences?: object; // { case: { email: true, inApp: true }, task: {...} }

  // Frequency settings
  @Default('immediate')
  @Column(DataType.STRING)
  emailFrequency!: string; // 'immediate', 'hourly', 'daily', 'weekly', 'never'

  @Default(true)
  @Column(DataType.BOOLEAN)
  digestEnabled!: boolean;

  @Default('08:00')
  @Column(DataType.STRING)
  digestTime!: string; // Time for daily digest

  // Quiet hours
  @Default(false)
  @Column(DataType.BOOLEAN)
  quietHoursEnabled!: boolean;

  @Column(DataType.STRING)
  quietHoursStart?: string; // e.g., '22:00'

  @Column(DataType.STRING)
  quietHoursEnd?: string; // e.g., '08:00'

  @Column(DataType.ARRAY(DataType.STRING))
  quietHoursDays?: string[]; // ['saturday', 'sunday']

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Instance methods
  shouldSendNotification(type: string, category: string, channel: string): boolean {
    // Check if in quiet hours
    if (this.quietHoursEnabled && this.isQuietHours()) {
      return false;
    }

    // Check channel is enabled
    if (channel === 'email' && !this.emailEnabled) return false;
    if (channel === 'in-app' && !this.inAppEnabled) return false;
    if (channel === 'socket' && !this.socketEnabled) return false;

    // Check category preferences
    const categoryPrefs = this.categoryPreferences as any;
    if (categoryPrefs && categoryPrefs[category]) {
      const channelKey = channel === 'in-app' ? 'inApp' : channel;
      return categoryPrefs[category][channelKey] !== false;
    }

    return true;
  }

  isQuietHours(): boolean {
    if (!this.quietHoursEnabled || !this.quietHoursStart || !this.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check if today is a quiet day
    if (this.quietHoursDays && this.quietHoursDays.includes(dayName)) {
      return true;
    }

    // Check if current time is in quiet hours
    const [startHour, startMin] = this.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = this.quietHoursEnd.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const currentMinutes = currentHour * 60 + currentMin;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes < endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Quiet hours span midnight
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }

  // Static methods
  static async getOrCreate(userId: string): Promise<NotificationPreference> {
    let preference = await NotificationPreference.findOne({ where: { userId } });
    
    if (!preference) {
      preference = await NotificationPreference.create({ userId });
    }
    
    return preference;
  }
}

export default NotificationPreference;
