import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getUpdatedObj, getVolunteer } from "./helperFunctions";

export const createStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) =>
  await admin
    .firestore()
    .collection("studentsNames")
    .doc(snapshot.after.id)
    .set({
      firstName: snapshot.after.get("firstName"),
      lastName: snapshot.after.get("lastName"),
      group: snapshot.after.get("group"),
    });

export const createTestStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) =>
  await admin
    .firestore()
    .collection("testStudentsNames")
    .doc(snapshot.after.id)
    .set({
      firstName: snapshot.after.get("firstName"),
      lastName: snapshot.after.get("lastName"),
      group: snapshot.after.get("group"),
    });

export const updateStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  let template = {
    firstName: "",
    lastName: "",
    group: "",
  };
  const updatedStudent = getUpdatedObj(
    snapshot.before.data(),
    snapshot.after.data(),
    template
  );
  await admin
    .firestore()
    .collection("studentsNames")
    .doc(snapshot.before.id)
    .set(
      {
        ...updatedStudent,
      },
      { merge: true }
    );
};

export const updateTestStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  let template = {
    firstName: "",
    lastName: "",
    group: "",
  };
  const updatedStudent = getUpdatedObj(
    snapshot.before.data(),
    snapshot.after.data(),
    template
  );
  await admin
    .firestore()
    .collection("testStudentsNames")
    .doc(snapshot.before.id)
    .set(
      {
        ...updatedStudent,
      },
      { merge: true }
    );
};

export const deleteStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) =>
  await admin
    .firestore()
    .collection("studentsNames")
    .doc(snapshot.before.id)
    .delete();

export const deleteTestStudentNamesDoc = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) =>
  await admin
    .firestore()
    .collection("testStudentsNames")
    .doc(snapshot.before.id)
    .delete();

export const addVolunteer = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  functions.logger.log(
    "parent 0: " + JSON.stringify(await snapshot.after.get("parent0"))
  );
  functions.logger.log(
    "parent 1: " + JSON.stringify(await snapshot.after.get("parent1"))
  );
  functions.logger.log(
    "emergencyContact: " +
      JSON.stringify(await snapshot.after.get("emergencyContact"))
  );
  const [volunteerPerson, volunteerRole] = getVolunteer(
    await snapshot.after.get("parent0"),
    await snapshot.after.get("parent1"),
    await snapshot.after.get("emergencyContact")
  );
  functions.logger.log("volunteerRole: " + volunteerRole);
  if (volunteerPerson) {
    let volunteerID;
    await admin
      .firestore()
      .collection("volunteerRoles")
      .where("volunteerRole", "==", volunteerRole)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(
          (queryDocumentSnapshot) => (volunteerID = queryDocumentSnapshot.id)
        );
      })
      .catch(function (error) {
        functions.logger.log("Error getting documents: ", error);
      });
    console.log("volunteerID: " + volunteerID);
    return await admin
      .firestore()
      .collection("volunteerRoles")
      .doc(volunteerID)
      .set(
        {
          email: volunteerPerson.email,
          name: volunteerPerson.firstName + " " + volunteerPerson.lastName,
          phoneNumber: volunteerPerson.mobile,
        },
        { merge: true }
      );
  } else return null;
};

