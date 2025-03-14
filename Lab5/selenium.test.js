const selenium = require('selenium-webdriver')
let driver

beforeAll(async () => {
    driver =await new selenium.Builder()
        .forBrowser(selenium.Browser.CHROME)
        .build()
})

describe('Basic Wikipedia test(Task #2)', () => {
    beforeAll(async () => {
        await driver.get('https://www.wikipedia.org/')
    })

    test('Find search bar', async () => {
        let searchByName = await driver.findElement(selenium.By.name('search'))
        let searchById = await driver.findElement(selenium.By.id('searchInput'))

        expect(await searchByName.isEnabled()).toBe(true)
        expect(await searchById.isDisplayed()).toBe(true)

        expect(await searchByName.getAttribute('type')).toBe('search')
        expect(await searchById.getAttribute('type')).toBe('search')
    })

    test('Find logo', async () => {
        let logo = await driver.findElement(selenium.By.tagName('img'))

        expect(await logo.isEnabled()).toBe(true)
        expect(await logo.getAttribute('width')).toBe('200')
    })
})

describe('Interactivity test(Task #3)', () => {
    test('Perform search', async () => {
        await driver.get('https://www.wikipedia.org/')
        await driver.findElement(selenium.By.name('search'))
            .sendKeys('Selenium', selenium.Key.ENTER)
        await driver.wait(selenium.until.titleContains('Selenium'), 100)

        let title = await driver.getTitle()

        expect(title).toEqual('Selenium — Вікіпедія')
    })
})

describe('More access points(Task #4)', () => {
    let link
    beforeAll(async () => {
        link = 'https://uk.wikipedia.org/wiki/Selenium'
        await driver.get(link)
    })

    test('Find article title', async () => {
        let articleTitle = await driver.findElement(selenium.By.xpath('//h1')) //xpath search
            .findElement(selenium.By.tagName('span'))

        expect(await articleTitle.isEnabled()).toBe(true)
        expect(await articleTitle.getText()).toEqual('Selenium')
    })

    test('Find navigation', async () => {
        let nav = await driver.findElement(selenium.By.className('vector-toc-contents'))
            .findElement(selenium.By.css('li')) // css Search
            .findElement(selenium.By.tagName('a'))

        expect(await nav.isEnabled()).toBe(true)
        expect(await nav.getAttribute('href')).toEqual(link + '#')
    })
})

describe('More interactions(Task #5)', () => {
    let link
    beforeEach(async () => {
        link = 'https://uk.wikipedia.org/wiki/Selenium'
        await driver.get(link)
    })

    test('Click link', async () => {
        let a = driver.findElement(selenium.By.className('vector-toc-contents'))
            .findElement(selenium.By.css('li'))
            .findElement(selenium.By.tagName('a'))

        await driver.executeScript("arguments[0].click();", a);

        expect(await driver.getCurrentUrl()).toBe(link + '#')
    })

    test('Explicit wait', async () => {
        let img = await driver.findElement(selenium.By.tagName('img'))

        await driver.wait(selenium.until.elementIsVisible(img), 100)

        expect(await img.isEnabled()).toBe(true)
    })

    test('CSS characteristic', async () => {
        let articleTitle = await driver.findElement(selenium.By.xpath('//h1'))

        expect(await articleTitle.isEnabled()).toBe(true)
        expect(await articleTitle.getCssValue('margin-bottom')).toBe('0px')
    })
})

afterAll(() => {
    driver.quit()
})