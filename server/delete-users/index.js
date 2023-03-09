const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUsers = async (req, res) => {
  const usersRef = admin.firestore().collection("users");
  const snapshot = await usersRef.where("status", "==", "delete").get();

  if (snapshot.empty) {
    res.status(200).send(`No users to delete.`);
    return;
  }
  const batch = admin.firestore().batch();

  snapshot.forEach((doc) => {
    // Delete user authentication
    admin.auth().deleteUser(doc.id);

    // Delete user Firestore document
    batch.delete(doc.ref);
  });

  // Commit batched Firestore deletions
  await batch.commit();

  res.status(200).send(`Deleted users.`);
};
