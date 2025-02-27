// Add notification system for new leads
function setupNotifications() {
    db.collection('leads')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    showNotification('New Lead', 
                        `${change.doc.data().company} just submitted an intake form`);
                }
            });
        });
} 