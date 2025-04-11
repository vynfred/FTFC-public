const functions = require('firebase-functions/v1');
const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { EMAIL_TYPES, sendEmail } = require('./emailService');

// Don't initialize Firebase Admin here, it's already initialized in index.js

/**
 * Send welcome email to a new user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Result of the operation
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    // Send welcome email
    const result = await sendEmail(email, EMAIL_TYPES.WELCOME, {
      name: name || 'Valued Client',
    });

    // Log result
    if (result.success) {
      console.log(`Welcome email sent to ${email}`);
    } else {
      console.error(`Failed to send welcome email to ${email}:`, result.error);
    }

    return result;
  } catch (error) {
    console.error('Error in sendWelcomeEmail function:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send meeting scheduled email when a new meeting is created
 */
const sendMeetingEmail = functions.firestore
  .document('meetings/{meetingId}')
  .onCreate(async (snapshot, context) => {
    try {
      const meetingData = snapshot.data();
      const { attendees, title, date, time, duration, location, meetingLink } = meetingData;

      // Format date for display
      const meetingDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate calendar link (simplified - in production use a library like ics)
      const calendarLink = `https://ftfc-start.web.app/calendar?meeting=${context.params.meetingId}`;

      // Send email to each attendee
      const emailPromises = attendees.map(async (attendee) => {
        if (!attendee.email) return null;

        return sendEmail(attendee.email, EMAIL_TYPES.MEETING_SCHEDULED, {
          meetingTitle: title,
          meetingDate,
          meetingTime: time,
          duration,
          location,
          meetingLink,
          calendarLink
        });
      });

      // Wait for all emails to be sent
      const results = await Promise.all(emailPromises.filter(Boolean));

      // Update meeting document with email sent status
      await snapshot.ref.update({
        emailsSent: true,
        emailsSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, results };
    } catch (error) {
      console.error('Error in sendMeetingEmail function:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Send document uploaded email when a new document is uploaded
 */
const sendDocumentEmail = functions.firestore
  .document('documents/{documentId}')
  .onCreate(async (snapshot, context) => {
    try {
      const documentData = snapshot.data();
      const { name, uploadedBy, ownerId, ownerType, ownerEmail } = documentData;

      // Skip if no owner email
      if (!ownerEmail) {
        console.log('No owner email found for document:', context.params.documentId);
        return { success: false, error: 'No owner email found' };
      }

      // Get uploader name
      let uploaderName = 'A team member';
      if (uploadedBy) {
        const uploaderDoc = await admin.firestore().collection('users').doc(uploadedBy).get();
        if (uploaderDoc.exists) {
          const uploaderData = uploaderDoc.data();
          uploaderName = uploaderData.displayName || uploaderData.name || uploaderName;
        }
      }

      // Generate document link
      const documentLink = `https://ftfc-start.web.app/${ownerType}/${ownerId}/documents`;

      // Format upload date
      const uploadDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Send email
      const result = await sendEmail(ownerEmail, EMAIL_TYPES.DOCUMENT_UPLOADED, {
        documentName: name,
        uploadedBy: uploaderName,
        uploadDate,
        documentLink
      });

      // Update document with email sent status
      if (result.success) {
        await snapshot.ref.update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return result;
    } catch (error) {
      console.error('Error in sendDocumentEmail function:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Send milestone completed email when a milestone is marked as completed
 */
const sendMilestoneEmail = functions.firestore
  .document('milestones/{milestoneId}')
  .onUpdate(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();

      // Only send email if milestone was just completed
      if (beforeData.completed === afterData.completed) {
        return { success: false, reason: 'Milestone completion status not changed' };
      }

      if (!afterData.completed) {
        return { success: false, reason: 'Milestone not completed' };
      }

      // Get client/investor/partner data
      const { ownerId, ownerType, ownerEmail, name } = afterData;

      if (!ownerEmail) {
        console.log('No owner email found for milestone:', context.params.milestoneId);
        return { success: false, error: 'No owner email found' };
      }

      // Get next milestone if any
      let nextMilestone = 'None';
      const milestonesSnapshot = await admin.firestore()
        .collection('milestones')
        .where('ownerId', '==', ownerId)
        .where('ownerType', '==', ownerType)
        .where('completed', '==', false)
        .orderBy('order', 'asc')
        .limit(1)
        .get();

      if (!milestonesSnapshot.empty) {
        nextMilestone = milestonesSnapshot.docs[0].data().name;
      }

      // Format completion date
      const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate portal link
      const portalLink = `https://ftfc-start.web.app/${ownerType}/${ownerId}`;

      // Send email
      const result = await sendEmail(ownerEmail, EMAIL_TYPES.MILESTONE_COMPLETED, {
        milestoneName: name,
        completionDate,
        nextMilestone,
        portalLink
      });

      // Update milestone with email sent status
      if (result.success) {
        await change.after.ref.update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return result;
    } catch (error) {
      console.error('Error in sendMilestoneEmail function:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Send lead notification email when a new lead is created
 */
const sendLeadNotificationEmail = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snapshot, context) => {
    try {
      const leadData = snapshot.data();
      const { name, company, email, phone, source, assignedTo } = leadData;

      // If no assigned team member, send to default admin
      let recipientEmail = functions.config().admin?.email;

      // If assigned to a team member, get their email
      if (assignedTo) {
        const assigneeDoc = await admin.firestore().collection('users').doc(assignedTo).get();
        if (assigneeDoc.exists) {
          const assigneeData = assigneeDoc.data();
          recipientEmail = assigneeData.email || recipientEmail;
        }
      }

      if (!recipientEmail) {
        console.log('No recipient email found for lead notification');
        return { success: false, error: 'No recipient email found' };
      }

      // Generate lead link
      const leadLink = `https://ftfc-start.web.app/dashboard/leads/${context.params.leadId}`;

      // Send email
      const result = await sendEmail(recipientEmail, EMAIL_TYPES.LEAD_NOTIFICATION, {
        leadName: name,
        company,
        email,
        phone,
        source,
        leadLink
      });

      // Update lead with email sent status
      if (result.success) {
        await snapshot.ref.update({
          notificationSent: true,
          notificationSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return result;
    } catch (error) {
      console.error('Error in sendLeadNotificationEmail function:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Send referral notification email when a new referral is created
 */
const sendReferralEmail = functions.firestore
  .document('referrals/{referralId}')
  .onCreate(async (snapshot, context) => {
    try {
      const referralData = snapshot.data();
      const { name, company, email, phone, referrerId, assignedTo } = referralData;

      // Get referrer data
      let referrerName = 'a partner';
      if (referrerId) {
        const referrerDoc = await admin.firestore().collection('partners').doc(referrerId).get();
        if (referrerDoc.exists) {
          const referrerData = referrerDoc.data();
          referrerName = referrerData.name || referrerData.companyName || referrerName;
        }
      }

      // If no assigned team member, send to default admin
      let recipientEmail = functions.config().admin?.email;

      // If assigned to a team member, get their email
      if (assignedTo) {
        const assigneeDoc = await admin.firestore().collection('users').doc(assignedTo).get();
        if (assigneeDoc.exists) {
          const assigneeData = assigneeDoc.data();
          recipientEmail = assigneeData.email || recipientEmail;
        }
      }

      if (!recipientEmail) {
        console.log('No recipient email found for referral notification');
        return { success: false, error: 'No recipient email found' };
      }

      // Generate referral link
      const referralLink = `https://ftfc-start.web.app/dashboard/referrals/${context.params.referralId}`;

      // Send email
      const result = await sendEmail(recipientEmail, EMAIL_TYPES.REFERRAL_RECEIVED, {
        referrerName,
        referralName: name,
        company,
        email,
        phone,
        referralLink
      });

      // Update referral with email sent status
      if (result.success) {
        await snapshot.ref.update({
          notificationSent: true,
          notificationSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return result;
    } catch (error) {
      console.error('Error in sendReferralEmail function:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Callable function to send a custom email
 */
const sendCustomEmail = onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to send emails'
    );
  }

  // Verify required data
  const { to, emailType, emailData } = data;

  if (!to || !emailType) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: to, emailType'
    );
  }

  try {
    // Send email
    const result = await sendEmail(to, emailType, emailData || {});

    if (!result.success) {
      throw new functions.https.HttpsError(
        'internal',
        `Failed to send email: ${result.error}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendCustomEmail function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

module.exports = {
  sendWelcomeEmail,
  sendMeetingEmail,
  sendDocumentEmail,
  sendMilestoneEmail,
  sendLeadNotificationEmail,
  sendReferralEmail,
  sendCustomEmail
};
