const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

class BookRaterService extends cds.ApplicationService {

    async init() {
        const { Books } = this.entities;

        this.on('rateBook', Books, (req) => rateBook(req))

        /**
         * We should validate that the book exists then register the rating.
         *  
         * Book averageRating should reflect the change.
         * Should this be done on an after handler maybe?
         * 
         */
        async function rateBook(req) {
            const { ID }  = req.params[0];
            const { rating, comment } = req.data;

            /**
             * What's the try catch block to handle this:
             * 
             * {
                    "error": {
                        "message": "near \"\"$B\"\": syntax error in:\nSELECT json_insert('{}','$.\"ID\"',ID,'$.\"title\"',title,'$.\"descr\"',descr,'$.\"averageRating\"',averageRating) as _json_ FROM (SELECT \"$B\".ID,\"$B\".title,\"$B\".descr,\"$B\".averageRating FROM BookRater_Books as \"$B\" WHERE \"$B\".ID \"$B\".ID = ?)",
                        "code": "SQLITE_ERROR",
                        "@Common.numericSeverity": 4
                    }
                }
             */
            const book = await SELECT.one().from(Books).where({ID: ID})

            if (!book) {
                logger('Book not found')
            }

            logger(rating, comment)
        }

        return super.init()
    }

}

module.exports = BookRaterService;