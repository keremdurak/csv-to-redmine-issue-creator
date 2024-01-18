const fs = require('fs');

class ErrorLogger {
    static logErrors(errors, filePath) {
        if (errors.length > 0) {
            const errorCSV = errors.map(({ data, error }) => `${JSON.stringify(data)},${error}`).join('\n');
            fs.writeFileSync(filePath, errorCSV);
            console.log(`Hatalar ${filePath} dosyasına kaydedildi.`);
        }
    }
}

module.exports = ErrorLogger;