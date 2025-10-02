# Communication & Collaboration System - Business Logic & Data Integration Documentation

## Overview

The Communication & Collaboration System is now fully implemented with complete **business logic**, **data models**, and **database integration** using MongoDB and Mongoose ODM. This document provides comprehensive details about the implementation.

---

## 🗄️ Data Models

### 1. Message Model (`src/models/Message.js`)

The Message model handles internal team messaging, direct messages, and group chats.

#### Key Fields:

**Message Identification**
- `messageId`: Unique message identifier (auto-generated, format: MSG-{timestamp}-{random})
- `messageType`: Type of message (Direct, Group, Broadcast, System, Announcement)

**Content**
- `subject`: Optional message subject (max 200 characters)
- `content`: Message content (required, max length varies)

**Sender/Recipient**
- `senderId`: Reference to User document
- `senderName`: Name of sender (required)
- `recipientId`: Reference to User document (for direct messages)
- `recipientName`: Name of recipient
- `groupId`: Reference to MessageGroup (for group chats)
- `participants`: Array of group participants with roles

**Threading & Collaboration**
- `threadId`: Reference to parent thread
- `parentMessageId`: Reference to parent message for replies
- `isThreadStarter`: Boolean flag
- `replyCount`: Number of replies

**Attachments & Mentions**
- `attachments`: Array of file attachments with metadata
- `mentions`: Array of mentioned users with notification status

**Status & Tracking**
- `status`: Message status (Sent, Delivered, Read, Archived, Deleted)
- `readBy`: Array of users who read the message
- `priority`: Priority level (Low, Normal, High, Urgent)

**Case Association**
- `caseId`: Reference to Case document
- `caseNumber`: Denormalized case number for quick lookups

#### Model Methods:

**Static Methods**:
- `findByUser(userId)`: Find all messages for a user (sent or received)
- `findUnreadByUser(userId)`: Find unread messages for a user
- `searchMessages(query, filters)`: Full-text search in messages

**Instance Methods**:
- `markAsRead(userId, username)`: Mark message as read
- `addReaction(reactionType, username)`: Add emoji reaction
- `editMessage(newContent, editedBy)`: Edit message content with history

#### Indexes:
- Primary: `messageId`, `senderId`, `recipientId`, `groupId`
- Compound: `senderId + createdAt`, `recipientId + status`, `groupId + createdAt`
- Text: `content`, `subject`

---

### 2. Email Model (`src/models/Email.js`)

Tracks emails sent and received through integrated email clients.

#### Key Fields:

**Email Identification**
- `emailId`: Unique email identifier (format: EMAIL-{timestamp}-{random})
- `messageId`: Email message ID
- `threadId`: Email thread ID for conversations

**Email Headers**
- `from`: Sender email and name object
- `to`: Array of recipient email/name objects
- `cc`: Array of CC recipients
- `bcc`: Array of BCC recipients
- `replyTo`: Reply-to address

**Content**
- `subject`: Email subject (required, max 500 chars)
- `body`: Email body (required)
- `bodyPlainText`: Plain text version
- `bodyHtml`: HTML version

**Type & Direction**
- `emailType`: Type (Received, Sent, Draft, Template)
- `direction`: Direction (Inbound, Outbound, Internal)

**Status & Tracking**
- `status`: Email status (Draft, Queued, Sent, Delivered, Opened, Clicked, Bounced, Failed)
- `isRead`: Boolean read flag
- `readAt`: Timestamp when read
- `sentAt`: When sent
- `deliveredAt`: When delivered
- `openedAt`: When opened
- `openCount`: Number of times opened
- `clickCount`: Number of link clicks

**Attachments**
- `attachments`: Array of file attachments
- `hasAttachments`: Boolean flag
- `attachmentCount`: Count of attachments

**Case Association**
- `caseId`: Reference to Case document
- `caseNumber`: Case number
- `autoFiled`: Boolean flag for auto-filing

**Organization**
- `folder`: Email folder (Inbox, Sent, Drafts, Trash, Spam, Archive)
- `labels`: Array of labels
- `tags`: Array of tags
- `priority`: Priority level
- `isImportant`: Boolean flag
- `isStarred`: Boolean flag

**Integration**
- `provider`: Email provider (Gmail, Outlook, Exchange, SMTP, Internal)
- `providerMessageId`: Provider's message ID
- `providerThreadId`: Provider's thread ID

**Response Tracking**
- `requiresResponse`: Boolean flag
- `responseDeadline`: Date
- `responseStatus`: Response status

#### Model Methods:

**Static Methods**:
- `findByCase(caseId)`: Find all emails for a case
- `findUnread(userEmail)`: Find unread emails
- `searchEmails(query, filters)`: Full-text search
- `findRequiringResponse()`: Find emails needing responses

**Instance Methods**:
- `markAsRead()`: Mark email as read
- `trackOpen()`: Track email open event
- `autoFileToCase(caseId, caseNumber)`: Auto-file to case

#### Indexes:
- Primary: `emailId`, `from.email`, `caseId`
- Compound: `status + emailType`, `folder + isRead`
- Text: `subject`, `bodyPlainText`

