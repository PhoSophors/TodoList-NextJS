## How to run this project ?

step 1: Clone Project
``` dash
git clone https://github.com/PhoSophors/TodoList-NextJS.git
```

step 2: Setup environment (copy config.env rename to .env) and here is example .env
``` dash
REACT_APP_FIREBASE_API_KEY=your api key
REACT_APP_FIREBASE_AUTH_DOMAIN= you auth domain
REACT_APP_FIREBASE_PROJECT_ID=your project id
REACT_APP_FIREBASE_STORAGE_BUCKET=your storage bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your messaging sender id
REACT_APP_FIREBASE_APP_ID=web:your app id
REACT_APP_FIREBASE_MEASUREMENT_ID= your measurement id
```

step 3: Update Cloud Firestore Roles
``` dash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

step 4: Install dependency 
``` dash
npm install
```

step 5: Run Project 
``` dash
npm run dev
```

step 6: Click on http://localhost:3000 on interminal or open  http://localhost:3000 in browser 
```dash
 http://localhost:3000
```

copyright: PHO SOHPORS - 12 July 2024
