// ============================================
// WORKER THREADS - Node.js Advanced Topic
// This worker handles email alerts for pending complaints
// ============================================

import { parentPort, workerData } from 'worker_threads';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'annauni.complaints@gmail.com',
      pass: process.env.EMAIL_PASS || 'your_app_password'
    }
  });
};

// Function to send alert email
const sendAlertEmail = async (facultyEmail, complaintData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: '"Anna University Complaints" <annauni.complaints@gmail.com>',
    to: facultyEmail,
    subject: `URGENT: Pending Complaint Alert - ${complaintData.issue}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #1a237e, #3f51b5); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .priority-high { color: #d32f2f; font-weight: bold; }
          .priority-critical { color: #b71c1c; font-weight: bold; animation: blink 1s infinite; }
          .complaint-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Anna University</h1>
            <h2>Complaint Management System</h2>
          </div>
          <div class="content">
            <h3>URGENT: Complaint Requires Immediate Attention!</h3>
            <p>A complaint has been pending for more than 10 seconds without response.</p>
            
            <div class="complaint-box">
              <p><strong>Student:</strong> ${complaintData.studentUsername}</p>
              <p><strong>Issue Category:</strong> ${complaintData.issue}</p>
              <p><strong>Priority:</strong> <span class="priority-${complaintData.priority.toLowerCase()}">${complaintData.priority}</span></p>
              <p><strong>Complaint:</strong></p>
              <p>${complaintData.complaint}</p>
              <p><strong>Submitted:</strong> ${new Date(complaintData.createdAt).toLocaleString()}</p>
            </div>
            
            <p>Please log in to the system and respond to this complaint immediately.</p>
            <p><a href="http://localhost:4200/faculty-login" style="background: #1a237e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Respond Now</a></p>
          </div>
          <div class="footer">
            <p>This is an automated message from Anna University Complaint Management System</p>
            <p>&copy; 2024 Anna University, Chennai</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Process incoming alert requests
const processAlert = async () => {
  if (workerData) {
    const { facultyEmail, complaintData } = workerData;
    
    console.log(`[Worker] Processing alert for complaint: ${complaintData._id}`);
    console.log(`[Worker] Sending email to: ${facultyEmail}`);
    
    const result = await sendAlertEmail(facultyEmail, complaintData);
    
    // Send result back to main thread
    if (parentPort) {
      parentPort.postMessage({
        type: 'ALERT_RESULT',
        complaintId: complaintData._id,
        result
      });
    }
  }
};

// Listen for messages from main thread
if (parentPort) {
  parentPort.on('message', async (message) => {
    if (message.type === 'SEND_ALERT') {
      const result = await sendAlertEmail(message.facultyEmail, message.complaintData);
      parentPort.postMessage({
        type: 'ALERT_RESULT',
        complaintId: message.complaintData._id,
        result
      });
    }
  });
}

// Run if started with initial data
processAlert();
