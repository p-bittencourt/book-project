using { db } from '../db/schema';

service BookRater {
    entity Books as projection on db.Books 
        excluding {
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy
        } 
        order by title asc;
    entity Authors as projection on db.Authors
        excluding {
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy
        }
        order by name asc;

    action rateBook(bookId: Books:ID, rating: db.Ratings: rating, comment: db.Ratings: comment);

}