const fileName = './labAssignment-lab4'
const file = require(fileName)

describe('UserService tests(Task #1)', () => {
    let mockGetFullName
    let userService

    beforeEach(() => {
        mockGetFullName = jest.fn((firstName, lastName) => `${firstName} ${lastName}`)
        userService = new file.UserService(mockGetFullName)
    })

    test('greet() calls to getFullName() with correct parameters', () => {
        userService.greet()

        expect(mockGetFullName).toHaveBeenCalledWith("John", "Doe")
    })

    test('greet() returns text in uppercase', () => {
        expect(userService.greet()).toBe("HELLO, JOHN DOE!")
    })
})

describe('asyncHello() tests(Task #2)', () => {
    test('Returns "hello world"', () => {
        return file.asyncHello().then(data => {
            expect(data).toBe("hello world")
        })
    })
})

describe('computeValue() test(Task #3)', () => {
    test('getNumber() returns 42', async () => {
        const data = await file.getNumber()

        await expect(data).toBe(42)
    })
    /* I would like to mock getNumber() in order to test computeValue() in London style
    but the way the code is written and JS works, that is not possible*/
    test('Returns 94', async () => {
        const data = await file.computeValue()

        expect(data).toBe(94)
    })
})

describe('asyncError() test(Task #4)', () => {
    test('Throws error', async () => {
        await expect(file.asyncError()).rejects.toThrow('Something went wrong')
    })
})

describe('ApiClient test(Task #5)', () => {
    let fetchMock
    let apiClient

    beforeEach(() => {
        apiClient = new file.ApiClient()

        let mockDate = jest.spyOn(Date, 'now').mockReturnValue(5)
        let jsonFunc = jest.fn().mockResolvedValue({data: 'test'})

        fetchMock = jest.spyOn(global, 'fetch')
            .mockResolvedValue({json: jsonFunc})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    });

    test('Calls fetch() once', async () => {
        const data = await apiClient.fetchData()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/data")
    })

    test('Returns JSON file with correct arguments', async () => {
        const expected = {data: 'test', fetchedAt: 5}

        const data = await apiClient.fetchData()

        expect(data).toEqual(expected)
    })
})

describe('ApiHelper test(Task #6)', () => {
    let apiMock
    let apiHelper

    beforeEach(() => {
        apiMock = jest.spyOn(new file.ApiClient(), 'fetchData')
            .mockResolvedValue({data: 'test', fetchedAt: 5})
        apiHelper = new file.ApiHelper()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    });

    test('Calls fetchData() once', async () => {
        const data = await apiHelper.fetchViaHelper(apiMock)

        expect(apiMock).toHaveBeenCalled()
    })

    test('Returns JSON file with correct arguments', async () => {
        const expected = {data: 'test', fetchedAt: 5}

        const data = await apiHelper.fetchViaHelper(apiMock)

        expect(data).toEqual(expected)
    })

    test('Throws error', async () => {
        apiMock.mockResolvedValue(null)

        await expect(apiHelper.fetchViaHelper(apiMock)).rejects
            .toThrow('Invalid data')
    })
})

describe('calculateFinalPrice() test(Task #7)', () => {
    test("should calculate final price with discount and tax", () => {
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            currency: "USD",
            discountService: { getDiscount: jest.fn(() => 0.2) },
        };
        expect(file.calculateFinalPrice(order, order.discountService)).toBe(176);
    });

    test('Throws when order invalid', () => {
        expect(() => file.calculateFinalPrice(null, null))
            .toThrow('Invalid order')
    })

    test('Throws when item invalid', () => {
        const order = {
            items: [{ price: -100, quantity: 2 }],
            taxRate: 0.1,
            currency: "USD",
            discountService: { getDiscount: jest.fn(() => 0.2) },
        };

        expect(() => file.calculateFinalPrice(order, order.discountService))
            .toThrow('Invalid item data')
    })
})

describe('OrderProcessor test(Task #8)', () => {
    const price = 176

    /*Same as with getNumber() function
    beforeEach(() => {
        mockCalculatePrice = jest.spyOn(file, 'calculateFinalPrice')
            .mockReturnValue(price)
    })*/

    test('Calculates converted price', async () => {
        const mockConverter = jest.fn((price, currentC, targetC) => {
            if (currentC === "USD" && targetC === "UA") {
                return price * 40;
            }
        })
        const processor = new file.OrderProcessor(mockConverter)
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            currency: 'USD',
            discountService: { getDiscount: jest.fn(() => 0.2) },
        }

        const data = await processor.processOrder(order, "UA")

        expect(mockConverter).toHaveBeenCalled()
        expect(data).toBe(price * 40)
    })

    test('Calculates not converted price without targetCurrence', async () => {
        const processor = new file.OrderProcessor()
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            currency: 'USD',
            discountService: { getDiscount: jest.fn(() => 0.2) },
        }

        const data = await processor.processOrder(order)

        expect(data).toBe(price)
    })

    test('Calculates not converted price when converter throws error', async () => {
        const processor = new file.OrderProcessor(() => {
            new Error('Conversion error')})
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            currency: 'USD',
            discountService: { getDiscount: jest.fn(() => 0.2) },
        }

        const data = await processor.processOrder(order)
        console.log(file)

        expect(data).toBe(price)
    })
})