---

### 3. VideoConference Model (`src/models/VideoConference.js`)

Tracks video calls, depositions, and virtual meetings.

#### Key Fields:

**Conference Identification**
- `conferenceId`: Unique identifier (format: CONF-{timestamp}-{random})
- `meetingId`: Meeting ID for joining
- `meetingUrl`: URL to join the conference

**Conference Details**
- `title`: Conference title (required)
- `description`: Conference description
- `conferenceType`: Type (Team Meeting, Client Meeting, Deposition, Court Hearing, Consultation, Training)

**Scheduling**
- `scheduledStartTime`: Scheduled start time (required)
- `scheduledEndTime`: Scheduled end time (required)
- `duration`: Duration in minutes (required)
- `timezone`: Timezone (default: UTC)

**Actual Times**
- `actualStartTime`: When conference actually started
- `actualEndTime`: When conference ended
- `actualDuration`: Actual duration in minutes

**Host & Participants**
- `hostId`: Reference to User document
- `hostName`: Host name (required)
- `participants`: Array of participants with roles, join/leave times
- `invitees`: Array of invited users with invitation status

**Status**
- `status`: Status (Scheduled, In Progress, Completed, Cancelled, No Show)

**Conference Settings**
- `settings`: Object with conference settings
  - `isRecordingEnabled`: Boolean
  - `isScreenSharingEnabled`: Boolean
  - `isChatEnabled`: Boolean
  - `isWaitingRoomEnabled`: Boolean
  - `requiresPassword`: Boolean
  - `password`: Meeting password (optional)
  - `maxParticipants`: Maximum participants

**Recordings & Transcripts**
- `recordings`: Array of recording metadata
- `hasRecording`: Boolean flag
- `transcripts`: Array of transcript files
- `hasTranscript`: Boolean flag

**Chat & Annotations**
- `chatMessages`: Array of in-meeting chat messages
- `annotations`: Array of meeting annotations

**Case Association**
- `caseId`: Reference to Case document
- `caseNumber`: Case number

**Features**
- `features`: Object with feature flags
  - `virtualBackgroundEnabled`: Boolean
  - `breakoutRoomsEnabled`: Boolean
  - `pollsEnabled`: Boolean
  - `whiteboard`: Boolean

**Integration**
- `provider`: Video provider (Zoom, Teams, WebEx, Google Meet, Custom, Internal)
- `providerMeetingId`: Provider's meeting ID

#### Model Methods:

**Static Methods**:
- `findUpcoming(userId, days)`: Find upcoming conferences for user
- `findByCase(caseId)`: Find all conferences for a case

**Instance Methods**:
- `startConference()`: Start the conference
- `endConference()`: End the conference
- `addParticipant(userId, name, email, role)`: Add participant

#### Indexes:
- Primary: `conferenceId`, `hostId`, `caseId`
- Compound: `status + scheduledStartTime`, `participants.userId`

---

### 4. SharedFile Model (`src/models/SharedFile.js`)

Tracks shared files with access controls and download tracking.

#### Key Fields:

**File Identification**
- `fileId`: Unique file identifier (format: FILE-{timestamp}-{random})
- `shareId`: Unique share identifier
- `filename`: File name (required)
- `originalFilename`: Original file name (required)

**File Information**
- `fileType`: File type (required)
- `mimeType`: MIME type
- `fileSize`: File size in bytes (required)
- `fileExtension`: File extension

**Storage**
- `storagePath`: Storage path (required)
- `storageProvider`: Storage provider (Local, S3, Azure, Google Cloud)
- `checksum`: File checksum for integrity

**Sharing Details**
- `shareType`: Share type (Internal, External, Client, Public Link, Private)
- `shareLink`: Shareable link
- `sharePassword`: Optional password
- `requiresPassword`: Boolean flag

**Owner**
- `ownerId`: Reference to User document (required)
- `ownerName`: Owner name (required)

**Access Control**
- `accessControl`: Access level (Private, Team, Organization, Public, Custom)
- `sharedWith`: Array of users with permissions and expiry dates
- `teamId`: Reference to Team document
- `teamName`: Team name

**Case Association**
- `caseId`: Reference to Case document
- `caseNumber`: Case number
- `documentId`: Reference to Document

**Expiration & Limits**
- `expiresAt`: Expiration date
- `isExpired`: Boolean flag
- `maxDownloads`: Maximum download limit
- `downloadCount`: Current download count

**Status**
- `status`: Status (Active, Expired, Revoked, Deleted)

**Download Tracking**
- `downloads`: Array of download events with user, IP, timestamp
- `lastDownloadedAt`: Last download timestamp

**View Tracking**
- `views`: Array of view events
- `viewCount`: Total view count
- `lastViewedAt`: Last view timestamp

**Notifications**
- `notifyOnDownload`: Boolean flag
- `notifyOnView`: Boolean flag
- `notifyOnExpiry`: Boolean flag

**Security**
- `isEncrypted`: Boolean flag
- `isVirusScanned`: Boolean flag
- `virusScanStatus`: Scan status (Pending, Clean, Infected, Failed)
- `isConfidential`: Boolean flag

