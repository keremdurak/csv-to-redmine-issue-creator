const axios = require('axios');
const https = require('https');

class RedmineService {
    static async createRedmineIssue(issueData, redmineApiUrl, apiKey) {
        return axios.post(`${redmineApiUrl}/issues.json`, {issue: issueData}, {
            headers: {
                'Content-Type': 'application/json',
                'X-Redmine-API-Key': apiKey,
            },
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
        });
    }
}

module.exports = RedmineService;
