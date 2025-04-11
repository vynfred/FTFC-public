/**
 * Script to add a test client to the Firestore database
 *
 * This script creates a test client with proper source tracking,
 * matching the structure used in the intake forms and lead processing service.
 */

const admin = require('firebase-admin');
const getServiceAccountConfig = require('../src/config/serviceAccountConfig');

// Get service account configuration from environment variables
const serviceAccount = getServiceAccountConfig();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Create a test client
async function createTestClient() {
  try {
    // First create a contact
    const contactRef = await db.collection('contacts').add({
      firstName: 'Vynfred',
      lastName: 'Virst',
      email: 'hellovynfred@gmail.com',
      phone: '555-123-4567',
      title: 'CEO',
      bio: 'Test client for Gemini notes integration',
      keywords: ['test', 'client'],
      keyTerms: [],
      notes: 'This is a test client for Gemini notes integration',
      isPrimary: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'manual_team_entry',
      associations: {
        companies: [],
        investmentFirms: [],
        partnerFirms: []
      }
    });

    console.log(`Created contact with ID: ${contactRef.id}`);

    // Create a company
    const companyRef = await db.collection('companies').add({
      name: 'Vynfred Test Company',
      website: 'https://example.com',
      industry: ['Technology'],
      description: 'Test company for Gemini notes integration',
      logo: '',
      stage: 'Seed',
      foundedYear: 2023,
      teamSize: 5,
      revenueStatus: 'Pre-revenue',
      currentARR: 0,
      capitalRaised: 0,
      targetRaise: 1000000,
      timeline: 'Q3 2023',
      status: 'Active',
      source: 'manual_team_entry', // Track the source of the company
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'wilfred@ftfc.co', // Team member who created the company
      contacts: [{
        contactId: contactRef.id,
        isPrimary: true
      }]
    });

    console.log(`Created company with ID: ${companyRef.id}`);

    // Update the contact with the company association
    await db.collection('contacts').doc(contactRef.id).update({
      'associations.companies': [{
        companyId: companyRef.id,
        role: 'CEO',
        isPrimary: true
      }]
    });

    // Create a lead record first (to match the normal flow)
    const leadRef = await db.collection('leads').add({
      companyId: companyRef.id,
      primaryContactId: contactRef.id,
      source: 'manual_team_entry',
      status: 'Converted',
      stage: 'Client',
      assignedTo: 'wilfred@ftfc.co',
      notes: 'Test client for Gemini notes integration',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp(),
      referralSource: 'team_member',
      referrerId: 'wilfred@ftfc.co',
      conversionDate: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Created lead with ID: ${leadRef.id}`);

    // Create a client (which is essentially a company in the clients collection)
    const clientRef = await db.collection('clients').add({
      companyId: companyRef.id,
      contactId: contactRef.id,
      leadId: leadRef.id, // Reference to the original lead
      status: 'Active',
      source: 'manual_team_entry', // Track the source of the client
      referralSource: 'team_member', // Track the referral source
      referrerId: 'wilfred@ftfc.co', // Track the referrer
      owner: 'wilfred@ftfc.co', // FTFC team member who owns this relationship
      goals: [
        {
          title: 'Secure Seed Funding',
          description: 'Raise $1M in seed funding to accelerate product development',
          targetDate: 'Q3 2023'
        }
      ],
      milestones: [
        {
          title: 'Initial Consultation',
          completed: true,
          date: new Date().toISOString()
        },
        {
          title: 'Business Plan Review',
          completed: false
        }
      ],
      documents: [],
      transcripts: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'wilfred@ftfc.co'
    });

    console.log(`Created client with ID: ${clientRef.id}`);

    // Update the lead to mark it as converted
    await db.collection('leads').doc(leadRef.id).update({
      status: 'Converted',
      stage: 'Client',
      clientId: clientRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create activity logs
    await db.collection('activity').add({
      type: 'lead',
      action: 'created',
      leadId: leadRef.id,
      companyName: 'Vynfred Test Company',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: 'New lead created manually: Vynfred Test Company'
    });

    await db.collection('activity').add({
      type: 'lead',
      action: 'converted',
      leadId: leadRef.id,
      clientId: clientRef.id,
      companyName: 'Vynfred Test Company',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: 'Lead converted to client: Vynfred Test Company'
    });

    await db.collection('activity').add({
      type: 'client',
      action: 'created',
      clientId: clientRef.id,
      companyName: 'Vynfred Test Company',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: 'New client created: Vynfred Test Company'
    });

    // Create a user account for the client
    const userRef = await db.collection('users').add({
      email: 'hellovynfred@gmail.com',
      displayName: 'Vynfred Virst',
      role: 'client',
      clientId: clientRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Created user with ID: ${userRef.id}`);
    console.log('All done! Test client created successfully.');

  } catch (error) {
    console.error('Error creating test client:', error);
  } finally {
    // Exit the process
    process.exit();
  }
}

// Run the function
createTestClient();
