/**
 * Role Model - Mongoose Schema for Role-Based Access Control (RBAC)
 * Comprehensive data model for roles and permissions management
 */

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  // Basic Information
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Role Type
  roleType: {
    type: String,
    enum: ['System', 'Custom', 'Inherited'],
    default: 'Custom',
    index: true
  },
  
  // Permissions
  permissions: [{
    resource: {
      type: String,
      required: true,
      trim: true
    },
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'execute', 'manage', 'approve', 'export', 'share'],
      required: true
    }],
    conditions: {
      type: Map,
      of: String
    },
    granted: {
      type: Boolean,
      default: true
    }
  }],
  
  // Hierarchical Structure
  parentRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  childRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  inheritPermissions: {
    type: Boolean,
    default: true
  },
  
  // Priority & Level
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Deprecated'],
    default: 'Active',
    index: true
  },
  
  // Usage Statistics
  assignedUsers: {
    type: Number,
    default: 0
  },
  
  // Least Privilege Principle
  defaultDenyAll: {
    type: Boolean,
    default: true
  },
  explicitDeny: [{
    resource: String,
    actions: [String],
    reason: String
  }],
  
  // Constraints
  maxUsers: {
    type: Number,
    default: null
  },
  expirationDate: {
    type: Date
  },
  
  // Audit Fields
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: String,
    trim: true
  },
  modificationHistory: [{
    modifiedBy: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changes: String,
    reason: String
  }]
}, {
  timestamps: true
});

// Indexes for performance
roleSchema.index({ roleName: 1, status: 1 });
roleSchema.index({ roleType: 1, status: 1 });

// Instance method to check permission
roleSchema.methods.hasPermission = function(resource, action) {
  // Check explicit deny first
  const explicitDeny = this.explicitDeny.find(
    d => d.resource === resource && d.actions.includes(action)
  );
  if (explicitDeny) {
    return false;
  }
  
  // Check granted permissions
  const permission = this.permissions.find(p => p.resource === resource);
  if (permission && permission.granted && permission.actions.includes(action)) {
    return true;
  }
  
  // If default deny all, return false
  return !this.defaultDenyAll;
};

// Instance method to add permission
roleSchema.methods.addPermission = async function(resource, actions, updatedBy) {
  const existingPermission = this.permissions.find(p => p.resource === resource);
  
  if (existingPermission) {
    // Merge actions
    existingPermission.actions = [...new Set([...existingPermission.actions, ...actions])];
  } else {
    this.permissions.push({
      resource,
      actions,
      granted: true
    });
  }
  
  this.updatedBy = updatedBy;
  this.modificationHistory.push({
    modifiedBy: updatedBy,
    modifiedAt: new Date(),
    changes: `Added permissions for ${resource}: ${actions.join(', ')}`,
    reason: 'Permission addition'
  });
  
  return this.save();
};

// Instance method to remove permission
roleSchema.methods.removePermission = async function(resource, actions, updatedBy) {
  const permission = this.permissions.find(p => p.resource === resource);
  
  if (permission) {
    permission.actions = permission.actions.filter(a => !actions.includes(a));
    
    // Remove permission if no actions left
    if (permission.actions.length === 0) {
      this.permissions = this.permissions.filter(p => p.resource !== resource);
    }
  }
  
  this.updatedBy = updatedBy;
  this.modificationHistory.push({
    modifiedBy: updatedBy,
    modifiedAt: new Date(),
    changes: `Removed permissions for ${resource}: ${actions.join(', ')}`,
    reason: 'Permission removal'
  });
  
  return this.save();
};

// Static method to get all permissions for a role (including inherited)
roleSchema.statics.getAllPermissions = async function(roleId) {
  const role = await this.findById(roleId).populate('parentRole');
  
  if (!role) {
    return [];
  }
  
  let allPermissions = [...role.permissions];
  
  // Inherit from parent if enabled
  if (role.inheritPermissions && role.parentRole) {
    const parentPermissions = await this.getAllPermissions(role.parentRole._id);
    allPermissions = [...allPermissions, ...parentPermissions];
  }
  
  return allPermissions;
};

// Pre-save middleware
roleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Role', roleSchema);
