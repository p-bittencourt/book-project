const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

const { extractRatingValues, calculateAverageRating } = require('./utils/utils')

class BookRaterService extends cds.ApplicationService {

    async init() {
        this.on(['CREATE', 'UPDATE'], 'Books', (req, next) => {
            // Handle ratings on POST Books payload
            const ratingsInput = req.query['INSERT'].entries[0].Ratings
            let averageRating = null
            if (ratingsInput && ratingsInput.length > 0) {
                const ratingValues = extractRatingValues(ratingsInput)
                if (ratingValues) {
                    averageRating = calculateAverageRating(ratingValues);
                }
            }
            req.query['INSERT'].entries[0].averageRating = averageRating;
            return next();
        })

        this.after(['CREATE', 'UPDATE'], 'Books.Ratings', async (_, req) => {
            await this.updateBookRating(req)
        })

        this.after(['CREATE', 'UPDATE'], 'RatingsTrimmed', async (_, req) => {
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