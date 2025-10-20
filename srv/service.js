const cds = require('@sap/cds');
const { SELECT, UPDATE, CREATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

class BookRaterService extends cds.ApplicationService {

    async init() {
        const { Books, Ratings } = this.entities;

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

            
            const rating_id = 213142 

            const ratingObject = {
                ID: rating_id,
                book_id: ID, // provide trimmed book id?
                rating,
                comment
            };

            // const persistedRating = await INSERT(ratingObject).into(Ratings)
            // const persistedRating = await CREATE.entity(Ratings, ratingObject);

            const insert = await INSERT.into(Ratings, ratingObject);
            const obj_id = insert.results[0].lastInsertRowid
            const persistedRating = await SELECT(Ratings, obj_id);

            logger(persistedRating);
        }

        return super.init()
    }

}

module.exports = BookRaterService;