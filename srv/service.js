const cds = require('@sap/cds');
const { SELECT, UPDATE, CREATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

class BookRaterService extends cds.ApplicationService {

    async init() {
        this.on(['CREATE', 'UPDATE'], 'Books', (req, next) => {
            logger(req);
            return next();
        })

        this.on(['CREATE', 'UPDATE'], 'Books.Ratings', (req, next) => {
            logger(req);
            return next();
        })

        return super.init()
    }

}

module.exports = BookRaterService;