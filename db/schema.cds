namespace db;

using {
    cuid,
    managed,
    Country
} from '@sap/cds/common';

aspect primary : cuid, managed {}

entity Books : primary {
    title         : String;
    descr         : String default 'Short book description';
    averageRating : Integer null;
    ratings       : Association to many Ratings
                        on ratings.book = $self;

    /**
     * Managed Composition - https://cap.cloud.sap/docs/cds/cdl#for-many-to-many-relationships
     * This kind of composition allows for many to many relationships
     * 
     * However, being it a managed Composition, we don't have access to cascade delete
     * So, when deleting an Author, the Books they're assigned to may end up with an author_id reference
     * that does not exist on the db anymore.
     * 
     * We would have to implement a handler for the DELETE operation to ensure books don't reference
     * an unexisting ID.
     */                    
    authors       : Composition of many {
                        key author : Association to Authors
                    };
}

entity Authors : primary {
    name        : String;
    country     : Country;
    dateOfBirth : Date;
    dateOfDeath : Date;
    booksBy     : Association to many Books.authors
                      on booksBy.author = $self;
}

// Ratings should be from 1 - 5 only;
// This validation should be done on the service layer?

/**
 * Autoexpose exposes the entity whenever a parent
 * entity is exposed. However, the autoexposed entity is readonly.
 */
@cds.autoexpose entity Ratings : cuid {
    book    : Association to Books;
    rating  : Integer;
    comment : String;
    // author : Association to ExternalBusinessPartner;
}
