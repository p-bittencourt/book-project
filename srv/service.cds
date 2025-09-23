using { db } from '../db/schema';

service BookRater {
    entity Books as projection on db.Books;
    entity Authors as projection on db.Authors;
    entity Ratings as projection on db.Ratings; 
}