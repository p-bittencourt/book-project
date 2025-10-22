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
        up_ : redirected to Books,
        author : redirected to AuthorCore
    }

    entity RatingsTrimmed as projection on db.Books.Ratings {
        up_ : redirected to Books,
        rating,
        comment
    }

    entity AuthorCore as projection on db.Authors {
        ID,
        name,
        @cds.api.ignore booksBy
    }
}