export const addAvailableVolunteer = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  functions.logger.log(
    "parent 0: " + JSON.stringify(await snapshot.after.get("parent0"))
  );
  functions.logger.log(
    "parent 1: " + JSON.stringify(await snapshot.after.get("parent1"))
  );
  functions.logger.log(
    "emergencyContact: " +
      JSON.stringify(await snapshot.after.get("emergencyContact"))
  );
  const [volunteerPerson, volunteerRole] = getVolunteer(
    await snapshot.after.get("parent0"),
    await snapshot.after.get("parent1"),
    await snapshot.after.get("emergencyContact")
  );
  functions.logger.log("volunteerRole: " + volunteerRole);
  if (volunteerPerson != null) {
    let volunteerID;
    await admin
      .firestore()
      .collection("volunteerRoles")
      .where("volunteerRole", "==", volunteerRole)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(
          (queryDocumentSnapshot) => (volunteerID = queryDocumentSnapshot.id)
        );
      })
      .catch(function (error) {
        functions.logger.log("Error getting documents: ", error);
      });
    console.log("volunteerID: " + volunteerID);
    return await admin
      .firestore()
      .collection("volunteerRoles")
      .doc(volunteerID)
      .set(
        {
          email: volunteerPerson.email,
          name: volunteerPerson.firstName + " " + volunteerPerson.lastName,
          phoneNumber: volunteerPerson.mobile,
        },
        { merge: true }
      );
  } else return null;
};
export const updateVolunteer = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  {
    const [volunteerPerson, volunteerRole] = getVolunteer(
      await snapshot.before.get("parent0"),
      await snapshot.before.get("parent1"),
      await snapshot.before.get("emergencyContact")
    );
    if (volunteerPerson != null) {
      //get volunteerID
      let volunteerID;
      await admin
        .firestore()
        .collection("volunteerRoles")
        .where("volunteerRole", "==", volunteerRole)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot) => (volunteerID = queryDocumentSnapshot.id)
          );
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

      const [updatedVolunteerPerson, updatedVolunteerRole] = getVolunteer(
        await snapshot.after.get("parent0"),
        await snapshot.after.get("parent1"),
        await snapshot.after.get("emergencyContact")
      );

      let updatedObj = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        receiveIncomingTextMessages: "",
      };
      //get updatedVolunteerID
      let updatedVolunteerID;

      //if the updated volunteer person still has a volunteer role
      if (updatedVolunteerPerson != null) {
        updatedObj = getUpdatedObj(volunteerPerson, updatedVolunteerPerson, {
          ...updatedObj,
        });

        //if the volunteerRole has changed, and it cannot be empty
        //as that has been prevented with the getVolunteer function
        if (updatedVolunteerRole != volunteerRole) {
          await admin
            .firestore()
            .collection("volunteerRoles")
            .where("volunteerRole", "==", updatedVolunteerRole)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach(
                (queryDocumentSnapshot) =>
                  (updatedVolunteerID = queryDocumentSnapshot.id)
              );
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        }
      } else {
        updatedVolunteerID = volunteerID;
      }

      //if the volunteer or parent has been removed then the default values will be passed
      return await admin
        .firestore()
        .collection("volunteerRoles")
        .doc(updatedVolunteerID)
        .set(
          {
            email: updatedObj.email,
            name: updatedObj.firstName + " " + updatedObj.lastName,
            phoneNumber: updatedObj.mobile,
          },
          { merge: true }
        );
    }
  }
  return null;
};
export const deleteVolunteer = async (
  snapshot: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const [volunteerPerson, volunteerRole] = getVolunteer(
    await snapshot.before.get("parent0"),
    await snapshot.before.get("parent1"),
    await snapshot.before.get("emergencyContact")
  );
  if (volunteerPerson != null) {
    let volunteerID;
    await admin
      .firestore()
      .collection("volunteerRoles")
      .where("volunteerRole", "==", volunteerRole)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(
          (queryDocumentSnapshot) => (volunteerID = queryDocumentSnapshot.id)
        );
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        volunteerID = 0;
      });

    await admin.firestore().collection("volunteerRoles").doc(volunteerID).set(
      {
        email: "",
        name: "",
        phoneNumber: "",
      },
      { merge: true }
    );
  }
  return null;
};

/* export const createStudentNamesDoc = functions.firestore
  .document("students/{userId}")
  .onCreate(
    async (snapshot, context) =>
      // Get an object representing the document
      
       //Add the created first name and last name of the new student
       //to studentNames collection
       
      await admin
        .firestore()
        .collection("studentsNames")
        .doc(snapshot.id)
        .set({
          firstName: snapshot.get("firstName"),
          lastName: snapshot.get("lastName"),
          group: snapshot.get("group"),
        })
  ); */

/* export const addVolunteer = functions.firestore
  .document("students/{userId}")
  .onCreate(async (snapshot, context) => {
    const [volunteerPerson, volunteerRole] = getVolunteer(
      await snapshot.get("parent0"),
      await snapshot.get("parent1"),
      await snapshot.get("emergencyContact")
    );
    if (volunteerPerson) {
      let volunteerID;
      await admin
        .firestore()
        .collection("volunteerRoles")
        .where("volunteerRole", "==", volunteerRole)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot) => (volunteerID = queryDocumentSnapshot.id)
          );
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
      return await admin
        .firestore()
        .collection("volunteerRoles")
        .doc(volunteerID)
        .set(
          {
            email: volunteerPerson.email,
            name: volunteerPerson.firstName + " " + volunteerPerson.lastName,
            phoneNumber: volunteerPerson.mobile,
          },
          { merge: true }
        );
    } else return null;
  }); */
