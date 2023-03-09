const admin = require("firebase-admin");
const moment = require("moment");

admin.initializeApp();

exports.renewUserCredit = async (req, res) => {
  const usersRef = admin.firestore().collection("users");
  const snapshot = await usersRef.get();
  const updates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    let currentWeekOfMonth =
      moment().week() - moment().startOf("month").week() + 1;

    if (currentWeekOfMonth > 4) {
      currentWeekOfMonth = 4;
    }

    if (Number(data.signup_week) === currentWeekOfMonth) {
      updates.push(doc.ref.update({ video_credit: 15 }));
    }
  });

  await Promise.all(updates);

  res.status(200).send(`Updated ${updates.length} documents.`);
};
