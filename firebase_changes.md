# Firebase Updates for Prompt Images

To support image uploads for Prompt Styles, the following changes apply to the Firebase project setup. No manual migration is needed for existing data, but you should be aware of the schema additions.

## 1. Firestore Data Model Update
The `prompts` collection has a new optional field `imageUrl`. 

**Document:** `/prompts/{promptId}`
**New Field:**
- `imageUrl`: string (URL of the image stored in Firebase Storage)

*Existing prompts that do not have this field will gracefully fallback to their current icon.*

## 2. Firebase Storage Usage
Images uploaded for prompt styles will now be saved in your Firebase Storage bucket.

**Storage Path:**
`prompts/{timestamp}_{filename}`

**Storage Rules:**
Make sure your Firebase Storage security rules allow the admin to upload files to this path. If your current rules restrict uploads to `users/{userId}/posters/`, you may need to update them to allow writes to `prompts/` for authenticated users or admins.

Example Storage Rule update:
```rules
match /b/{bucket}/o {
  match /prompts/{allPaths=**} {
    // Ideally check if user is admin, or at least authenticated
    allow read: if true;
    allow write: if request.auth != null; 
  }
}
```

## 3. `firestore.rules` (Optional)
If you want to keep your comments in `firestore.rules` up-to-date, you can add `imageUrl: string (optional)` to the Assumed Data Model block for the `prompts` collection.

*The app will automatically handle saving this new data. You do not need to manually delete or modify old records in the database.*
