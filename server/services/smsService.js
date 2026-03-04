// SMS Service for Smart Power Notify
// In production, integrate with Twilio, Africa’s Talking, or other SMS providers

// Send SMS to a single user
const sendSMS = async (phone, message) => {
  // For demo purposes, we'll log to console
  // In production, integrate with:
  // - Twilio: https://www.twilio.com/docs/sms
  // - Africa's Talking: https://africastalking.com/sms
  
  console.log('📱 ======================================');
  console.log('📱 SMS SENT (Simulation)');
  console.log('📱 ======================================');
  console.log(`📱 To: ${phone}`);
  console.log(`📱 Message: ${message}`);
  console.log('📱 ======================================');

  // Simulate SMS sending delay
  // In production, this would be an API call
  return { success: true, simulated: true, to: phone };
};

// Send bulk SMS to multiple users
const sendBulkSMS = async (users, message) => {
  const results = [];
  
  console.log('📱 ======================================');
  console.log(`📱 BULK SMS - Sending to ${users.length} users`);
  console.log('📱 ======================================');
  
  for (const user of users) {
    console.log(`📱 To: ${user.phone} | ${user.name}`);
    results.push({ phone: user.phone, success: true });
  }
  
  console.log(`📱 Message: ${message}`);
  console.log('📱 ======================================');
  
  return { success: true, simulated: true, count: users.length, results };
};

// Send notification SMS to users in affected area
const sendNotificationSMS = async (users, notification) => {
  const message = `⚡ Smart Power Notify - ${notification.title}\n\n${notification.message}\n\nArea: ${notification.area.district}, ${notification.area.province}\nTime: ${new Date(notification.startTime).toLocaleString()} - ${new Date(notification.endTime).toLocaleString()}\n\nFrom: Rwanda Energy Group`;
  
  return await sendBulkSMS(users, message);
};

// Format phone number for Rwanda (ensure it starts with +250)
const formatPhoneNumber = (phone) => {
  // Remove any spaces or dashes
  let cleaned = phone.replace(/[\s-]/g, '');
  
  // If it starts with 0, replace with +250
  if (cleaned.startsWith('0')) {
    cleaned = '+250' + cleaned.substring(1);
  }
  
  // If it doesn't start with +, add +250
  if (!cleaned.startsWith('+')) {
    cleaned = '+250' + cleaned;
  }
  
  return cleaned;
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendNotificationSMS,
  formatPhoneNumber
};
