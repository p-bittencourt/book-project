const cds = require('@sap/cds');
const { SELECT, UPDATE, CREATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('BookRaterService')

class BookRaterService extends cds.ApplicationService {

    async init() {
        this.on(['CREATE', 'UPDATE'], 'Books', (req, next) => {
            const ratingsInput = req.query['INSERT'].entries[0].Ratings
            let averageRating = null
            if (ratingsInput && ratingsInput.length > 0) {
                const ratingValues = this.extractRatingValues(ratingsInput)
                if (ratingValues) {
                    averageRating = this.calculateAverageRating(ratingValues);
                }
            }
            req.query['INSERT'].entries[0].averageRating = averageRating;
            return next();
        })

        this.after(['CREATE', 'UPDATE'], 'Books.Ratings', async (_, req) => {
            const book = await SELECT.from('Books', req.params[0], b => {
                b('Ratings'),
                b.Ratings(r => r('rating'))
            })
            const ratingValues = this.extractRatingValues(book.Ratings)
            const averageRating = this.calculateAverageRating(ratingValues)
            logger(averageRating)
        })

        return super.init()
    }

    extractRatingValues(ratings) {
        return ratings.map(ratingValue => ratingValue.rating)
    }

    calculateAverageRating(ratings) {
        return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : undefined;
    }

}

module.exports = BookRaterService;