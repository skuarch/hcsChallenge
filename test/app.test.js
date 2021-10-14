import { getCsvData } from '../src/services/csv-service.js';
import { openDBConnection } from "../src/services/db-service.js";
import { createPatientsFromCsv, queryPatients, getPatientsWithConsent } from '../src/services/patients-service.js';
import { scheduleEmails, queryEmails } from '../src/services/emails-service.js';
import { PATIENTS_COLLECTION, EMAILS_COLLECTION } from '../src/model/constants.js';
import { getEnvironment } from '../src/env/index.js';


let mongo;
let env;
beforeAll(async () => {
    env = getEnvironment(process.argv[2]);
    mongo = await openDBConnection();
});


beforeEach(async () => {
    mongo.database.collection(PATIENTS_COLLECTION).remove();
    mongo.database.collection(EMAILS_COLLECTION).remove();
});


test('Verify the data in flat file matches the data in Patients collection', async () => {


    // given
    const csvPatients = await getCsvData(env.csvPathFile);
    await createPatientsFromCsv({ mongo, csvPatients });

    // when    
    const patients = await queryPatients(mongo, {});

    // then
    expect(csvPatients.length).toBe(patients.length);
    let counter = 0;
    for (const patient of patients) {
        expect(csvPatients[counter]['First Name']).toBe(patient['First Name']);
        expect(csvPatients[counter]['Email Address']).toBe(patient['Email Address']);
        expect(csvPatients[counter]['Data']).toBe(patient['Data']);
        counter++;
    }

});


test('Print out all Patient IDs where the first name is missing', async () => {

    // given
    const csvPatients = await getCsvData(env.csvPathFile);
    await createPatientsFromCsv({ mongo, csvPatients });

    // when        
    const patients = await queryPatients(mongo, { 'First Name': '' });

    // then
    console.log(patients);

});


test('Print out all Patient IDs where the email address is missing, but consent is Y', async () => {

    // given
    const csvPatients = await getCsvData(env.csvPathFile);
    await createPatientsFromCsv({ mongo, csvPatients });

    // when        
    const patients = await queryPatients(mongo, { $and: [{ 'First Name': '' }, { 'CONSENT': 'Y' }] });

    // then
    console.log(patients);

});


test('Verify Emails were created in Emails Collection for patients who have CONSENT as Y', async () => {

    // given    
    const csvPatients = await getCsvData(env.csvPathFile);
    await createPatientsFromCsv({ mongo, csvPatients });
    const patientsWithConsent = await getPatientsWithConsent(mongo);
    const patientsEmails = patientsWithConsent.map(patient => (patient['Email Address']));

    // when   
    await scheduleEmails({ mongo, patientsWithConsent });
    const emails = await queryEmails(mongo, { 'Email Address': { $in: patientsEmails } });

    // then
    expect(patientsEmails.length).toBe(emails.length);
    let counter = 0;
    for (const email of emails) {
        expect(email['Email Address']).toBe(patientsEmails[counter]);
        counter++;
    }
});


test('Verify emails for each patient are scheduled correctly', async () => {

    // given    
    const csvPatients = await getCsvData(env.csvPathFile);
    await createPatientsFromCsv({ mongo, csvPatients });
    const patientsWithConsent = await getPatientsWithConsent(mongo);
    const patientsEmails = patientsWithConsent.map(patient => (patient['Email Address']));

    // when        
    await scheduleEmails({ mongo, patientsWithConsent });
    const emails = await queryEmails(mongo, {});

    // then  
    let days = 'day';
    for (let i = 1; i <= patientsEmails.length; i++) {
        if (i > 1) {
            days = 'days';
        }
        const schedule = `NOW+${i} ${days}`;
        const email = emails.filter(email => (email.scheduled_date === schedule));
        expect(email[0]).toBeDefined();
    }
    expect(patientsEmails.length).toBe(emails.length);

});


afterAll(async () => {
    await mongo.connection.close();
});
