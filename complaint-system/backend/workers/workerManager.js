// ============================================
// WORKER MANAGER - Manages Worker Threads
// ============================================

import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.pendingAlerts = new Map();
  }

  // Create a new worker for sending alerts
  createAlertWorker(facultyEmail, complaintData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, 'alertWorker.js'),
        {
          workerData: { facultyEmail, complaintData }
        }
      );

      const workerId = complaintData._id.toString();
      this.workers.set(workerId, worker);

      worker.on('message', (message) => {
        console.log('[WorkerManager] Received message from worker:', message);
        if (message.type === 'ALERT_RESULT') {
          resolve(message.result);
          this.cleanupWorker(workerId);
        }
      });

      worker.on('error', (error) => {
        console.error('[WorkerManager] Worker error:', error);
        reject(error);
        this.cleanupWorker(workerId);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`[WorkerManager] Worker exited with code ${code}`);
        }
        this.cleanupWorker(workerId);
      });
    });
  }

  // Schedule an alert after delay (10 seconds)
  scheduleAlert(complaintId, facultyEmail, complaintData, delay = 10000) {
    console.log(`[WorkerManager] Scheduling alert for complaint ${complaintId} in ${delay}ms`);
    
    const timeoutId = setTimeout(async () => {
      console.log(`[WorkerManager] Alert timeout reached for complaint ${complaintId}`);
      
      try {
        const result = await this.createAlertWorker(facultyEmail, complaintData);
        console.log('[WorkerManager] Alert sent:', result);
      } catch (error) {
        console.error('[WorkerManager] Failed to send alert:', error);
      }
      
      this.pendingAlerts.delete(complaintId);
    }, delay);

    this.pendingAlerts.set(complaintId, timeoutId);
  }

  // Cancel scheduled alert (when faculty responds in time)
  cancelAlert(complaintId) {
    const timeoutId = this.pendingAlerts.get(complaintId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pendingAlerts.delete(complaintId);
      console.log(`[WorkerManager] Alert cancelled for complaint ${complaintId}`);
      return true;
    }
    return false;
  }

  // Cleanup worker
  cleanupWorker(workerId) {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.terminate();
      this.workers.delete(workerId);
    }
  }

  // Get pending alert count
  getPendingAlertCount() {
    return this.pendingAlerts.size;
  }

  // Cleanup all workers
  cleanup() {
    for (const [id, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
    
    for (const [id, timeoutId] of this.pendingAlerts) {
      clearTimeout(timeoutId);
    }
    this.pendingAlerts.clear();
  }
}

// Export singleton instance
export const workerManager = new WorkerManager();
