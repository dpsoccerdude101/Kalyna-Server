import * as functions from "firebase-functions";

export const getUpdatedObj = (
  objBefore: FirebaseFirestore.DocumentData,
  objAfter: FirebaseFirestore.DocumentData,
  template
) => {
  let updatedObj = {
    ...template,
  };
  for (const prop in objBefore) {
    if (objAfter.hasOwnProperty(prop)) {
      if (objBefore[prop] != objAfter[prop]) {
        updatedObj = { ...updatedObj, [prop]: objAfter[prop] };
      }
    }
  }
  return updatedObj;
};

/**
 * Helper Function
 * @param parent0
 * @param parent1
 * @param emergencyContact
 */
export const getVolunteer = (parent0, parent1, emergencyContact) => {
  if (parent0.hasOwnProperty("volunteerRole")) {
    functions.logger.log(
      "returned parent 0 obj: " + [parent0, parent0["volunteerRole"]]
    );
    return [parent0, parent0["volunteerRole"]];
  } else if (emergencyContact.hasOwnProperty("volunteerRole")) {
    functions.logger.log(
      "returned emergencyCOntact obj: " +
        [emergencyContact, emergencyContact["volunteerRole"]]
    );
    return [emergencyContact, emergencyContact["volunteerRole"]];
  } else if (parent1) {
    if (parent1.hasOwnProperty("volunteerRole")) {
      return [parent1, parent1["volunteerRole"]];
    }
  } else return [null, null];
};

export function checkEventType(
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>
): string {
  const before: boolean = change.before.exists;
  const after: boolean = change.after.exists;

  if (before === false && after === true) {
    return "create";
  } else if (before === true && after === true) {
    return "update";
  } else if (before === true && after === false) {
    return "delete";
  } else {
    throw new Error(
      `Unkown firestore event! before: '${before}', after: '${after}'`
    );
  }
}
