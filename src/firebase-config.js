// Mock Firebase implementation for development

// Mock auth object
const auth = {
  currentUser: {
    uid: '1',
    email: 'john@example.com',
    displayName: 'John Doe'
  },
  onAuthStateChanged: (callback) => {
    callback(auth.currentUser);
    return () => {}; // Return unsubscribe function
  },
  signInWithEmailAndPassword: (email, password) => {
    return Promise.resolve({
      user: {
        uid: '1',
        email,
        displayName: 'John Doe'
      }
    });
  },
  signOut: () => Promise.resolve(),
  createUserWithEmailAndPassword: () => Promise.resolve()
};

// Mock firestore
const db = {
  collection: (name) => ({
    doc: (id) => ({
      get: () => Promise.resolve({
        exists: true,
        data: () => ({
          id,
          name: 'Mock Data',
          createdAt: new Date()
        }),
        id
      }),
      set: (data) => Promise.resolve(data),
      update: (data) => Promise.resolve(data),
      delete: () => Promise.resolve()
    }),
    add: (data) => Promise.resolve({ id: 'new-doc-id', ...data }),
    where: () => ({
      get: () => Promise.resolve({
        docs: [
          {
            id: '1',
            data: () => ({ name: 'Mock Data 1' }),
            exists: true
          },
          {
            id: '2',
            data: () => ({ name: 'Mock Data 2' }),
            exists: true
          }
        ]
      }),
      orderBy: () => ({
        limit: () => ({
          get: () => Promise.resolve({
            docs: [
              {
                id: '1',
                data: () => ({ name: 'Mock Data 1' }),
                exists: true
              }
            ]
          })
        })
      })
    })
  })
};

// Mock storage
const storage = {
  ref: (path) => ({
    put: (file) => ({
      on: (event, progressCallback, errorCallback, completeCallback) => {
        // Simulate upload completion
        setTimeout(() => {
          completeCallback();
        }, 1000);
      },
      then: (callback) => {
        callback({
          ref: {
            getDownloadURL: () => Promise.resolve(`https://example.com/${path}`)
          }
        });
        return { catch: () => {} };
      }
    }),
    delete: () => Promise.resolve()
  })
};

// Error handling function
const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  return 'An error occurred. Please try again.';
};

// Export mock services
export { db, auth, storage, handleFirebaseError };
