const kibana = require('./kibana');

class Manager {
    /*
        {
            kibana: {
                ruleStatusNotification: 'ALL || SUCCESS || ERROR',
                ruleStatusIndex: 'true || false',
                credentials: {
                    type: 'Basic || Oauth || apiKey',
                    user || password...
                }
            }
        }

    */

    async sendReportNotification(config, dataNotification, index) {
        const kibanaSend = await this.kibanaSend(config.kibana, dataNotification, index);

        return {
            kibanaSend
        }
    }

    async kibanaSend(kibanaConfig, dataNotification, index) {
        if (kibanaConfig) {
            kibanaConfig.authorization = await this.setCredentials(kibanaConfig);

            const status = this.checkStatusInDataNotification(kibanaConfig.ruleStatusNotification, dataNotification); 
            if (status) {
                index = await this.setIndex(kibanaConfig, status, index);
                await kibana.send(kibanaConfig, dataNotification, index);
            }
        }
    }

    async checkStatusInDataNotification(ruleStatusNotification, dataNotification) {
        let response = false;

        if (ruleStatusNotification == 'ALL') {
            response = ruleStatusNotification;
        } else if (ruleStatusNotification == dataNotification.status) {
            response = ruleStatusNotification;
        }

        return response;
    }

    async setIndex(config, status, index) {
        index = `${config.subscriber.name}-${index}`;
        if (config.ruleStatusIndex) {
            index = `${index}-${status}`;
        }

        return index;
    }

    async setCredentials(config) {
        if (config.credentials) {
            switch (config.credentials.type) {
                case 'Basic':
                    return `Basic ${new Buffer(`${config.credentials.user}:${config.credentials.password}`).toString("base64")}`;
                break;
            }
        }
    }
}

module.exports = Manager;