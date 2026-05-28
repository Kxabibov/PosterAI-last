# Manual Action Guide: Updating Firebase Rules & Deleting Duplicates

Follow these simple, step-by-step instructions to update your Firestore rules and delete the duplicate prompts from your dashboard.

---

## Phase 1: Update Firestore Rules in Firebase Console

Since the local Firebase CLI is not authenticated, you need to copy and paste the updated rules directly into the Firebase Console:

1. **Open Firebase Console**:
   - Navigate to [https://console.firebase.google.com/](https://console.firebase.google.com/) in your web browser.
   - Select your project: **`gen-lang-client-0995405102`** (or the one named `ai-studio...`).

2. **Navigate to Firestore Rules**:
   - In the left sidebar, click on **Build** -> **Firestore Database**.
   - Click on the **Rules** tab at the top of the Firestore Database panel.

3. **Replace Rules Code**:
   - Copy the entire code block below:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true ||
         (request.auth.token.email == "habibovkomron007@gmail.com" && request.auth.token.email_verified == true));
    }

    function isValidUser(data) {
      return data.keys().hasAll(['email', 'credits', 'isAdmin']) &&
             data.email is string && data.email.size() < 255 &&
             data.credits is number && data.credits >= 0 &&
             data.isAdmin is bool &&
             (!('name' in data) || (data.name is string && data.name.size() < 100));
    }

    function isValidPrompt(data) {
      return data.keys().hasAll(['name', 'promptText']) &&
             data.name is string && data.name.size() > 0 && data.name.size() < 100 &&
             data.promptText is string && data.promptText.size() > 0 && data.promptText.size() < 5000;
    }

    // Collection Mappings
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isValidUser(request.resource.data) && 
                    (
                      (isOwner(userId) && request.resource.data.isAdmin == false && request.resource.data.credits <= 15) || 
                      isAdmin()
                    );
      allow update: if isAuthenticated() && isValidUser(request.resource.data) &&
                    (
                      (isOwner(userId) && 
                       request.resource.data.credits <= resource.data.credits && 
                       request.resource.data.isAdmin == resource.data.isAdmin) ||
                      isAdmin()
                    );
    }

    match /prompts/{promptId} {
      allow read: if isAuthenticated();
      allow create, update: if isAdmin() && isValidPrompt(request.resource.data);
      allow delete: if isAdmin();
    }

    match /posters/{posterId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isOwner(request.resource.data.userId);
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

   - Select all text in the rules editor on the Firebase Console page, delete it, and paste the code block you just copied.
   - Click the blue **Publish** button at the top right of the editor.

---

## Phase 2: Delete Duplicate Prompts in Admin Dashboard

Once the rules are updated, deleting documents is fully authorized for admins. You can clean up the duplicates directly from the UI:

1. **Open the Website**:
   - Go to your website: `http://localhost:3000/admin` (or your live site URL).
   - Sign in with your administrator account (`habibovkomron007@gmail.com`).

2. **Navigate to Prompts Management**:
   - Click on the **Prompt Library** tab (or **Solo Prompts** tab) in the administrator panel.

3. **Delete Duplicate Items**:
   - Locate the duplicate cards that are displaying default icons (e.g. `✦` or `◻`).
   - Click the red **Trash/Delete** button next to each duplicate card.
   - The duplicate cards will be immediately removed from your database and UI.
