const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

const { extractRatingValues, calculateAverageRating } = require('./utils/utils')

class BookRaterService extends cds.ApplicationService {

    async init() {

        this.before(['CREATE'], ['Books.Ratings', 'RatingsTrimmed'], async (req) => {
            logger(req)
        })

        this.on(['CREATE', 'UPDATE'], 'Books', (req, next) => {
            // Handle ratings on POST Books payload
            const ratingsObject = req.data.Ratings
            let averageRating = null
            if (ratingsObject && ratingsObject.length > 0) {
                const ratingValues = extractRatingValues(ratingsObject)
                if (ratingValues) {
                    averageRating = calculateAverageRating(ratingValues);
                }
            }
            req.data.averageRating = averageRating;
            return next();
        })

        this.after(['CREATE', 'UPDATE'], ['Books.Ratings', 'RatingsTrimmed'], async (_, req) => {
            await this.updateBookRating(req)
        })

        return super.init()
    }

    async updateBookRating(req) {
        const bookId = req.params[0]
        const book = await SELECT.from('Books', bookId, b => {
            b('Ratings'),
                b.Ratings(r => r('rating'))
        })
        const ratingValues = extractRatingValues(book.Ratings)
        const averageRating = calculateAverageRating(ratingValues)

        await UPDATE('Books', bookId).data({ averageRating })
    }

}

module.exports = BookRaterService;