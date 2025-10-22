using { db } from '../db/schema';

service BookRaterTrimmed {
    entity Books as projection on db.Books {
        ID,
        title,
        descr,
        averageRating,
        authors : redirected to AuthorsTrimmed,
        Ratings : redirected to RatingsTrimmed
    }

    entity AuthorsTrimmed as projection on db.Books.authors {
        @cds.api.ignore
        up_ : redirected to Books,

        @cds.api.ignore
        author : redirected to AuthorCore
    }

    entity RatingsTrimmed as projection on db.Books.Ratings {
        @cds.api.ignore
        up_ : redirected to Books,
        rating,
        comment
    }

    entity AuthorCore as projection on db.Authors {
        ID,
        name
    }
}