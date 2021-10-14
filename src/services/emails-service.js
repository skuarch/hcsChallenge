import { EMAILS_COLLECTION } from "../model/constants.js";

export const scheduleEmails = async ({mongo, patientsWithConsent}) => { 
    let emails = [];
    let counter = 1;
    let days = 'day';
    for await (const patient of patientsWithConsent) {
        if (counter > 1) {
          days = 'days';
        }
        emails.push({Name: `Day ${counter}`, scheduled_date: `NOW+${counter} ${days}`, 'Email Address': patient['Email Address']});
        counter++;
    }

    const emailsCollection = mongo.database.collection(EMAILS_COLLECTION);
    await emailsCollection.insertMany(emails);
}

export const queryEmails = async (mongo, query) => {
    const emailsCollection = mongo.database.collection(EMAILS_COLLECTION);
    const emails = await emailsCollection.find(query).toArray();  
    return emails;
  }