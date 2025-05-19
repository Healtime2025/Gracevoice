// GraceVoice Private Journal & Vault System

// Initialize Google Drive Integration
async function initializeGraceVoiceVault() {
  try {
    const response = await gapi.client.drive.files.list({
      q: "name='GraceVoice Vault' and mimeType='application/vnd.google-apps.folder'",
      spaces: 'drive'
    });

    if (response.result.files.length === 0) {
      const folder = await gapi.client.drive.files.create({
        resource: {
          name: 'GraceVoice Vault',
          mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id'
      });

      console.log('GraceVoice Vault created with ID:', folder.result.id);
      return folder.result.id;
    } else {
      console.log('GraceVoice Vault already exists.');
      return response.result.files[0].id;
    }
  } catch (error) {
    console.error('Error initializing GraceVoice Vault:', error);
    alert('Failed to initialize your private journal. Please try again.');
  }
}

// Function to save note to user’s Drive
async function saveNoteToVault(content, filename) {
  const vaultId = await initializeGraceVoiceVault();
  const fileMetadata = {
    name: filename,
    parents: [vaultId]
  };

  const media = {
    mimeType: 'text/plain',
    body: content
  };

  await gapi.client.drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }).then((file) => {
    console.log('Note saved to Vault:', file.result.id);
    alert('Note saved to your private Vault.');
  }).catch(error => {
    console.error('Error saving note:', error);
  });
}

// User Authorization Function
function authorizeGoogleDrive() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    initializeGraceVoiceVault();
  }).catch(error => {
    console.error('Authorization failed:', error);
    alert('Authorization failed. Please try again.');
  });
}

// Search and Edit Notes
async function searchAndEditNote(keyword) {
  const vaultId = await initializeGraceVoiceVault();
  const response = await gapi.client.drive.files.list({
    q: `'${vaultId}' in parents and name contains '${keyword}'`,
    spaces: 'drive'
  });

  if (response.result.files.length > 0) {
    response.result.files.forEach(file => {
      console.log(`Found: ${file.name}`);
    });
  } else {
    console.log('No matching notes found.');
    alert('No matching notes found.');
  }
}

// Share Notes Privately, with Friends, or Publicly
async function shareNoteWithGroup(noteId, visibility) {
  const permissions = {
    private: [],
    friends: [{ type: 'user', role: 'reader', emailAddress: 'friend@example.com' }],
    public: [{ type: 'anyone', role: 'reader' }]
  };

  await gapi.client.drive.permissions.create({
    fileId: noteId,
    resource: permissions[visibility]
  }).then(() => {
    console.log('Note shared successfully.');
    alert('Note shared successfully.');
  }).catch(error => {
    console.error('Error sharing note:', error);
  });
}