**Version Control**
- `version`: Version number
- `previousVersionId`: Reference to previous version
- `isLatestVersion`: Boolean flag

#### Model Methods:

**Static Methods**:
- `findByUser(userId)`: Find files owned or shared with user
- `findByCase(caseId)`: Find all files for a case
- `findExpiring(days)`: Find files expiring in X days

**Instance Methods**:
- `trackDownload(userId, username, ipAddress, userAgent)`: Track download event
- `trackView(userId, username, ipAddress)`: Track view event
- `revokeAccess(revokedBy)`: Revoke file access

#### Indexes:
- Primary: `fileId`, `shareId`, `ownerId`, `caseId`
- Compound: `status + expiresAt`, `shareType + status`

---

### 5. Workspace Model (`src/models/Workspace.js`)

Virtual workrooms for case-specific team collaboration.

#### Key Fields:

**Workspace Identification**
- `workspaceId`: Unique identifier (format: WS-YYYY-{random})
- `name`: Workspace name (required, max 200 chars)
- `description`: Workspace description

**Workspace Type**
- `workspaceType`: Type (Case Workspace, Project, Department, Team, Client Portal, General, Template)

**Case Association**
- `caseId`: Reference to Case document
- `caseNumber`: Case number

**Owner & Members**
- `ownerId`: Reference to User document (required)
- `ownerName`: Owner name (required)
- `members`: Array of members with roles and permissions
  - Roles: Owner, Admin, Editor, Contributor, Viewer
  - Permissions: canEdit, canDelete, canInvite, canManageSettings
- `memberCount`: Count of members

**Invitations**
- `pendingInvitations`: Array of pending invitations with expiry

**Access Control**
- `visibility`: Visibility level (Private, Team, Organization, Public)
- `isPublic`: Boolean flag
- `requiresApproval`: Boolean flag

**Shared Resources**
- `sharedDocuments`: Array of shared documents
- `sharedFiles`: Array of shared files
- `tasks`: Array of workspace tasks

**Activity Feed**
- `activities`: Array of activity events
- `lastActivityAt`: Last activity timestamp

**Discussions**
- `discussions`: Array of discussion threads

**Workspace Settings**
- `settings`: Object with workspace settings
  - `allowComments`: Boolean
  - `allowFileUploads`: Boolean
  - `allowInvitations`: Boolean
  - `notifyOnActivity`: Boolean
  - `notifyOnMention`: Boolean
  - `maxFileSize`: Maximum file size

**Status**
- `status`: Status (Active, Archived, Suspended, Deleted)

**Template Information**
- `isTemplate`: Boolean flag
- `templateId`: Reference to template workspace
- `templateName`: Template name

**Statistics**
- `stats`: Object with usage statistics
  - `totalDocuments`: Count
  - `totalFiles`: Count
  - `totalTasks`: Count
  - `totalComments`: Count
  - `totalActivities`: Count

#### Model Methods:

**Static Methods**:
- `findByUser(userId)`: Find workspaces for user
- `findByCase(caseId)`: Find workspaces for case

**Instance Methods**:
- `addMember(userId, username, email, role)`: Add member to workspace
- `removeMember(userId, removedBy)`: Remove member
- `addActivity(activityType, description, performedBy, metadata)`: Add activity
- `archiveWorkspace(archivedBy)`: Archive workspace

#### Indexes:
- Primary: `workspaceId`, `ownerId`, `caseId`
- Compound: `workspaceType + status`, `members.userId`

---

### 6. ClientMessage Model (`src/models/ClientMessage.js`)

Secure messaging between legal team and clients.

#### Key Fields:

**Message Identification**
- `messageId`: Unique identifier (format: MSG-{timestamp}-{random})
- `messageType`: Type (Message, Document Request, Status Update, Appointment, Payment Request, System)

**Content**
- `subject`: Optional subject
- `content`: Message content (required, max 10000 chars)

**Sender & Recipient**
- `senderId`: Reference to User or Client
- `senderModel`: Model type (User or Client)
- `senderName`: Sender name (required)
- `senderType`: Type (Attorney, Staff, Client, System)
- `recipientId`: Reference to User or Client
- `recipientModel`: Model type
- `recipientName`: Recipient name (required)
- `recipientType`: Type (Attorney, Staff, Client)

**Case & Client**
- `caseId`: Reference to Case document (required)
- `caseNumber`: Case number (required)
- `clientId`: Reference to Client document (required)
- `clientName`: Client name (required)

**Threading**
- `threadId`: Reference to thread
- `parentMessageId`: Reference to parent message
- `isThreadStarter`: Boolean flag
- `replyCount`: Reply count

**Status**
- `status`: Status (Sent, Delivered, Read, Archived, Deleted)
- `isRead`: Boolean flag
- `readAt`: Read timestamp

**Priority**
- `priority`: Priority level (Low, Normal, High, Urgent)
- `requiresResponse`: Boolean flag
- `responseDeadline`: Response deadline

**Documents & Attachments**
- `sharedDocuments`: Array of shared documents with access expiry
- `attachments`: Array of file attachments
- `hasAttachments`: Boolean flag

