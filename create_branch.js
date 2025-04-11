const { execFileSync } = require('child_process');

try {
  console.log('Adding all changes...');
  execFileSync('git', ['add', '.']);

  console.log('Committing changes...');
  execFileSync('git', ['commit', '-m', 'Fix ClientPortal component']);

  console.log('Creating new branch...');
  execFileSync('git', ['checkout', '-b', 'FTFC-3.3-Integrations']);

  console.log('Successfully created new branch: FTFC-3.3-Integrations');
} catch (error) {
  console.error('Error:', error.message);
}
