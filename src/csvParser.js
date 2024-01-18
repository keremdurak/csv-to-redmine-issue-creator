const fs = require('fs');
const csv = require('csv-parser');

class CSVParser {
    static async parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            // Dosya var mı kontrol et
            if (!fs.existsSync(filePath)) {
                return reject(new Error(`Dosya bulunamadı: ${filePath}`));
            }
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }
}

module.exports = CSVParser;