**Appointment Booking**
- `appointment`: Object with appointment details
  - `proposedDate`: Proposed date
  - `proposedTime`: Proposed time
  - `duration`: Duration in minutes
  - `location`: Location
  - `meetingType`: Type (In Person, Video Conference, Phone Call)
  - `status`: Status (Proposed, Confirmed, Declined, Rescheduled, Cancelled)

**Payment Request**
- `paymentRequest`: Object with payment details
  - `amount`: Amount
  - `currency`: Currency (default: USD)
  - `description`: Description
  - `dueDate`: Due date
  - `status`: Status (Pending, Paid, Overdue, Cancelled)

**Security**
- `isEncrypted`: Boolean flag (default: true)
- `isConfidential`: Boolean flag

**Portal Settings**
- `portalSettings`: Object with notification settings
  - `notifyByEmail`: Boolean
  - `notifyBySMS`: Boolean
  - `allowClientReply`: Boolean

**Template**
- `isAutoGenerated`: Boolean flag
- `templateId`: Reference to template
- `templateName`: Template name

#### Model Methods:

**Static Methods**:
- `findByClient(clientId)`: Find messages for client
- `findByCase(caseId)`: Find messages for case
- `findUnreadByClient(clientId)`: Find unread messages
- `findRequiringResponse()`: Find messages requiring response

**Instance Methods**:
- `markAsRead()`: Mark message as read
- `addDocument(documentId, documentName, accessExpiry)`: Add document
- `confirmAppointment(confirmedDate, confirmedBy)`: Confirm appointment

#### Indexes:
- Primary: `messageId`, `clientId`, `caseId`
- Compound: `senderId + senderModel`, `recipientId + recipientModel`, `status + isRead`

---

### 7. ExternalCommunication Model (`src/models/ExternalCommunication.js`)

Tracks all external communications including opposing counsel, courts, vendors.

#### Key Fields:

**Communication Identification**
- `communicationId`: Unique identifier (format: COMM-YYYY-{random})
- `communicationType`: Type (Email, Phone Call, Letter, Fax, Meeting, Court Filing, Deposition, Hearing, Conference)

**Direction**
- `direction`: Direction (Inbound, Outbound)

**Communication Details**
- `subject`: Subject (required, max 500 chars)
- `description`: Detailed description (max 5000 chars)
- `summary`: Brief summary (max 1000 chars)

**Internal Participants**
- `internalParticipants`: Array of internal participants
- `primaryContact`: Primary internal contact (required)

**External Participants**
- `externalParticipants`: Array of external participants with organization, role, contact info
  - Types: Opposing Counsel, Court, Client, Witness, Expert, Vendor, Government, Other

**Case Association**
- `caseId`: Reference to Case document (required)
- `caseNumber`: Case number (required)

**Date & Time**
- `communicationDate`: Date of communication (required)
- `duration`: Duration in minutes

**Status & Follow-up**
- `status`: Status (Completed, Pending, Scheduled, Cancelled, Requires Follow-up)
- `requiresFollowUp`: Boolean flag
- `followUpDate`: Follow-up date
- `followUpNotes`: Follow-up notes
- `followUpCompleted`: Boolean flag

**Response Tracking**
- `requiresResponse`: Boolean flag
- `responseDeadline`: Response deadline
- `responseStatus`: Response status (Not Required, Pending, Completed, Overdue)
- `responseDate`: Response date

**Attachments**
- `attachments`: Array of attached documents
- `hasAttachments`: Boolean flag

**Related Communications**
- `relatedCommunications`: Array of related communications with relationship type

**Meeting/Call Details**
- `meetingDetails`: Object with meeting-specific details
- `phoneCallDetails`: Object with phone call details
- `letterDetails`: Object with letter/document details
- `courtDetails`: Object with court communication details

**Outcomes & Actions**
- `outcomes`: Array of outcomes with action items

**Priority**
- `priority`: Priority level (Low, Normal, High, Critical)
- `isImportant`: Boolean flag
- `isUrgent`: Boolean flag

**Security**
- `isConfidential`: Boolean flag
- `isPrivileged`: Boolean flag
- `hasLegalHold`: Boolean flag

**Billing**
- `isBillable`: Boolean flag (default: true)
- `billingCode`: Billing code
- `billingAmount`: Billing amount
- `billingStatus`: Status (Not Billed, Billed, Paid)

#### Model Methods:

**Static Methods**:
- `findByCase(caseId)`: Find communications for case
- `findByType(communicationType, days)`: Find communications by type
- `findRequiringFollowUp()`: Find communications needing follow-up
- `getTimeline(caseId, startDate, endDate)`: Get communication timeline
- `getAnalytics(filters)`: Get analytics by type and count

**Instance Methods**:
- `completeFollowUp()`: Mark follow-up as complete
- `addRelatedCommunication(communicationId, relationshipType)`: Link related communication

#### Indexes:
- Primary: `communicationId`, `caseId`
- Compound: `communicationType + direction`, `status + requiresFollowUp`, `communicationDate`
- Text: `subject`, `description`

