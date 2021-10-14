import { getEnvironment } from "./src/env/index.js";
import { getCsvData } from './src/services/csv-service.js';
import { validateArguments, shutdownHook } from "./src/services/app-service.js";
import { createPatientsFromCsv, getPatientsWithConsent }  from './src/services/patients-service.js';
import { openDBConnection } from "./src/services/db-service.js";
import { scheduleEmails } from './src/services/emails-service.js';

console.log('App running to stop it press Control+C');

validateArguments();
const env = getEnvironment(process.argv[2]);
const mongo = await openDBConnection();
const csvPatients = await getCsvData(env.csvPathFile);
await createPatientsFromCsv({mongo, csvPatients});
const patientsWithConsent = await getPatientsWithConsent(mongo);
await scheduleEmails({ mongo, patientsWithConsent});
shutdownHook(mongo);

console.log('All process done!, press Control+C to stop the system');
