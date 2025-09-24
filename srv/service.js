const cds = require('@sap/cds')

class BookRaterService extends cds.ApplicationService {

    init() {
        // const { Books } = this.entities;

        this.on('rateBook', (req) => rateBook(req.data))

        function rateBook(data) {
            console.log('rateBook function called')
            console.log(data)
        }

        return super.init()
    }

}

module.exports = BookRaterService;