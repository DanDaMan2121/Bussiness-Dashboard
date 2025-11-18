// Import the functions you need from the SDKs you need
    import { getDatabase, ref, set, remove, onValue, child, get, update} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
    //   import { }
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCkINLqzwllGDnEYTjK3TA4STSgwgs438c",
        authDomain: "piddz-5de75.firebaseapp.com",
        databaseURL: "https://piddz-5de75-default-rtdb.firebaseio.com",
        projectId: "piddz-5de75",
        storageBucket: "piddz-5de75.firebasestorage.app",
        messagingSenderId: "1006827305493",
        appId: "1:1006827305493:web:064d16ab5f5bb80e16ec1c",
        measurementId: "G-9YM8L6TS3X"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    // Initialize the FirebaseUI Widget using Firebase.
    // var ui = new firebaseui.auth.AuthUI(firebase.auth());

    //   ui.start('#firebaseui-auth-container', {
    //   signInOptions: [
    //     firebase.auth.EmailAuthProvider.PROVIDER_ID
    //   ],
    //   // Other config options...
    // });


export async function writeUserData(parentId, childId) {
  console.log('write ran');
  console.log(`parentId: ${parentId}, childId: ${childId}`);
  const db = getDatabase();
  await set(ref(db, parentId + '/' + childId), '')
  .then(() => {
    console.log('data set successfully');
    return true;
  })
  .catch ((error) => {
    console.error(`Error setting node: ${error}`);
    return false;
  });
}


export async function removeUserData(parentId, userId) {
  console.log('remove ran');
  console.log(`parentId: ${parentId}, userId: ${userId}`);
  const db = getDatabase();
  await remove(ref(db, parentId + '/' + userId))
  .then(() => {
    console.log('data removed successfully');
  })
  .catch( (error) => {
    console.error(`Error setting node: ${error}`);
    return false
  });

}

export async function readUserData(parentId, childId) { // a single snapshot of the data
  const dbRef = ref(getDatabase());
  let data = '';
  await get(child(dbRef, parentId + '/' + childId)).then((snapshot) => {
    if (snapshot.exists()){
      data = snapshot.val();
    } else {
      console.log('No data available');
    }
  }).catch((error) => {
    console.error(error);
    // return false;
  });
  // console.log(myMenuItems);
  return data;
}

export async function updateUserData(parentPath, child, val) {
    const db = getDatabase();
    const parentData = await readUserData(parentPath, '');
    console.log(parentData[child]);
    parentData[child] = val;
    await update(ref(db, parentPath + '/'), parentData)
    .then(() => {
        console.log('data updated successfully');
    })
    .catch((error) => {
        console.error(error);
    });
}