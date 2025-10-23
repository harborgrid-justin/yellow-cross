# Detailed Software Engineering & Technical Implementation Plan
## Twenty CRM & Baserow Feature Integration into Yellow Cross

**Document Version:** 1.0  
**Date:** October 23, 2025  
**Status:** Ready for Execution  
**Scope:** Phase 1 - Quick Wins Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Feature Implementation Details](#feature-implementation-details)
4. [Code Adaptation Strategy](#code-adaptation-strategy)
5. [Database Schema Changes](#database-schema-changes)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Plan](#deployment-plan)
10. [Rollback Procedures](#rollback-procedures)

---

## Executive Summary

This document provides a comprehensive, step-by-step technical implementation plan for integrating 5 high-priority features from Twenty CRM and Baserow into Yellow Cross. The plan focuses on **Phase 1: Quick Wins** which can be completed in 8-12 weeks.

### Phase 1 Features to Implement

1. **Advanced Filtering & Search** (Baserow) - 2-3 weeks
2. **Notification System** (Twenty) - 2-3 weeks
3. **Timeline/Activity Feed** (Twenty) - 2-3 weeks
4. **Trash & Recovery System** (Twenty + Baserow) - 2 weeks
5. **Two-Factor Authentication** (Twenty) - 2-3 weeks

### Implementation Approach

- **Adapt, Don't Copy**: Extract patterns and logic, adapt to Yellow Cross architecture
- **Incremental**: One feature at a time with full testing
- **Backward Compatible**: No breaking changes to existing functionality
- **Feature Flags**: Control rollout and easy rollback

---

## Architecture Overview

### Current Yellow Cross Stack

```
Frontend:
├── React 19.2.0 + TypeScript
├── Redux Toolkit 2.9.1
├── Vite 7.1.9
└── React Router DOM 7.9.3

Backend:
├── Node.js + Express 5.1.0
├── TypeScript 5.9.3
├── Sequelize 6.37.7 + PostgreSQL
├── Socket.IO 4.8.1
└── Winston 3.18.3 (logging)

Database:
└── PostgreSQL 15+ (Neon DB)
```

### Target Architecture with New Features

```
┌─────────────────────────────────────────────────────┐
│                  Frontend Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Search   │  │ Timeline │  │ Notif    │         │
│  │ UI       │  │ Feed     │  │ Center   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│         │              │              │             │
└─────────┼──────────────┼──────────────┼─────────────┘
          │              │              │
          ▼              ▼              ▼
┌─────────────────────────────────────────────────────┐
│                  API Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Search   │  │ Activity │  │ Notif    │         │
│  │ Service  │  │ Logger   │  │ Service  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│         │              │              │             │
└─────────┼──────────────┼──────────────┼─────────────┘
          │              │              │
          ▼              ▼              ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL Database                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Search   │  │ Activity │  │ Notif    │         │
│  │ Index    │  │ Log      │  │ Queue    │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## Feature Implementation Details

## Feature 1: Advanced Filtering & Search

### Source Analysis

**Baserow Implementation:**
- Location: `backend/src/baserow/contrib/database/search/`
- Technology: PostgreSQL full-text search with Django ORM
- Key Features: Multi-field search, filters, saved searches

### Adaptation Plan

#### 1.1 Backend Implementation

**File: `backend/src/services/SearchService.ts`** (NEW)

```typescript
import { Op } from 'sequelize';
import { Case, Client, Document } from '../models/sequelize';
import winston from 'winston';

interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between';
  value: any;
  condition?: 'AND' | 'OR';
}

interface SearchOptions {
  query?: string;
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export class SearchService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * Perform advanced search across cases with filters
   */
  async searchCases(options: SearchOptions, userId: string) {
    const {
      query = '',
      filters = [],
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = options;

    try {
      // Build where clause
      const whereClause: any = {};
      
      // Full-text search
      if (query) {
        whereClause[Op.or] = [
          { caseNumber: { [Op.iLike]: `%${query}%` } },
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { status: { [Op.iLike]: `%${query}%` } },
        ];
      }

      // Apply filters
      filters.forEach((filter) => {
        const operator = this.mapOperator(filter.operator);
        whereClause[filter.field] = { [operator]: filter.value };
      });

      // Execute search with pagination
      const offset = (page - 1) * limit;
      const { rows, count } = await Case.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [
          { association: 'client', attributes: ['id', 'name', 'email'] },
          { association: 'assignedTo', attributes: ['id', 'username', 'email'] },
        ],
      });

      this.logger.info('Search executed', { userId, query, count });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      this.logger.error('Search failed', { error, userId });
      throw error;
    }
  }

  /**
   * Save search criteria for reuse
   */
  async saveSearch(name: string, criteria: SearchOptions, userId: string) {
    const SavedSearch = require('../models/sequelize/SavedSearch').default;
    
    return await SavedSearch.create({
      name,
      criteria: JSON.stringify(criteria),
      userId,
      type: 'case',
    });
  }

  /**
   * Get user's saved searches
   */
  async getSavedSearches(userId: string, type: string = 'case') {
    const SavedSearch = require('../models/sequelize/SavedSearch').default;
    
    return await SavedSearch.findAll({
      where: { userId, type },
      order: [['createdAt', 'DESC']],
    });
  }

  private mapOperator(operator: string) {
    const operatorMap: { [key: string]: symbol } = {
      equals: Op.eq,
      contains: Op.iLike,
      startsWith: Op.startsWith,
      endsWith: Op.endsWith,
      gt: Op.gt,
      lt: Op.lt,
      between: Op.between,
    };
    return operatorMap[operator] || Op.eq;
  }
}

export default new SearchService();
```

**File: `backend/src/models/sequelize/SavedSearch.ts`** (NEW)

```typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'saved_searches',
  timestamps: true,
})
export default class SavedSearch extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  criteria!: string; // JSON string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string; // 'case', 'client', 'document'

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
```

**File: `backend/src/features/cases/routes.ts`** (UPDATE)

```typescript
// Add to existing routes
import searchService from '../../services/SearchService';

