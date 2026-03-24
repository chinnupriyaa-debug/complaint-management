import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { authMiddleware, roleMiddleware, validateComplaint } from '../middleware/customMiddleware.js';
import { workerManager } from '../workers/workerManager.js';

const router = express.Router();

// ============================================
// MONGODB AGGREGATION PIPELINE - Advanced Topic
// ============================================

// Get complaint statistics using Aggregation Pipeline
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      // Stage 1: Group by status and count
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          complaints: { $push: '$$ROOT' }
        }
      },
      // Stage 2: Project to reshape
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      },
      // Stage 3: Sort by count
      {
        $sort: { count: -1 }
      }
    ]);

    // Priority-wise statistics
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $ne: ['$resolvedAt', null] },
                { $subtract: ['$resolvedAt', '$createdAt'] },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          priority: '$_id',
          count: 1,
          avgResolutionTimeHours: {
            $divide: ['$avgResolutionTime', 3600000]
          },
          _id: 0
        }
      }
    ]);

    // Issue category statistics
    const issueStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$issue',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          rectified: {
            $sum: { $cond: [{ $eq: ['$status', 'Rectified'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          issue: '$_id',
          total: 1,
          pending: 1,
          rectified: 1,
          resolutionRate: {
            $multiply: [
              { $divide: ['$rectified', { $max: ['$total', 1] }] },
              100
            ]
          },
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Recent trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrends = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      statusStats: stats,
      priorityStats,
      issueStats,
      dailyTrends,
      totalComplaints: await Complaint.countDocuments()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Student: Submit new complaint
router.post('/', authMiddleware, roleMiddleware('student'), validateComplaint, async (req, res) => {
  try {
    const { issue, priority, complaint } = req.body;

    const newComplaint = new Complaint({
      studentId: req.user.id,
      studentUsername: req.user.username,
      issue,
      priority,
      complaint
    });

    await newComplaint.save();

    // Get all faculty for alert notification
    const faculty = await User.find({ role: 'faculty' });
    
    // Schedule alert for each faculty member (10 seconds)
    faculty.forEach(f => {
      workerManager.scheduleAlert(
        newComplaint._id.toString(),
        f.email,
        newComplaint.toObject(),
        10000 // 10 seconds
      );
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: newComplaint
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// Student: Get own complaints (history)
router.get('/my-complaints', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('facultyId', 'username');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Faculty: Get all pending complaints
router.get('/pending', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Pending' })
      .sort({ priority: -1, createdAt: 1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending complaints' });
  }
});

// Faculty: Get all complaints
router.get('/all', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('studentId', 'username email')
      .populate('facultyId', 'username');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Faculty: Respond to complaint
router.patch('/:id/respond', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    // Cancel the alert since faculty is responding
    workerManager.cancelAlert(id);

    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.facultyResponse = response;
    complaint.facultyId = req.user.id;
    complaint.updatedAt = new Date();
    
    if (status === 'Rectified') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Respond error:', error);
    res.status(500).json({ message: 'Error updating complaint' });
  }
});

// Faculty: Get complaint history (handled complaints)
router.get('/history', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ facultyId: req.user.id })
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Get single complaint
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'username email')
      .populate('facultyId', 'username');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint' });
  }
});

export default router;
