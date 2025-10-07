-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT NOT NULL,
    "clientId" TEXT,
    "matterType" TEXT NOT NULL,
    "practiceArea" TEXT NOT NULL,
    "caseType" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Open',
    "statusHistory" JSONB,
    "assignedTo" TEXT,
    "assignmentHistory" JSONB,
    "filingDate" TIMESTAMP(3),
    "openedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "nextHearingDate" TIMESTAMP(3),
    "estimatedValue" DOUBLE PRECISION,
    "billingStatus" TEXT NOT NULL DEFAULT 'Not Started',
    "outcome" TEXT,
    "resolution" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "archivedDate" TIMESTAMP(3),
    "archivedBy" TEXT,
    "retentionDate" TIMESTAMP(3),
    "canReopen" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "noteType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'Team Only',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseTimelineEvent" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "storagePath" TEXT,
    "cloudUrl" TEXT,
    "checksum" TEXT,
    "folderId" TEXT,
    "folderPath" TEXT NOT NULL DEFAULT '/',
    "category" TEXT NOT NULL DEFAULT 'Other',
    "tags" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "isLatestVersion" BOOLEAN NOT NULL DEFAULT true,
    "parentVersionId" TEXT,
    "versionHistory" JSONB,
    "customMetadata" JSONB,
    "extractedText" TEXT,
    "pageCount" INTEGER,
    "caseId" TEXT,
    "caseNumber" TEXT,
    "clientId" TEXT,
    "relatedDocuments" TEXT[],
    "visibility" TEXT NOT NULL DEFAULT 'Team Only',
    "permissions" JSONB,
    "encrypted" BOOLEAN NOT NULL DEFAULT false,
    "encryptionKey" TEXT,
    "watermarked" BOOLEAN NOT NULL DEFAULT false,
    "accessLog" JSONB,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedBy" TEXT,
    "lockedAt" TIMESTAMP(3),
    "checkoutBy" TEXT,
    "checkoutAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateCategory" TEXT,
    "templateVariables" JSONB,
    "practiceArea" TEXT,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT,
    "lastModifiedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "archivedBy" TEXT,
    "archivedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changeDescription" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReview" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "reviewDecision" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "taskNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT NOT NULL DEFAULT 'Other',
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "statusHistory" JSONB,
    "assignedTo" TEXT,
    "assignedBy" TEXT,
    "team" JSONB,
    "assignmentHistory" JSONB,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "dependsOn" JSONB,
    "blockedBy" JSONB,
    "isBlocking" BOOLEAN NOT NULL DEFAULT false,
    "caseId" TEXT,
    "caseNumber" TEXT,
    "workflowId" TEXT,
    "workflowName" TEXT,
    "parentTaskId" TEXT,
    "subtasks" TEXT[],
    "fromTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT,
    "templateName" TEXT,
    "slaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "slaDueDate" TIMESTAMP(3),
    "slaStatus" TEXT NOT NULL DEFAULT 'Not Applicable',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "attachmentCount" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "checklist" JSONB,
    "reminders" JSONB,
    "notifyOnCompletion" BOOLEAN NOT NULL DEFAULT true,
    "notificationRecipients" TEXT[],
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePattern" JSONB,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT,
    "lastModifiedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "cancelledBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'Team',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskTemplate" (
    "id" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "taskType" TEXT NOT NULL,
    "defaultPriority" TEXT NOT NULL DEFAULT 'Medium',
    "estimatedHours" DOUBLE PRECISION,
    "checklist" JSONB,
    "tags" TEXT[],
    "practiceArea" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "workflowName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "practiceArea" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "stages" JSONB,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "evidenceNumber" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "evidenceType" TEXT NOT NULL,
    "custodian" TEXT,
    "collectionDate" TIMESTAMP(3) NOT NULL,
    "collectionMethod" TEXT NOT NULL,
    "sourceLocation" TEXT,
    "chainOfCustody" JSONB,
    "preservationStatus" TEXT NOT NULL DEFAULT 'Preserved',
    "hashValue" TEXT,
    "fileSize" INTEGER,
    "tags" TEXT[],
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'Collected',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivilegeLog" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "documentId" TEXT,
    "privilegeType" TEXT NOT NULL,
    "batesNumber" TEXT,
    "documentDescription" TEXT NOT NULL,
    "author" TEXT,
    "recipient" TEXT,
    "dateCreated" TIMESTAMP(3),
    "privilegeBasis" TEXT NOT NULL,
    "clawbackProtection" BOOLEAN NOT NULL DEFAULT true,
    "loggedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivilegeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Production" (
    "id" TEXT NOT NULL,
    "productionName" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "productionType" TEXT NOT NULL,
    "startBatesNumber" TEXT,
    "endBatesNumber" TEXT,
    "documentCount" INTEGER NOT NULL DEFAULT 0,
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT NOT NULL DEFAULT 'PDF',
    "loadFileGenerated" BOOLEAN NOT NULL DEFAULT false,
    "producedTo" TEXT NOT NULL,
    "productionDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "documents" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalHold" (
    "id" TEXT NOT NULL,
    "holdName" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "description" TEXT,
    "custodians" TEXT[],
    "issueDate" TIMESTAMP(3) NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Active',
    "acknowledgments" JSONB,
    "escalations" JSONB,
    "issuedBy" TEXT NOT NULL,
    "releasedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalHold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_caseNumber_idx" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_assignedTo_idx" ON "Case"("assignedTo");

-- CreateIndex
CREATE INDEX "Case_archived_idx" ON "Case"("archived");

-- CreateIndex
CREATE INDEX "CaseNote_caseId_idx" ON "CaseNote"("caseId");

-- CreateIndex
CREATE INDEX "CaseTimelineEvent_caseId_idx" ON "CaseTimelineEvent"("caseId");

-- CreateIndex
CREATE INDEX "CaseTimelineEvent_eventDate_idx" ON "CaseTimelineEvent"("eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "Document_documentNumber_key" ON "Document"("documentNumber");

-- CreateIndex
CREATE INDEX "Document_documentNumber_idx" ON "Document"("documentNumber");

-- CreateIndex
CREATE INDEX "Document_caseId_idx" ON "Document"("caseId");

-- CreateIndex
CREATE INDEX "Document_category_idx" ON "Document"("category");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_isTemplate_idx" ON "Document"("isTemplate");

-- CreateIndex
CREATE INDEX "Document_isLatestVersion_idx" ON "Document"("isLatestVersion");

-- CreateIndex
CREATE INDEX "DocumentVersion_documentId_idx" ON "DocumentVersion"("documentId");

-- CreateIndex
CREATE INDEX "DocumentReview_documentId_idx" ON "DocumentReview"("documentId");

-- CreateIndex
CREATE INDEX "DocumentReview_assignedTo_idx" ON "DocumentReview"("assignedTo");

-- CreateIndex
CREATE INDEX "DocumentReview_status_idx" ON "DocumentReview"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskNumber_key" ON "Task"("taskNumber");

-- CreateIndex
CREATE INDEX "Task_taskNumber_idx" ON "Task"("taskNumber");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_assignedTo_idx" ON "Task"("assignedTo");

-- CreateIndex
CREATE INDEX "Task_caseId_idx" ON "Task"("caseId");

-- CreateIndex
CREATE INDEX "Task_workflowId_idx" ON "Task"("workflowId");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "TaskComment_taskId_idx" ON "TaskComment"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskTemplate_templateName_key" ON "TaskTemplate"("templateName");

-- CreateIndex
CREATE INDEX "TaskTemplate_templateName_idx" ON "TaskTemplate"("templateName");

-- CreateIndex
CREATE INDEX "TaskTemplate_category_idx" ON "TaskTemplate"("category");

-- CreateIndex
CREATE INDEX "TaskTemplate_isActive_idx" ON "TaskTemplate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_workflowName_key" ON "Workflow"("workflowName");

-- CreateIndex
CREATE INDEX "Workflow_workflowName_idx" ON "Workflow"("workflowName");

-- CreateIndex
CREATE INDEX "Workflow_status_idx" ON "Workflow"("status");

-- CreateIndex
CREATE INDEX "Workflow_isTemplate_idx" ON "Workflow"("isTemplate");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_evidenceNumber_key" ON "Evidence"("evidenceNumber");

-- CreateIndex
CREATE INDEX "Evidence_evidenceNumber_idx" ON "Evidence"("evidenceNumber");

-- CreateIndex
CREATE INDEX "Evidence_caseId_idx" ON "Evidence"("caseId");

-- CreateIndex
CREATE INDEX "Evidence_evidenceType_idx" ON "Evidence"("evidenceType");

-- CreateIndex
CREATE INDEX "PrivilegeLog_caseId_idx" ON "PrivilegeLog"("caseId");

-- CreateIndex
CREATE INDEX "PrivilegeLog_privilegeType_idx" ON "PrivilegeLog"("privilegeType");

-- CreateIndex
CREATE INDEX "Production_caseId_idx" ON "Production"("caseId");

-- CreateIndex
CREATE INDEX "Production_productionDate_idx" ON "Production"("productionDate");

-- CreateIndex
CREATE INDEX "LegalHold_caseId_idx" ON "LegalHold"("caseId");

-- CreateIndex
CREATE INDEX "LegalHold_status_idx" ON "LegalHold"("status");

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseTimelineEvent" ADD CONSTRAINT "CaseTimelineEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
