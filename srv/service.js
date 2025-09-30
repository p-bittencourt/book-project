const cds = require('@sap/cds')
const logger = cds.log('BookRaterService')

class BookRaterService extends cds.ApplicationService {

    async init() {
        const { Books } = this.entities;

        this.on('rateBook', Books, (req) => rateBook(req))

        /**
         * We should validate that the book exists
         * then, register the rating.
         * 
         * Book averageRating should reflect the change.
         * Should this be done on an after handler maybe?
         * 
         */
        async function rateBook(req) {
            logger('Params' + JSON.stringify(req.params))
            logger('Data' + JSON.stringify(req.data))
        }

        return super.init()
    }

}

module.exports = BookRaterService;