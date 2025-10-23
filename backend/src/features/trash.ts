/**
 * Trash Feature - Soft delete and recovery endpoints
 * Provides trash bin functionality with restore capabilities
 */

import { Router, Request, Response } from 'express';
import TrashService from '../services/TrashService';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/trash
 * @desc Get all deleted items (trash bin view)
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type } = req.query;

    const items = await TrashService.getTrashItems(userId, type as string | undefined);

    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trash items',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/case/:id/delete
 * @desc Soft delete a case
 */
router.post('/case/:id/delete', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.deleteCase(id, userId);

    res.json({
      success: true,
      message: 'Case moved to trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete case',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/case/:id/restore
 * @desc Restore a deleted case
 */
router.post('/case/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.restoreCase(id, userId);

    res.json({
      success: true,
      message: 'Case restored from trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to restore case',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/document/:id/delete
 * @desc Soft delete a document
 */
router.post('/document/:id/delete', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.deleteDocument(id, userId);

    res.json({
      success: true,
      message: 'Document moved to trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/document/:id/restore
 * @desc Restore a deleted document
 */
router.post('/document/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.restoreDocument(id, userId);

    res.json({
      success: true,
      message: 'Document restored from trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to restore document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/task/:id/delete
 * @desc Soft delete a task
 */
router.post('/task/:id/delete', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.deleteTask(id, userId);

    res.json({
      success: true,
      message: 'Task moved to trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/task/:id/restore
 * @desc Restore a deleted task
 */
router.post('/task/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.restoreTask(id, userId);

    res.json({
      success: true,
      message: 'Task restored from trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to restore task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/client/:id/delete
 * @desc Soft delete a client
 */
router.post('/client/:id/delete', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.deleteClient(id, userId);

    res.json({
      success: true,
      message: 'Client moved to trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete client',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/trash/client/:id/restore
 * @desc Restore a deleted client
 */
router.post('/client/:id/restore', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await TrashService.restoreClient(id, userId);

    res.json({
      success: true,
      message: 'Client restored from trash'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to restore client',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route DELETE /api/trash/empty/:type
 * @desc Empty trash for a specific type (admin only)
 */
router.delete('/empty/:type', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type } = req.params;

    const deleted = await TrashService.emptyTrash(type, userId);

    res.json({
      success: true,
      message: `Permanently deleted ${deleted} ${type}(s)`,
      count: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to empty trash',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route DELETE /api/trash/cleanup
 * @desc Clean up expired trash items (admin only, cron job)
 */
router.delete('/cleanup', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const result = await TrashService.cleanupExpiredItems();

    res.json({
      success: true,
      message: `Cleaned up ${result.total} expired items`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired items',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
