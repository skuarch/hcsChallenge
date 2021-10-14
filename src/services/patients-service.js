import { PATIENTS_COLLECTION } from "../model/constants.js";

export const createPatientsFromCsv = async ({ mongo, csvPatients }) => {
  const patientsCollection = mongo.database.collection(PATIENTS_COLLECTION);
  await patientsCollection.insertMany(csvPatients)
    .catch(console.log);
}

export const queryPatients = async (mongo, query) => {
  const patientsCollection = mongo.database.collection(PATIENTS_COLLECTION);
  const patients = await patientsCollection.find(query).toArray();  
  return patients;
}

export const getPatientsWithConsent = async mongo => {  
  const patients = await queryPatients(mongo, { CONSENT: 'Y' });  
  return patients;
}
