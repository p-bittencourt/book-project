namespace db;

using {
    cuid,
    managed,
    Country,
    User
} from '@sap/cds/common';

aspect primary : cuid, managed {}

entity Books : primary {
    title         : String @mandatory;
    descr         : String default 'Short book description';
    averageRating : Integer null;
    Ratings       : Composition of many {
                        key pos        : Integer;
                            rating     : Integer    @mandatory @assert.range : [1, 5];
                            comment    : String;
                            createdAt  : Timestamp  @cds.on.insert: $now;
                            createdBy  : User       @cds.on.insert: $user;
                            modifiedAt : Timestamp  @cds.on.insert: $now   @cds.on.update: $now;
                            modifiedBy : User       @cds.on.insert: $user  @cds.on.update: $user;
                    }

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