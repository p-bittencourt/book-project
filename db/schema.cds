namespace db;



using { cuid, managed, Country } from '@sap/cds/common';
aspect primary : cuid, managed {}

entity Books : primary {
    title : String;
    descr : String default 'Provide a book description';
    summary : LargeString default 'Provide a book summary';
    averageRating : Integer null;
    ratings : Association to many Ratings on ratings.book = $self;
    authors : Composition of many { key author: Association to Authors };
}

entity Authors : primary {
    name : String;
    country : Country;
    dateOfBirth : Date;
    dateOfDeath : Date;
    booksBy : Association to many Books.authors on booksBy.author = $self;
}

// Ratings should be from 1 - 5 only;
// This validation should be done on the service layer?
entity Ratings : primary {
    book : Association to Books;
    rating : Integer;
    // author : Association to ExternalBusinessPartner; 
}

