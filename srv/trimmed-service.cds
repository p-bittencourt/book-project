using { db } from '../db/schema';

@impl: './service.js'
service BookRaterTrimmed {
    @readonly
    entity Books as projection on db.Books {
        ID,
        title,
        descr,
        averageRating,
        authors : redirected to AuthorsTrimmed,
        Ratings : redirected to RatingsTrimmed
    }

    @readonly
    entity AuthorsTrimmed as projection on db.Books.authors {
        @cds.api.ignore
        up_ : redirected to Books,

        @cds.api.ignore
        author : redirected to AuthorCore
    }

    entity RatingsTrimmed as projection on db.Books.Ratings {
        up_ : redirected to Books,
        pos,
        rating,
        comment
    }

    entity AuthorCore as projection on db.Authors {
        ID,
        name
    }
}