---

### 8. CommunicationTemplate Model (`src/models/CommunicationTemplate.js`)

Email templates, letter templates, and standard correspondence.

#### Key Fields:

**Template Identification**
- `templateId`: Unique identifier (format: TMPL-YYYY-{random})
- `name`: Template name (required, max 200 chars)
- `title`: Template title (required)
- `description`: Template description

**Template Type & Category**
- `templateType`: Type (Email, Letter, SMS, Client Portal Message, Internal Message, Court Document, Form Letter)
- `category`: Category (Client Communication, Court Communication, Opposing Counsel, Internal, Administrative, Marketing, Billing)
- `subCategory`: Optional subcategory
- `practiceArea`: Practice area

**Template Content**
- `subject`: Template subject
- `body`: Template body (required)
- `bodyFormat`: Format (Plain Text, Rich Text, HTML, Markdown)

**Variables & Placeholders**
- `variables`: Array of variable definitions
  - `name`: Variable name
  - `label`: Display label
  - `type`: Data type (Text, Number, Date, Email, Phone, Address, Select, Multiline, Boolean)
  - `description`: Description
  - `defaultValue`: Default value
  - `required`: Boolean flag
  - `options`: Array of options (for Select type)
  - `validation`: Validation rules

**Attachments**
- `defaultAttachments`: Array of default attachments

**Template Settings**
- `settings`: Object with template settings
  - `requiresApproval`: Boolean
  - `isConfidential`: Boolean
  - `includeSignature`: Boolean
  - `includeDisclaimer`: Boolean
  - `disclaimerText`: Disclaimer text
  - `trackOpens`: Boolean
  - `trackClicks`: Boolean

**Email Specific Settings**
- `emailSettings`: Object with email settings
  - `fromName`: From name
  - `fromEmail`: From email
  - `replyTo`: Reply-to address
  - `cc`: CC addresses
  - `bcc`: BCC addresses
  - `priority`: Priority level

**Letter Specific Settings**
- `letterSettings`: Object with letter settings
  - `letterhead`: Boolean
  - `header`: Header text
  - `footer`: Footer text
  - `format`: Letter format
  - `includeDate`: Boolean
  - `includeAddress`: Boolean

**Usage & Statistics**
- `usageCount`: Usage count
- `lastUsedAt`: Last used timestamp
- `lastUsedBy`: Last user

**Version Control**
- `version`: Version number
- `isLatestVersion`: Boolean flag
- `previousVersionId`: Reference to previous version
- `versionHistory`: Array of version history

**Status & Visibility**
- `status`: Status (Draft, Active, Archived, Deprecated)
- `visibility`: Visibility (Public, Private, Team, Department, Organization)

**Sharing**
- `sharedWith`: Array of users with permissions

**Compliance**
- `requiresCompliance`: Boolean flag
- `complianceNotes`: Compliance notes
- `jurisdiction`: Jurisdiction
- `effectiveDate`: Effective date
- `expiryDate`: Expiry date

**Ratings & Favorites**
- `rating`: Average rating (0-5)
- `ratingCount`: Rating count
- `favoritedBy`: Array of users who favorited
- `favoriteCount`: Favorite count

#### Model Methods:

**Static Methods**:
- `findByType(templateType, status)`: Find templates by type
- `findByCategory(category, status)`: Find templates by category
- `findPopular(limit)`: Find most popular templates
- `searchTemplates(query, filters)`: Full-text search

**Instance Methods**:
- `incrementUsage(usedBy)`: Increment usage counter
- `createNewVersion(updates, modifiedBy)`: Create new version
- `addToFavorites(userId, username)`: Add to favorites
- `archiveTemplate(archivedBy)`: Archive template

#### Indexes:
- Primary: `templateId`
- Compound: `templateType + category`, `practiceArea + status`, `visibility + status`
- Sort: `usageCount` (descending)
- Text: `name`, `description`, `body`

---

## 🔐 Data Validation

All endpoints use Joi validation schemas (`src/validators/communicationValidators.js`):

### Validation Schemas:

1. **sendMessageSchema**: Validates internal messages
   - Required: content, senderName
   - Optional: messageType, subject, recipientId/groupId, priority, caseId, mentions, tags

2. **sendEmailSchema**: Validates email sending
   - Required: from (email/name), to array, subject, body, createdBy
   - Optional: cc, bcc, bodyPlainText, bodyHtml, priority, caseId, templateId

3. **scheduleConferenceSchema**: Validates video conference scheduling
   - Required: title, scheduledStartTime, scheduledEndTime, duration, hostName, createdBy
   - Optional: description, conferenceType, timezone, invitees, caseId, settings

4. **shareFileSchema**: Validates file sharing
   - Required: filename, fileType, fileSize, storagePath, ownerName, createdBy
   - Optional: shareType, accessControl, sharedWith, caseId, expiresAt, maxDownloads

5. **createWorkspaceSchema**: Validates workspace creation
   - Required: name, ownerName, createdBy
   - Optional: description, workspaceType, caseId, members, visibility, settings

