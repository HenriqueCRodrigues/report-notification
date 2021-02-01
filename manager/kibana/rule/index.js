const moment = require('moment');

module.exports = async (infoKibana, index) => {
	let id = null;

	switch (true) {
		case (index.includes('update-products')):
			if (!infoKibana.productId) {
				return {
					status: 'ALERT',
					name: 'infoKibana productId Null',
					data: infoKibana,
					source: 'Rule - Kibana'
				}
			}

			id = `${infoKibana.productId}-${moment().toISOString()}`;
			infoKibana.sendDate = moment().toISOString();
		break;

		case (index.includes('create-suggestion')):
			if (!infoKibana.skuRefId) {
				return {
					status: 'ALERT',
					name: 'infoKibana skuRefId Null',
					data: infoKibana,
					source: 'Rule - Kibana'
				}
			}

			id = `${infoKibana.skuRefId}-${moment().toISOString()}`;
			infoKibana.sendDate = moment().toISOString();
		break;

		default:
			return {
				status: 'ALERT',
				name: 'Index not Found',
				data: infoKibana,
				source: 'Rule - Kibana'
			}
		break;
	}

	return {infoKibana, id};
};