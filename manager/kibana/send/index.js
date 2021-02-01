const moment = require('moment');
const ruleKibana = require('./../rule');
const axios = require('axios');

module.exports = async (config, infoKibana, index) => {
	let id = null;
    
	try {
		const rules = await ruleKibana(infoKibana, index);
		id = rules.id;
		infoKibana = rules.infoKibana;

        if (!id) {
            return rules;
        }

        const url = `${config.baseUrl}/insert/${index}/_doc/${id}`;
        const insertedAtKibana = await axios.put(
            url,
            {
                headers: {
					'Authorization': config.authorization
				},
                body: infoKibana
            }
        );

		if (insertedAtKibana.statusCode.toString().slice(0, 1) != '2') {
			return {
				status: 'ALERT',
				name: 'Error while inserting data at Kibana',
                data: insertedAtKibana,
                source: 'Send-Kibana'
			}
		}

		return {
			status: 'SUCCESS',
			name: 'Inserted at Kibana',
            data: insertedAtKibana,
            source: 'Send-Kibana'
		}

	} catch (err) {
		return { 
			status: 'ERROR', 
			name: 'Error on interation', 
            data: err.stack || err.message || err,
            source: 'Send-Kibana' 
		}
	}
}