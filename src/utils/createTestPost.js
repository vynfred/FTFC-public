import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

export const createTestPost = async () => {
  try {
    const blogRef = collection(db, 'blog');
    await addDoc(blogRef, {
      title: "How to Successfully Raise Your First Round",
      slug: "how-to-successfully-raise-first-round",
      description: "A comprehensive guide for first-time founders on raising their initial funding round.",
      content: `<h2>Understanding the Fundraising Landscape</h2>
                <p>Raising your first round can be challenging, but with the right preparation and strategy, you can increase your chances of success.</p>
                <h3>Key Steps to Success:</h3>
                <ul>
                  <li>Perfect your pitch deck</li>
                  <li>Build a strong network</li>
                  <li>Know your numbers</li>
                  <li>Understand investor expectations</li>
                </ul>`,
      author: "Michael Smith",
      category: "Fundraising",
      tags: ["startup", "fundraising", "venture capital"],
      createdAt: serverTimestamp(),
      mainImage: "https://firebasestorage.googleapis.com/v0/b/ftfc-start.firebasestorage.app/o/blog%2Ffundraising.jpg?alt=media",
      mainImageAlt: "Startup fundraising meeting"
    });
    console.log('Test blog post created successfully');
  } catch (error) {
    console.error('Error creating test post:', error);
  }
}; 