/**
 * @route   POST /api/cases/search
 * @desc    Advanced search with filters
 * @access  Private
 */
router.post('/search', authenticate, async (req, res) => {
  try {
    const results = await searchService.searchCases(req.body, req.user.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * @route   POST /api/cases/search/save
 * @desc    Save search criteria
 * @access  Private
 */
router.post('/search/save', authenticate, async (req, res) => {
  try {
    const { name, criteria } = req.body;
    const saved = await searchService.saveSearch(name, criteria, req.user.id);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save search' });
  }
});

/**
 * @route   GET /api/cases/search/saved
 * @desc    Get saved searches
 * @access  Private
 */
router.get('/search/saved', authenticate, async (req, res) => {
  try {
    const searches = await searchService.getSavedSearches(req.user.id, 'case');
    res.json(searches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});
```

#### 1.2 Frontend Implementation

**File: `frontend/src/features/cases/components/AdvancedSearch.tsx`** (NEW)

```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchCases } from '../casesSlice';

interface Filter {
  field: string;
  operator: string;
  value: string;
}

export const AdvancedSearch: React.FC = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fieldOptions = [
    { value: 'status', label: 'Status' },
    { value: 'practiceArea', label: 'Practice Area' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
  ];

  const handleSearch = () => {
    dispatch(searchCases({ query, filters }));
  };

  const addFilter = () => {
    setFilters([...filters, { field: 'status', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], [key]: value };
    setFilters(updated);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="advanced-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search cases..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={() => setShowFilters(!showFilters)} className="filter-button">
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <h4>Filters</h4>
          {filters.map((filter, index) => (
            <div key={index} className="filter-row">
              <select
                value={filter.field}
                onChange={(e) => updateFilter(index, 'field', e.target.value)}
              >
                {fieldOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => updateFilter(index, 'operator', e.target.value)}
              >
                {operatorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                placeholder="Value"
              />

              <button onClick={() => removeFilter(index)}>Remove</button>
            </div>
          ))}

          <button onClick={addFilter} className="add-filter-button">
            + Add Filter
          </button>
        </div>
      )}
    </div>
  );
};
```

**File: `frontend/src/features/cases/casesSlice.ts`** (UPDATE)

```typescript
// Add to existing slice
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../shared/api/apiClient';

export const searchCases = createAsyncThunk(
  'cases/search',
  async (searchOptions: any) => {
    const response = await api.post('/api/cases/search', searchOptions);
    return response.data;
  }
);

// Add to reducers
extraReducers: (builder) => {
  builder
    .addCase(searchCases.pending, (state) => {
      state.loading = true;
    })
    .addCase(searchCases.fulfilled, (state, action) => {
      state.loading = false;
      state.cases = action.payload.data;
      state.pagination = action.payload.pagination;
    })
    .addCase(searchCases.rejected, (state) => {
      state.loading = false;
      state.error = 'Search failed';
    });
}
```

#### 1.3 Database Migration

**File: `backend/src/migrations/20251023-create-saved-searches.ts`** (NEW)

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('saved_searches', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    criteria: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Add index for better query performance
  await queryInterface.addIndex('saved_searches', ['userId', 'type']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('saved_searches');
}
```

---

## Feature 2: Notification System

### Source Analysis

**Twenty Implementation:**
- Location: `packages/twenty-server/src/engine/core-modules/emailing-domain/`
- Technology: Event-driven notifications with email/in-app channels
- Key Features: Multi-channel, templates, preferences

### Adaptation Plan

#### 2.1 Backend Implementation

**File: `backend/src/services/NotificationService.ts`** (NEW)

```typescript
import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';
import winston from 'winston';
import Notification from '../models/sequelize/Notification';
import User from '../models/sequelize/User';
import { io } from '../index'; // Socket.IO instance

interface NotificationData {
  userId: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
  channels?: ('email' | 'in-app' | 'push')[];
}

export class NotificationService extends EventEmitter {
  private logger: winston.Logger;
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    super();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });

    // Email transporter setup
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.setupEventListeners();
  }

  /**
   * Send notification through multiple channels
   */
  async send(data: NotificationData): Promise<void> {
    const {
      userId,
      type,
      title,
      message,
      link,
      priority = 'medium',
      channels = ['in-app'],
    } = data;

    try {
      // Get user and preferences
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create in-app notification
      if (channels.includes('in-app')) {
        await this.sendInApp({
          userId,
          type,
          title,
          message,
          link,
          priority,
        });
      }

      // Send email if preference allows
      if (channels.includes('email') && this.shouldSendEmail(user, type)) {
        await this.sendEmail(user.email, title, message, link);
      }

      this.logger.info('Notification sent', { userId, type, channels });
    } catch (error) {
      this.logger.error('Failed to send notification', { error, userId });
      throw error;
    }
  }

  /**
   * Send in-app notification and emit via Socket.IO
   */
  private async sendInApp(data: Omit<NotificationData, 'channels'>) {
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      priority: data.priority || 'medium',
      read: false,
    });

    // Emit to user via Socket.IO
    io.to(`user:${data.userId}`).emit('notification', notification);

    return notification;
  }

  /**
   * Send email notification
   */
  private async sendEmail(
    to: string,
    subject: string,
    message: string,
    link?: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${subject}</h2>
        <p>${message}</p>
        ${link ? `<p><a href="${link}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Details</a></p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">Yellow Cross Practice Management</p>
      </div>
    `;

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@yellowcross.com',
      to,
      subject,
      html,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    await Notification.update(
      { read: true, readAt: new Date() },
      { where: { id: notificationId, userId } }
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: number): Promise<void> {
    await Notification.update(
      { read: true, readAt: new Date() },
      { where: { userId, read: false } }
    );
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20
  ) {
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Notification.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: number): Promise<number> {
    return await Notification.count({
      where: { userId, read: false },
    });
  }

  /**
   * Setup event listeners for automatic notifications
   */
  private setupEventListeners() {
    // Case assigned
    this.on('case:assigned', async (data) => {
      await this.send({
        userId: data.assignedToId,
        type: 'case_assigned',
        title: 'New Case Assigned',
        message: `Case ${data.caseNumber} has been assigned to you`,
        link: `/cases/${data.caseId}`,
        priority: 'high',
        channels: ['in-app', 'email'],
      });
    });

    // Deadline approaching
    this.on('deadline:approaching', async (data) => {
      await this.send({
        userId: data.userId,
        type: 'deadline_approaching',
        title: 'Deadline Approaching',
        message: `Case ${data.caseNumber} deadline is in ${data.daysLeft} days`,
        link: `/cases/${data.caseId}`,
        priority: 'high',
        channels: ['in-app', 'email'],
      });
    });

    // Document uploaded
    this.on('document:uploaded', async (data) => {
      await this.send({
        userId: data.userId,
        type: 'document_uploaded',
        title: 'New Document',
        message: `Document "${data.fileName}" uploaded to case ${data.caseNumber}`,
        link: `/cases/${data.caseId}/documents`,
        priority: 'medium',
        channels: ['in-app'],
      });
    });

    // Task completed
    this.on('task:completed', async (data) => {
      await this.send({
        userId: data.assignedById,
        type: 'task_completed',
        title: 'Task Completed',
        message: `${data.completedBy} completed task: ${data.taskTitle}`,
        link: `/tasks/${data.taskId}`,
        priority: 'low',
        channels: ['in-app'],
      });
    });
  }

  /**
   * Check if email should be sent based on user preferences
   */
  private shouldSendEmail(user: any, notificationType: string): boolean {
    // TODO: Implement user notification preferences
    // For now, send email for high-priority notifications
    return ['case_assigned', 'deadline_approaching'].includes(notificationType);
  }
}

export default new NotificationService();
```

**File: `backend/src/models/sequelize/Notification.ts`** (NEW)

```typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'notifications',
  timestamps: true,
})
export default class Notification extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link?: string;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  })
  priority!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  read!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  readAt?: Date;

  @BelongsTo(() => User)
  user!: User;
}
```

**File: `backend/src/features/notifications/routes.ts`** (NEW)

```typescript
import express from 'express';
import { authenticate } from '../../middleware/auth';
import notificationService from '../../services/NotificationService';

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      page,
      limit
    );
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await notificationService.markAsRead(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
```

#### 2.2 Frontend Implementation

**File: `frontend/src/features/notifications/components/NotificationCenter.tsx`** (NEW)

```typescript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../notificationsSlice';
import { RootState } from '../../../app/store';
import './NotificationCenter.css';

export const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notifications
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id);
                    }
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="notification-priority">
                    {getPriorityIcon(notification.priority)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read && <div className="unread-indicator">●</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

**File: `frontend/src/features/notifications/notificationsSlice.ts`** (NEW)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../shared/api/apiClient';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  priority: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  socket: Socket | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  socket: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async () => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data.count;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number) => {
    await api.put(`/api/notifications/${id}/read`);
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await api.put('/api/notifications/read-all');
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    initializeSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch notifications';
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, initializeSocket } = notificationsSlice.actions;
export default notificationsSlice.reducer;
```

---

## Remaining Features (Summary)

Due to document length constraints, the detailed implementation for Features 3-5 follows the same pattern:

### Feature 3: Timeline/Activity Feed
- **Backend**: ActivityService, Activity model, routes
- **Frontend**: Timeline component, Redux slice
- **Database**: activities table with foreign keys

### Feature 4: Trash & Recovery System
- **Backend**: Add `deletedAt` field to models, TrashService
- **Frontend**: Trash bin UI, restore functionality
- **Database**: Soft delete pattern with cascade

### Feature 5: Two-Factor Authentication
- **Backend**: TOTP library, 2FA middleware, backup codes
- **Frontend**: Setup flow, verification UI
- **Database**: user_2fa_settings table

---

## Code Adaptation Strategy

### General Principles

1. **Don't Copy-Paste**: Extract patterns, understand logic, rewrite for Yellow Cross
2. **Match Architecture**: Use existing patterns (Sequelize, Express, React+Redux)
3. **TypeScript First**: Maintain type safety throughout
4. **Feature Flags**: Control rollout with environment variables
5. **Backward Compatible**: No breaking changes to existing code

### Adaptation Process

```
Source Code Analysis
        ↓
Pattern Extraction
        ↓
Architecture Mapping
        ↓
Yellow Cross Implementation
        ↓
Testing & Validation
        ↓
Feature Flag Release
```

### Technology Mapping

| Source (Twenty/Baserow) | Yellow Cross Equivalent |
|-------------------------|-------------------------|
| NestJS modules | Express routers |
| TypeORM | Sequelize |
| Apollo GraphQL | REST API |
| Recoil | Redux Toolkit |
| Django ORM | Sequelize |
| Vue.js | React |

---

## Database Schema Changes

### Migration Strategy

1. **Create migrations** for each new table
2. **Add fields** to existing tables with `ALTER TABLE`
3. **Create indexes** for performance
4. **No data loss** - all changes are additive
5. **Rollback capable** - each migration has `down()` method

### New Tables

```sql
-- Saved Searches
CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  criteria TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id, type);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  priority VARCHAR(20) DEFAULT 'medium',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Activities (Timeline)
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_user ON activities(user_id);
```

### Modified Tables

```sql
-- Add soft delete to cases
ALTER TABLE cases ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_cases_deleted ON cases(deleted_at);

-- Add soft delete to documents
ALTER TABLE documents ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_documents_deleted ON documents(deleted_at);

-- Add soft delete to clients
ALTER TABLE clients ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_clients_deleted ON clients(deleted_at);

-- Add 2FA fields to users
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN two_factor_backup_codes TEXT;
```

---

## API Endpoints

### New Endpoints Summary

```
POST   /api/cases/search              - Advanced search with filters
POST   /api/cases/search/save         - Save search criteria
GET    /api/cases/search/saved        - Get saved searches

GET    /api/notifications             - Get user notifications
GET    /api/notifications/unread-count - Get unread count
PUT    /api/notifications/:id/read    - Mark as read
PUT    /api/notifications/read-all    - Mark all as read

GET    /api/activities/:type/:id      - Get entity activities
POST   /api/activities                - Log activity (internal)

GET    /api/trash                     - List trashed items
POST   /api/trash/:type/:id/restore   - Restore item
DELETE /api/trash/:type/:id           - Permanently delete

POST   /api/auth/2fa/setup            - Begin 2FA setup
POST   /api/auth/2fa/verify           - Verify 2FA code
POST   /api/auth/2fa/disable          - Disable 2FA
POST   /api/auth/2fa/backup-codes     - Generate backup codes
```

---

## Frontend Components

### Component Structure

```
frontend/src/features/
├── cases/
│   ├── components/
│   │   ├── AdvancedSearch.tsx        [NEW]
│   │   ├── SearchFilters.tsx         [NEW]
│   │   └── SavedSearches.tsx         [NEW]
│   └── casesSlice.ts                 [UPDATE]
│
├── notifications/
│   ├── components/
│   │   ├── NotificationCenter.tsx    [NEW]
│   │   ├── NotificationItem.tsx      [NEW]
│   │   └── NotificationPreferences.tsx [NEW]
│   └── notificationsSlice.ts         [NEW]
│
├── activities/
│   ├── components/
│   │   ├── Timeline.tsx              [NEW]
│   │   ├── ActivityItem.tsx          [NEW]
│   │   └── ActivityFilter.tsx        [NEW]
│   └── activitiesSlice.ts            [NEW]
│
├── trash/
│   ├── components/
│   │   ├── TrashBin.tsx              [NEW]
│   │   ├── TrashItem.tsx             [NEW]
│   │   └── RestoreDialog.tsx         [NEW]
│   └── trashSlice.ts                 [NEW]
│
└── auth/
    ├── components/
    │   ├── TwoFactorSetup.tsx        [NEW]
    │   ├── TwoFactorVerify.tsx       [NEW]
    │   └── BackupCodes.tsx           [NEW]
    └── authSlice.ts                  [UPDATE]
```

---

## Testing Strategy

### Test Coverage Requirements

- **Unit Tests**: 80% coverage minimum
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

### Test Files Structure

```
backend/tests/
├── services/
│   ├── SearchService.test.ts
│   ├── NotificationService.test.ts
│   └── ActivityService.test.ts
├── features/
│   ├── search.test.ts
│   ├── notifications.test.ts
│   └── trash.test.ts
└── integration/
    ├── search-api.test.ts
    ├── notifications-api.test.ts
    └── 2fa-flow.test.ts

frontend/src/
├── features/
│   ├── cases/__tests__/
│   │   └── AdvancedSearch.test.tsx
│   ├── notifications/__tests__/
│   │   └── NotificationCenter.test.tsx
│   └── activities/__tests__/
│       └── Timeline.test.tsx
```

### Sample Test

```typescript
// backend/tests/services/SearchService.test.ts
import SearchService from '../../src/services/SearchService';
import { Case } from '../../src/models/sequelize';

describe('SearchService', () => {
  describe('searchCases', () => {
    it('should search cases by query', async () => {
      const results = await SearchService.searchCases(
        { query: 'Smith', page: 1, limit: 10 },
        1
      );
      
      expect(results.data).toBeDefined();
      expect(results.pagination.total).toBeGreaterThanOrEqual(0);
    });

    it('should apply filters correctly', async () => {
      const results = await SearchService.searchCases(
        {
          filters: [
            { field: 'status', operator: 'equals', value: 'active' },
          ],
          page: 1,
          limit: 10,
        },
        1
      );
      
      results.data.forEach((caseItem) => {
        expect(caseItem.status).toBe('active');
      });
    });
  });
});
```

---

## Deployment Plan

### Phase 1 Deployment Timeline

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 1-2 | Advanced Search implementation | SearchService, API, UI |
| 2 | Testing & bug fixes | Test suite, documentation |
| 3-4 | Notification System | NotificationService, API, UI |
| 4 | Testing & bug fixes | Test suite, documentation |
| 5-6 | Timeline/Activity Feed | ActivityService, API, UI |
| 6 | Testing & bug fixes | Test suite, documentation |
| 7 | Trash & Recovery | Soft delete, restore UI |
| 7-8 | Testing & bug fixes | Test suite, documentation |
| 9-10 | Two-Factor Authentication | 2FA setup, verification |
| 10 | Testing & bug fixes | Test suite, documentation |
| 11 | Integration testing | End-to-end tests |
| 12 | Production deployment | Release notes, training |

### Feature Flag Strategy

```typescript
// backend/src/config/featureFlags.ts
export const featureFlags = {
  ADVANCED_SEARCH: process.env.FEATURE_ADVANCED_SEARCH === 'true',
  NOTIFICATIONS: process.env.FEATURE_NOTIFICATIONS === 'true',
  TIMELINE: process.env.FEATURE_TIMELINE === 'true',
  TRASH_RECOVERY: process.env.FEATURE_TRASH_RECOVERY === 'true',
  TWO_FACTOR_AUTH: process.env.FEATURE_TWO_FACTOR_AUTH === 'true',
};

// Usage in routes
if (featureFlags.ADVANCED_SEARCH) {
  router.post('/search', authenticate, searchHandler);
}
```

### Deployment Steps

1. **Pre-deployment**
   - ✅ Code review completed
   - ✅ All tests passing
   - ✅ Feature flags configured
   - ✅ Database migrations ready
   - ✅ Rollback plan documented

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Deploy to Staging**
   ```bash
   git push staging main
   npm run deploy:staging
   ```

4. **Staging Validation**
   - ✅ Run smoke tests
   - ✅ Manual QA testing
   - ✅ Performance testing
   - ✅ Security scan

5. **Deploy to Production**
   ```bash
   git tag v2.1.0
   git push origin v2.1.0
   npm run deploy:production
   ```

6. **Post-deployment**
   - ✅ Monitor error logs
   - ✅ Check performance metrics
   - ✅ Gradual feature flag rollout
   - ✅ User feedback collection

---

## Rollback Procedures

### Quick Rollback (Feature Flags)

```bash
# Disable feature immediately
heroku config:set FEATURE_ADVANCED_SEARCH=false
heroku config:set FEATURE_NOTIFICATIONS=false
```

### Full Rollback (Code Revert)

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or rollback to specific tag
git reset --hard v2.0.0
git push origin main --force
```

### Database Rollback

```bash
# Run down migrations
npm run db:migrate:undo

# Or specific migration
npm run db:migrate:undo:all --to 20251020-create-users.ts
```

### Rollback Checklist

- [ ] Identify issue and impact
- [ ] Notify team and stakeholders
- [ ] Disable feature flags if applicable
- [ ] Revert code deployment if needed
- [ ] Rollback database migrations if needed
- [ ] Verify system stability
- [ ] Document incident and lessons learned

---

## Execution Checklist

### Pre-execution
- [ ] Review this document with team
- [ ] Set up development environment
- [ ] Create feature branches
- [ ] Configure feature flags
- [ ] Set up testing infrastructure

### Week 1-2: Advanced Search
- [ ] Create SearchService
- [ ] Create SavedSearch model
- [ ] Implement API endpoints
- [ ] Create AdvancedSearch component
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Code review and merge

### Week 3-4: Notifications
- [ ] Create NotificationService
- [ ] Create Notification model
- [ ] Implement Socket.IO integration
- [ ] Create NotificationCenter component
- [ ] Configure email transporter
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Code review and merge

### Week 5-6: Timeline/Activity Feed
- [ ] Create ActivityService
- [ ] Create Activity model
- [ ] Implement activity logging
- [ ] Create Timeline component
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Code review and merge

### Week 7-8: Trash & Recovery
- [ ] Add deletedAt to models
- [ ] Create TrashService
- [ ] Implement restore functionality
- [ ] Create TrashBin component
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Code review and merge

### Week 9-10: Two-Factor Authentication
- [ ] Integrate TOTP library
- [ ] Add 2FA fields to User model
- [ ] Implement 2FA setup flow
- [ ] Create 2FA components
- [ ] Generate backup codes
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Code review and merge

### Week 11: Integration Testing
- [ ] End-to-end test scenarios
- [ ] Performance testing
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Documentation updates

### Week 12: Production Deployment
- [ ] Final code review
- [ ] Deploy to staging
- [ ] Staging validation
- [ ] Deploy to production
- [ ] Monitor and verify
- [ ] User training materials
- [ ] Release announcement

---

## Success Metrics

### Technical Metrics
- [ ] All tests passing (80%+ coverage)
- [ ] Zero critical bugs
- [ ] API response time < 200ms (p95)
- [ ] Page load time < 2 seconds
- [ ] Zero downtime deployment

### User Metrics
- [ ] 50% adoption rate within 2 weeks
- [ ] 80% positive feedback
- [ ] < 5% support ticket increase
- [ ] Improved feature usage metrics

### Business Metrics
- [ ] 20% reduction in search time
- [ ] 40% fewer missed notifications
- [ ] 30% faster data recovery
- [ ] 50% reduction in unauthorized access

---

## Document Version Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-23 | Copilot | Initial detailed implementation plan |

---

## Appendix A: Code Style Guidelines

Follow existing Yellow Cross conventions:
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- JSDoc comments for all public APIs
- Async/await over promises
- Error handling with try/catch

## Appendix B: Security Considerations

- All inputs validated
- SQL injection prevention (Sequelize parameterized queries)
- XSS prevention (React auto-escaping)
- CSRF protection (JWT tokens)
- Rate limiting on all endpoints
- Encryption for sensitive data (2FA secrets)

## Appendix C: Performance Optimization

- Database indexes on foreign keys
- Pagination for all list endpoints
- Redis caching for frequent queries
- Lazy loading for large datasets
- WebSocket for real-time updates
- CDN for static assets

---

**END OF IMPLEMENTATION PLAN**

**Status:** ✅ Ready for Execution  
**Next Step:** Begin Week 1 implementation with Advanced Search feature  
**Review Date:** October 30, 2025
