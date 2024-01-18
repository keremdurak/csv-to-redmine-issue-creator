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