6. **sendClientMessageSchema**: Validates client portal messages
   - Required: content, recipientName, recipientType, caseId, caseNumber, clientId, clientName, senderName, senderType, createdBy
   - Optional: messageType, subject, priority, appointment, paymentRequest

7. **trackExternalCommunicationSchema**: Validates external communication tracking
   - Required: communicationType, direction, subject, primaryContact, externalParticipants, caseId, caseNumber, communicationDate, createdBy
   - Optional: description, duration, requiresFollowUp, requiresResponse, priority

8. **createTemplateSchema**: Validates communication template creation
   - Required: name, title, templateType, category, body, createdBy
   - Optional: description, subCategory, practiceArea, subject, bodyFormat, variables, visibility, tags

9. **useTemplateSchema**: Validates template usage
   - Required: templateId, usedBy
   - Optional: variables, recipientName, recipientEmail, caseId, caseNumber

---

## 🔧 Business Logic Implementation

### 1. Internal Messaging System (POST `/api/communication/messages`)

**Business Logic:**
1. Validate message data using Joi schema
2. Generate unique message ID (format: MSG-{timestamp}-{random})
3. Create new Message document
4. Set status to 'Sent'
5. Process @mentions if present
6. Save message to database
7. Return message data with generated message ID

**Validation Rules:**
- Message type: Must be one of: Direct, Group, Broadcast, System, Announcement
- Content: Required, max 10000 characters
- Sender name: Required, 2-100 characters
- Recipient ID: Required for Direct messages (24-char hex ObjectId)
- Group ID: Required for Group messages
- Priority: Optional, defaults to "Normal"

**Error Handling:**
- 400: Invalid input data or validation error
- 503: Database not connected

