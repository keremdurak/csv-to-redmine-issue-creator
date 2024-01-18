//https://www.redmine.org/projects/redmine/wiki/Rest_Issues

const CSVParser = require('./csvParser');
const RedmineService = require('./redmineService');
const ErrorLogger = require('./errorLogger');
const RedmineIssue = require('./models/RedmineIssue');
const fs = require('fs');

async function main() {
    try {
        const csvFilePath = './files/import.csv';
        const errorFilePath = './files/error.csv';
        const redmineApiUrl = 'REDMINE-API-URL';
        const apiKey = 'REDMINE-API-KEY';

        const parsedData = await CSVParser.parseCSV(csvFilePath);

        const successfulIssues = [];
        const errorIssues = [];

        for (const data of parsedData) {
            try {
                const redmineIssue = new RedmineIssue(data);

                // RedmineService'ten türetilmiş sınıfı kullanarak issue oluştur
                const response = await RedmineService.createRedmineIssue(redmineIssue.getIssueData(), redmineApiUrl, apiKey);

                if (response.status === 422) {
                    console.error('Redmine API Hata:', response.data);
                }

                successfulIssues.push({ data, response: response.data });
            } catch (error) {
                errorIssues.push({ data, error: error.message });
            }
        }

        ErrorLogger.logErrors(errorIssues, errorFilePath);

        console.log('İşlem tamamlandı. Başarılı issue sayısı:', successfulIssues.length);
    } catch (error) {
        console.error('Bir hata oluştu:', error.message);
    }
}

main();



// const fs = require('fs');
// const csv = require('csv-parser');
// const axios = require('axios');
//
// const redmineUrl = 'YOUR_REDMINE_URL';
// const apiKey = 'YOUR_REDMINE_API_KEY';
//
// const errorRecords = [];
//
// function createRedmineIssue(issue) {
//     const url = `${redmineUrl}/issues.json?key=${apiKey}`;
//
//     return axios.post(url, { issue });
// }
//
// function writeToErrorCSV(record) {
//     errorRecords.push(record);
// }
//
// fs.createReadStream('./file.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//         const issue = {
//             project_id: row.project_id,
//             tracker_id: row.tracker_id,
//             subject: row.subject,
//             description: row.description,
//             // Diğer gerekli alanları ekleyin
//         };
//
//         createRedmineIssue({ issue })
//             .then((response) => {
//                 console.log(`Issue created successfully. ID: ${response.data.issue.id}`);
//             })
//             .catch((error) => {
//                 console.error('Error creating issue:', error.response.data.errors);
//                 writeToErrorCSV(row);
//             });
//     })
//     .on('end', () => {
//         console.log('CSV file processing complete.');
//
//         if (errorRecords.length > 0) {
//             const errorCsvFilePath = './error.csv';
//             const errorCsvStream = fs.createWriteStream(errorCsvFilePath, { flags: 'a' });
//
//             errorCsvStream.write('project_id,tracker_id,subject,description\n');
//             errorRecords.forEach((record) => {
//                 errorCsvStream.write(`${record.project_id},${record.tracker_id},${record.subject},${record.description}\n`);
//             });
//
//             errorCsvStream.end();
//
//             console.log(`Error records written to ${errorCsvFilePath}`);
//         }
//     });
