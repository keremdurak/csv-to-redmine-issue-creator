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
                // .on('data', (data) => results.push(data))
                .on('data', (row) => {
                    const customFields = [];

                    // Dinamik olarak custom fields ekleniyor
                    for (let i = 0; i < Object.keys(row).length; i++) {
                        if (Object.keys(row)[i].startsWith('custom_fields.')) {
                            const fieldNumber = parseInt(Object.keys(row)[i].split('.')[1]);
                            const existingFieldIndex = customFields.findIndex(field => field.id === parseInt(row[`custom_fields.${fieldNumber}.id`]));

                            if (existingFieldIndex === -1) {
                                customFields.push({
                                    "id": parseInt(row[`custom_fields.${fieldNumber}.id`]),
                                    "value": row[`custom_fields.${fieldNumber}.value`]
                                });
                            }
                        }
                    }

                    const jsonRow = {
                        "project_id": parseInt(row.project_id),
                        "status_id": parseInt(row.status_id),
                        "tracker_id": parseInt(row.tracker_id),
                        "priority_id": parseInt(row.priority_id),
                        "subject": row.subject,
                        "description": row.description,
                        "custom_fields": customFields
                    };
                    results.push(jsonRow);
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }
}

module.exports = CSVParser;
