const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

const db = admin.firestore();

exports.processGeminiNotes = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
  // Get all team members
  const usersSnapshot = await db.collection('users')
    .where('role', '==', 'team_member')
    .where('googleDriveEnabled', '==', true)
    .get();

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    
    try {
      // Initialize processor
      const processor = new GeminiNotesProcessor();
      
      // Scan for new notes
      const notes = await processor.scanForGeminiNotes(userData.email, userData.tokens);
      
      for (const note of notes) {
        // Check if we've already processed this note
        const processedDoc = await db.collection('processedNotes')
          .where('fileId', '==', note.id)
          .get();

        if (!processedDoc.empty) continue;

        // Extract participants
        const participants = await processor.extractParticipants(note.id, userData.tokens);
        
        // Determine entity
        const entity = await processor.determineEntity(participants);
        
        if (entity) {
          // Update entity portal
          await updateEntityPortal(entity.type, entity.id, note);
          
          // Create meeting record if it doesn't exist
          await createOrUpdateMeetingRecord(entity, note, participants);
          
          // Mark note as processed
          await db.collection('processedNotes').add({
            fileId: note.id,
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            entityType: entity.type,
            entityId: entity.id
          });
        }
      }
    } catch (error) {
      console.error(`Error processing notes for user ${userData.email}:`, error);
    }
  }
});

async function updateEntityPortal(entityType, entityId, note) {
  const portalRef = db.collection(`${entityType}s`).doc(entityId);
  
  await portalRef.update({
    [`meetings.${note.id}`]: {
      title: note.name,
      date: note.createdTime,
      notesLink: note.webViewLink,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  });
}

async function createOrUpdateMeetingRecord(entity, note, participants) {
  const meetingRef = db.collection('meetings').doc(note.id);
  
  await meetingRef.set({
    title: note.name,
    date: note.createdTime,
    participants,
    entityType: entity.type,
    entityId: entity.id,
    notesLink: note.webViewLink,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}