/**
 * Receives an array of Rating entities and extract the rating value from each object in the array
 */ 
function extractRatingValues(ratings) {
    return ratings.length > 0 ? ratings.map(ratingValue => ratingValue.rating) : undefined;
}

/**
 * Receives an array of rating values and calculates the average
 */ 
function calculateAverageRating(ratings) {
    return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : undefined;
}

module.exports = {
    extractRatingValues,
    calculateAverageRating
}
