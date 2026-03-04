const nodemailer = require('nodemailer');

// Email configuration - Uses Ethereal for testing (free, auto-creates account)
// In production, use Gmail, SendGrid, or AWS SES
let cachedTransporter = null;
let testAccount = null;

const createTransporter = async () => {
  // Option 1: Use Gmail if credentials provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Option 2: Use Ethereal for testing (free, auto-creates account)
  if (!cachedTransporter) {
    testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('📧 Ethereal test account created:', testAccount.user);
    console.log('📧 Password:', testAccount.pass);
  }
  
  return cachedTransporter;
};

// Send welcome email to new user
const sendWelcomeEmail = async (user) => {
  if (!user.email) {
    console.log('📧 No email address provided, skipping welcome email');
    return { success: false, reason: 'no_email' };
  }

  const transporter = await createTransporter();
  
  const mailOptions = {
    from: '"Smart Power Notify - Rwanda Energy Group" <noreply@reg.rw>',
    to: user.email,
    subject: 'Welcome to Smart Power Notify - Registration Confirmed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0EA5E9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ Smart Power Notify</h1>
            <p>Rwanda Energy Group</p>
          </div>
          <div class="content">
            <h2>Welcome, ${user.name}!</h2>
            <p>Your registration with Smart Power Notify has been successfully completed.</p>
            
            <h3>Your Account Details:</h3>
            <ul>
              <li><strong>Phone:</strong> ${user.phone}</li>
              <li><strong>Meter Number:</strong> ${user.meterNumber}</li>
              <li><strong>Location:</strong> ${user.sector}, ${user.district}, ${user.province}</li>
            </ul>
            
            <p>You can now:</p>
            <ul>
              <li>📱 Receive real-time power outage notifications</li>
              <li>📋 View scheduled maintenance and restoration times</li>
              <li>⚠️ Report power issues in your area</li>
              <li>🔔 Get SMS alerts for your district</li>
            </ul>
            
            <p>Login to your account at: <a href="http://localhost:3000">http://localhost:3000</a></p>
          </div>
          <div class="footer">
            <p>This is an automated message from Rwanda Energy Group.</p>
            <p>© 2024 Smart Power Notify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  // Try to send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    
    // Show preview URL for testing (only works with Ethereal)
    if (info.messageId && info.messageId.includes('ethereal')) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Preview URL:', previewUrl);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    // Log as fallback
    console.log('📧 ======================================');
    console.log('📧 EMAIL FALLBACK - Would be sent to:');
    console.log('📧 To:', user.email);
    console.log('📧 Subject:', mailOptions.subject);
    console.log('📧 ======================================');
    return { success: false, error: error.message, simulated: true };
  }
};

// Send notification email to user
const sendNotificationEmail = async (user, notification) => {
  if (!user.email) {
    return { success: false, reason: 'no_email' };
  }

  console.log('📧 ======================================');
  console.log('📧 NOTIFICATION EMAIL (Simulation)');
  console.log('📧 ======================================');
  console.log(`📧 To: ${user.email}`);
  console.log(`📧 Subject: ${notification.title}`);
  console.log(`📧 Message: ${notification.message}`);
  console.log(`📧 Area: ${notification.area.province}, ${notification.area.district}`);
  console.log(`📧 Type: ${notification.type}`);
  console.log('📧 ======================================');

  return { success: true, simulated: true };
};

module.exports = {
  sendWelcomeEmail,
  sendNotificationEmail
};
