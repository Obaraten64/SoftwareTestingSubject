const pactum = require('pactum')

describe('Currency API Tests', () => {
    test('Available currency', async () => {
        await pactum.spec()
            .get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json')
            .expectStatus(200)
            .expectJsonSchema({
                type: 'object'
            })
    })

    test('Euro to other currency', async () => {
        await pactum.spec()
            .get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json')
            .expectStatus(200)
            .expectJsonSchema({
                type: 'object',
                required: ['date', 'eur']
            })
    })

    test('Not existing currency', async () => {
        await pactum.spec()
            .get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eurpian.json')
            .expectStatus(404)
    })
})

describe('Holidays API Tests', () => {
    test('Number of holidays', async () => {
        await pactum.spec()
            .get('https://www.gov.uk/bank-holidays.json')
            .expectStatus(200)
            .expectJsonSchema({
                required: ['england-and-wales', 'scotland', 'northern-ireland']
            })
            .expectJsonLength('england-and-wales.events', 75)
            .expectJsonLength('scotland.events', 84)
            .expectJsonLength('northern-ireland.events', 93)
    })

    test('Easter day', async () => {
        await pactum.spec()
            .get('https://www.gov.uk/bank-holidays.json')
            .expectStatus(200)
            .expectJsonSchema({
                required: ['england-and-wales']
            })
            .expectJsonLike({
                'england-and-wales': {
                    'events': [
                        {
                            'title': 'Easter Monday',
                            'date': '2019-04-22'
                        },
                        {
                            'title': 'Easter Monday',
                            'date': '2020-04-13',
                        }
                    ]
                }
            })
    })
})

describe('Word API', () => {
    test('"concurrency" word', async () => {
        await pactum.spec()
            .get('https://api.dictionaryapi.dev/api/v2/entries/en/concurrency')
            .expectStatus(200)
            .expectJsonSchema({
                required: ['word', 'phonetics', 'meanings']
            })
            .expectJsonLike([{
                'word': 'concurrency'
            }])
    })
})