**Response (DB connected):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": { ...messageObject },
    "messageId": "MSG-1234567890-1234"
  }
}
```

**Response (DB disconnected):**
```json
{
  "feature": "Internal Messaging System",
  "description": "Secure team messaging and chat",
  "endpoint": "/api/communication/messages",
  "capabilities": [...],
  "message": "Database not connected - showing capabilities only"
}
```

---

### 2. Email Integration (POST/GET `/api/communication/email`)

**Business Logic (POST):**
1. Validate email data using Joi schema
2. Generate unique email ID (format: EMAIL-{timestamp}-{random})
3. Create new Email document
4. Set emailType to 'Sent', direction to 'Outbound'
5. Set status to 'Sent' and sentAt to current timestamp
6. Process attachments if present
7. Auto-file to case if caseId provided
8. Save email to database
9. Return email data with generated email ID

**Business Logic (GET):**
1. Parse query parameters (folder, isRead, caseId, limit)
2. Build query filter
3. Fetch emails from database
4. Sort by creation date (newest first)
5. Apply limit (default: 50)
6. Return emails array

**Validation Rules:**
- From: Required, valid email format
- To: Required array with at least 1 recipient, valid email formats
- Subject: Required, max 500 characters
- Body: Required
- Priority: Optional, defaults to "Normal"
- Created by: Required

**Error Handling:**
- 400: Invalid input data, validation error, or database error

---

### 3. Video Conferencing (POST `/api/communication/video`)

**Business Logic:**
1. Validate conference data using Joi schema
2. Generate unique conference ID (format: CONF-{timestamp}-{random})
3. Generate meeting ID and meeting URL
4. Create new VideoConference document
5. Set status to 'Scheduled'
6. Process invitees if present
7. Save conference to database
8. Return conference data with meeting URL

**Validation Rules:**
- Title: Required, 3-200 characters
- Scheduled start time: Required, must be in future
- Scheduled end time: Required, must be after start time
- Duration: Required, 1-480 minutes
- Host name: Required, 2-100 characters
- Conference type: Optional, defaults to "Team Meeting"
- Settings: Optional object with recording, screen sharing, chat, waiting room settings

**Error Handling:**
- 400: Invalid input data, past dates, or validation error

---

### 4. File Sharing (POST `/api/communication/files`)

**Business Logic:**
1. Validate file data using Joi schema
2. Generate unique file ID and share ID
3. Generate shareable link
4. Extract file extension from filename
5. Create new SharedFile document
6. Set status to 'Active'
7. Process access control and shared users
8. Save file to database
9. Return file data with share link

**Validation Rules:**
- Filename: Required, max 255 characters
- File type: Required
- File size: Required, max 100 MB
- Storage path: Required
- Owner name: Required, 2-100 characters
- Share type: Optional, defaults to "Internal"
- Access control: Optional, defaults to "Team"

**Error Handling:**
- 400: Invalid input data, file too large, or validation error

---

### 5. Team Collaboration Spaces (POST `/api/communication/workspaces`)

**Business Logic:**
1. Validate workspace data using Joi schema
2. Generate unique workspace ID (format: WS-YYYY-{random})
3. Create new Workspace document
4. Set status to 'Active'
5. Initialize member count and statistics
6. Save workspace to database
7. Create initial activity ("Workspace Created")
8. Return workspace data with workspace ID

**Validation Rules:**
- Name: Required, 3-200 characters
- Description: Optional, max 2000 characters
- Workspace type: Optional, defaults to "Case Workspace"
- Owner name: Required, 2-100 characters
- Visibility: Optional, defaults to "Team"
- Members: Optional array with username, email, role

**Error Handling:**
- 400: Invalid input data or validation error

---

### 6. Client Communication Portal (POST `/api/communication/client-portal`)

**Business Logic:**
1. Validate client message data using Joi schema
2. Generate unique message ID
3. Determine sender/recipient models based on types
4. Create new ClientMessage document
5. Set status to 'Sent'
6. Process attachments and appointment/payment data if present
7. Save message to database
8. Return message data with message ID

**Validation Rules:**
- Content: Required, max 10000 characters
- Message type: Optional, defaults to "Message"
- Recipient name/type: Required
- Case ID and number: Required (valid ObjectId)
- Client ID and name: Required (valid ObjectId)
- Sender name/type: Required
- Appointment: Required if messageType is "Appointment"
- Payment request: Required if messageType is "Payment Request"

**Error Handling:**
- 400: Invalid input data, missing required fields, or validation error

---

### 7. External Communication Tracking (POST/GET `/api/communication/external`)

**Business Logic (POST):**
1. Validate communication data using Joi schema
2. Generate unique communication ID (format: COMM-YYYY-{random})
3. Create new ExternalCommunication document
4. Set status to 'Completed'
5. Process attachments and participants
6. Save communication to database
7. Return communication data with communication ID

**Business Logic (GET):**
1. Parse query parameters (caseId, communicationType, direction, limit)
2. Build query filter
3. Fetch communications from database
4. Sort by communication date (newest first)
5. Apply limit (default: 50)
6. Return communications array

**Validation Rules:**
- Communication type: Required, must be one of predefined types
- Direction: Required (Inbound or Outbound)
- Subject: Required, 3-500 characters
- Primary contact: Required, 2-100 characters
- External participants: Required array with at least 1 participant
- Case ID and number: Required (valid ObjectId)
- Communication date: Required

**Error Handling:**
- 400: Invalid input data, missing participants, or validation error

---

### 8. Communication Templates (POST/GET `/api/communication/templates`)

**Business Logic (POST):**
1. Validate template data using Joi schema
2. Generate unique template ID (format: TMPL-YYYY-{random})
3. Create new CommunicationTemplate document
4. Set status to 'Active'
5. Process variables and validation rules
6. Save template to database
7. Return template data with template ID

**Business Logic (GET):**
1. Parse query parameters (templateType, category, practiceArea, status, limit)
2. Build query filter (default status: Active)
3. Fetch templates from database
4. Sort by name (alphabetically)
5. Apply limit (default: 50)
6. Return templates array

**Validation Rules:**
- Name: Required, 3-200 characters
- Title: Required, 3-200 characters
- Template type: Required, must be one of predefined types
- Category: Required, must be one of predefined categories
- Body: Required
- Body format: Optional, defaults to "Rich Text"
- Variables: Optional array with name, label, type, validation rules
- Visibility: Optional, defaults to "Organization"

**Error Handling:**
- 400: Invalid input data, invalid variable definitions, or validation error

---

## 📊 Database Features

### Indexes for Performance

All models include optimized indexes for common query patterns:

1. **Message Model**
   - Single field: `messageId`, `senderId`, `recipientId`, `groupId`, `caseId`
   - Compound: `senderId + createdAt`, `recipientId + status`, `groupId + createdAt`
   - Text search: `content`, `subject`

2. **Email Model**
   - Single field: `emailId`, `from.email`, `caseId`
   - Compound: `status + emailType`, `folder + isRead`
   - Text search: `subject`, `bodyPlainText`

3. **VideoConference Model**
   - Single field: `conferenceId`, `hostId`, `caseId`
   - Compound: `hostId + scheduledStartTime`, `status + scheduledStartTime`

4. **SharedFile Model**
   - Single field: `fileId`, `shareId`, `ownerId`, `caseId`
   - Compound: `ownerId + createdAt`, `status + expiresAt`, `shareType + status`

5. **Workspace Model**
   - Single field: `workspaceId`, `ownerId`, `caseId`
   - Compound: `ownerId + status`, `workspaceType + status`

6. **ClientMessage Model**
   - Single field: `messageId`, `clientId`, `caseId`
   - Compound: `clientId + createdAt`, `caseId + createdAt`, `status + isRead`

7. **ExternalCommunication Model**
   - Single field: `communicationId`, `caseId`
   - Compound: `caseId + communicationDate`, `communicationType + direction`, `status + requiresFollowUp`
   - Text search: `subject`, `description`

8. **CommunicationTemplate Model**
   - Single field: `templateId`
   - Compound: `templateType + category`, `practiceArea + status`, `visibility + status`
   - Sort: `usageCount` (descending)
   - Text search: `name`, `description`, `body`

### Pre-save Hooks

1. **SharedFile**: Checks expiration and download limits before saving
2. **Workspace**: Updates member count automatically

### Static Methods

Each model provides static methods for common queries:
- Finding by case/user/type
- Searching with filters
- Getting analytics and statistics
- Finding items requiring action (follow-up, response, etc.)

### Instance Methods

Each model provides instance methods for common operations:
- Marking as read/complete
- Adding reactions/comments
- Tracking events (downloads, views, opens)
- Creating versions
- Updating status

---

## 🔄 Integration Points

### Case Management Integration
- All communication models can be linked to cases via `caseId` and `caseNumber`
- Enables case-centric communication tracking
- Supports communication history and timeline views

### Document Management Integration
- Emails and external communications can reference documents
- Client messages can share documents with access controls
- Shared files integrate with document management

### Task & Workflow Integration
- Messages can be linked to tasks via case association
- Workspaces can include task lists
- Communication triggers can initiate workflows

### Client Portal Integration
- ClientMessage model provides secure client communication
- Supports document sharing, appointment booking, and payment requests
- Integrates with case and client management

---

## 🛡️ Security Features

### Encryption & Confidentiality
- Client messages encrypted by default
- Confidential flags for sensitive communications
- Legal hold support for compliance

### Access Controls
- Role-based permissions for workspaces
- Granular file sharing permissions
- User and team-based access control

### Tracking & Auditing
- Complete audit trails for all communications
- Download and view tracking for shared files
- Edit history for messages and templates

### Compliance
- Email tracking and retention
- Communication templates with compliance notes
- External communication tracking for legal requirements

---

## 📈 Analytics & Reporting

### Usage Statistics
- Template usage tracking
- Workspace activity metrics
- File download and view counts
- Email open and click tracking

### Communication Analytics
- External communication analytics by type
- Timeline views for case communications
- Response tracking and follow-up monitoring

---

## 🎯 Best Practices

### 1. Message Organization
- Use appropriate message types (Direct, Group, Broadcast)
- Link messages to cases when relevant
- Use mentions for important notifications
- Thread related messages together

### 2. Email Management
- Auto-file emails to cases
- Use folders and labels for organization
- Track important emails requiring responses
- Archive old emails regularly

### 3. Video Conferencing
- Schedule conferences in advance
- Enable recordings for depositions and important meetings
- Use waiting rooms for client meetings
- Track participant attendance

### 4. File Sharing
- Set appropriate access controls
- Use expiration dates for temporary shares
- Enable download tracking for sensitive files
- Review and revoke unnecessary access

### 5. Workspace Management
- Create case-specific workspaces
- Assign appropriate member roles
- Monitor workspace activity
- Archive completed workspaces

### 6. Client Communication
- Use appropriate message types
- Set response deadlines for important messages
- Share documents with access expiry
- Track appointment confirmations

### 7. External Communication
- Log all external communications promptly
- Track follow-up requirements
- Link related communications
- Mark billable communications

### 8. Template Usage
- Create templates for common communications
- Use variables for personalization
- Track template effectiveness
- Update templates regularly

---

## 🚀 Performance Optimization

### Database Queries
- All list operations use pagination (default limit: 50)
- Indexes optimize common query patterns
- Compound indexes for filtered queries
- Text indexes for search functionality

### Caching Considerations
- Template data can be cached
- Workspace settings can be cached
- User permissions can be cached
- Communication counts can be cached

### Scalability
- Models designed for horizontal scaling
- Denormalized fields reduce joins
- Archive old data to maintain performance
- Use aggregation pipelines for analytics

---

## 📝 Error Handling

All endpoints implement consistent error handling:

### Common Error Codes
- **400 Bad Request**: Invalid input data, validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Database errors, unexpected errors
- **503 Service Unavailable**: Database not connected

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔍 Testing

### Test Coverage
- 18 integration tests covering all 8 sub-features
- Tests for both database connected and disconnected states
- Error handling tests
- Validation tests
- Feature completeness tests

### Test Categories
1. Overview endpoint test
2. Sub-feature capability tests (8 tests)
3. Data validation tests
4. Error handling tests
5. Feature completeness test
6. Database integration test

All tests pass successfully with comprehensive coverage of the Communication & Collaboration system.

---

## 📚 Additional Resources

### Related Documentation
- `FEATURE_SUMMARY.md`: High-level feature overview
- `API_REFERENCE.md`: Complete API reference
- `tests/communication-collaboration.test.js`: Test suite

### Model Files
- `src/models/Message.js`: Internal messaging
- `src/models/Email.js`: Email integration
- `src/models/VideoConference.js`: Video conferencing
- `src/models/SharedFile.js`: File sharing
- `src/models/Workspace.js`: Team collaboration
- `src/models/ClientMessage.js`: Client portal
- `src/models/ExternalCommunication.js`: External tracking
- `src/models/CommunicationTemplate.js`: Templates

### Validator Files
- `src/validators/communicationValidators.js`: All validation schemas

### Route Files
- `src/features/communication.js`: API routes and business logic

---

**Implementation Status**: ✅ **COMPLETE**

All 8 sub-features are fully implemented with:
- Complete data models with Mongoose schemas
- Comprehensive Joi validation
- Full business logic implementation
- Database integration with MongoDB
- Error handling and edge cases
- Comprehensive test coverage
- Complete documentation
