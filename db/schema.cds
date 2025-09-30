namespace db;

using {
    cuid,
    managed,
    Country
} from '@sap/cds/common';

aspect primary : cuid, managed {}

entity Books : primary {
    title         : String @mandatory;
    descr         : String default 'Short book description';
    averageRating : Integer null;
    ratings       : Association to many Ratings
                        on ratings.book = $self;

    /**
     * Managed Composition - https://cap.cloud.sap/docs/cds/cdl#for-many-to-many-relationships
     * This kind of composition allows for many to many relationships
     * 
     * However, being it a managed Composition, we don't have access to some managed features.
     * Cascade delete and @assert.target have to be manually implemented on the handlers.
     * 
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
    name        : String @mandatory;
    country     : Country;
    dateOfBirth : Date;
    dateOfDeath : Date;
    booksBy     : Association to many Books.authors
                      on booksBy.author = $self;
}

/**
 * Autoexpose exposes the entity whenever a parent
 * entity is exposed. However, the autoexposed entity is readonly.
 */

@cds.autoexpose entity Ratings : cuid {
    // How will these annotations work considering that Ratings will be added via Actions?
    // -> range and mandatory worked fine, but @assert.target didn't.
    book    : Association to Books @assert.target; 
    rating  : Integer @mandatory @assert.range: [1, 5];
    comment : String;
    // author : Association to ExternalBusinessPartner;
}
