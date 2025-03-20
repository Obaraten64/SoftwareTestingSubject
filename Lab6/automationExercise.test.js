const selenium = require('selenium-webdriver')
const path = require("path");
let driver

beforeAll(async () => {
    driver = await new selenium.Builder()
        .forBrowser(selenium.Browser.CHROME)
        .build()
})

describe('Check main page(Task #1)', () => {
    beforeAll(async () => {
        await driver.get('https://automationexercise.com/')
    })

    test('Find menu', async () => {
        let searchByClass = await driver.findElement(selenium.By.className('navbar-nav'))

        expect(await searchByClass.isEnabled()).toBe(true)
        expect(await searchByClass.getTagName()).toBe('ul')
    })

    test('Find logo', async () => {
        let logo = await driver.findElement(selenium.By.className('logo'))
            .findElement(selenium.By.tagName('img'))

        expect(await logo.isEnabled()).toBe(true)
        expect(await logo.getAttribute('alt')).toBe('Website for automation practice')
    })

    test('Find Signup', async () => {
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))

        expect(await signup.isEnabled()).toBe(true)
        expect(await signup.getText()).toBe('Signup / Login')
    })
})

describe('Test cases', () => {
    beforeEach(async () => {
        await driver.get('https://automationexercise.com/')
    })

    afterEach(async () => {
        await driver.manage().deleteAllCookies()
    })

    test('Register user', async () => {
        const userName = 'Vadim'
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //check signup form
        await registerUser(userName)
        //delete user
        await deleteUser()
    }, 10000)

    test('Login user', async () => {
        const userName = 'Vadim1'
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //check login form
        let signupForm = await driver.findElement(selenium.By.className('login-form'))
        expect(await signupForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Login to your account')
        //input into form
        await signupForm.findElement(selenium.By.name('email')).sendKeys('211fi.v.liakh@std.npu.edu.ua')
        await signupForm.findElement(selenium.By.name('password')).sendKeys('Su9er_Secre7')
        await signupForm.findElement(selenium.By.tagName('button')).click()
        //check logged as
        expect(await driver.findElement(selenium.By.className('fa-user'))
            .findElement(selenium.By.xpath('./..'))
            .findElement(selenium.By.tagName('b'))
            .getText()).toBe(userName)
    }, 10000)

    test('Login user wrong credentials', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //check login form
        let signupForm = await driver.findElement(selenium.By.className('login-form'))
        expect(await signupForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Login to your account')
        //input login form
        await signupForm.findElement(selenium.By.name('email')).sendKeys('fi.v.liakh@std.npu.edu.ua')
        await signupForm.findElement(selenium.By.name('password')).sendKeys('Su9er_Secre78')
        await signupForm.findElement(selenium.By.tagName('button')).click()
        //check error
        let error = await driver.wait(
            selenium.until.elementLocated(selenium.By
                .xpath('//p[text()="Your email or password is incorrect!"]')),
            100
        )
        expect(await error.isDisplayed()).toBe(true)
    }, 10000)

    test('Logout user', async () => {
        const userName = 'Vadim1'
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //check login form
        let signupForm = await driver.findElement(selenium.By.className('login-form'))
        expect(await signupForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Login to your account')
        //input into form
        await signupForm.findElement(selenium.By.name('email')).sendKeys('211fi.v.liakh@std.npu.edu.ua')
        await signupForm.findElement(selenium.By.name('password')).sendKeys('Su9er_Secre7')
        await signupForm.findElement(selenium.By.tagName('button')).click()
        //check logged as
        expect(await driver.findElement(selenium.By.className('fa-user'))
            .findElement(selenium.By.xpath('./..'))
            .findElement(selenium.By.tagName('b'))
            .getText()).toBe(userName)
        //logout
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.xpath('//a[@href="/logout"]')))
        let loginForm = await driver.findElement(selenium.By.className('login-form'))
        expect(await loginForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Login to your account')
    }, 10000)

    test('Register user existing credentials', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //check signup form
        let signupForm = await driver.findElement(selenium.By.className('signup-form'))
        expect(await signupForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('New User Signup!')
        //input into form
        await signupForm.findElement(selenium.By.name('name')).sendKeys('Vadim')
        await signupForm.findElement(selenium.By.name('email')).sendKeys('211fi.v.liakh@std.npu.edu.ua')
        await signupForm.findElement(selenium.By.tagName('button')).click()
        //check error
        let error = await driver.wait(
            selenium.until.elementLocated(selenium.By
                .xpath('//p[text()="Email Address already exist!"]')),
            100
        )
        expect(await error.isDisplayed()).toBe(true)
    }, 10000)

    test('Contact us', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/contact_us"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check signup form
        let contactForm = await driver.findElement(selenium.By.className('contact-form'))
        expect(await contactForm.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Get In Touch'.toUpperCase())
        //input into form
        await contactForm.findElement(selenium.By.name('name')).sendKeys('Vadim')
        await contactForm.findElement(selenium.By.name('email')).sendKeys('211fi.v.liakh@std.npu.edu.ua')
        await contactForm.findElement(selenium.By.name('subject')).sendKeys('testing')
        await contactForm.findElement(selenium.By.name('message')).sendKeys('Test test test')
        await contactForm.findElement(selenium.By.name('upload_file')).sendKeys(path.resolve('package.json'))
        await contactForm.findElement(selenium.By.name('submit')).click()
        //check success
        await driver.switchTo().alert().accept()
        let success = await driver.wait(
            selenium.until.elementLocated(selenium.By
                .className('contact-form')),
            100
        )
        expect(await success.findElement(selenium.By.className('status'))
            .getText()).toBe('Success! Your details have been submitted successfully.')
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('btn')))
        expect(await driver.getTitle()).toBe('Automation Exercise')
    }, 10000)

    test('Test cases', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click test cases
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/test_cases"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check title
        let contactForm = await driver.findElement(selenium.By.className('title'))
        expect(await contactForm.findElement(selenium.By.tagName('b'))
            .getText()).toBe('Test Cases'.toUpperCase())
    }, 10000)

    test('All products', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('choose'))
                .findElement(selenium.By.tagName('a')))
        //check product
        expect(await driver.getTitle()).toContain('Product Details')
        let productInfo = await driver.findElement(selenium.By.className('product-information'))
        expect(await productInfo.findElement(selenium.By.tagName('h2')).isDisplayed()).toBe(true)
        expect(await productInfo.findElement(selenium.By.tagName('p')).isDisplayed()).toBe(true)
        expect(await productInfo.findElement(selenium.By.tagName('span')).isDisplayed()).toBe(true)
    }, 10000)

    test('Search product', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        //search container
        let searchContainer = await driver.findElement(selenium.By.id('advertisement'))
        await searchContainer.findElement(selenium.By.name('search')).sendKeys('Blue Top')
        await searchContainer.findElement(selenium.By.tagName('button')).click()
        //check product
        let searchedProducts = await driver.findElement(selenium.By.className('features_items'))
        expect(await searchedProducts.isDisplayed()).toBe(true)
        expect(await searchedProducts.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Searched Products'.toUpperCase())
        expect(await searchedProducts.findElement(selenium.By.className('col-sm-4')).isDisplayed()).toBe(true)
    }, 10000)

    test('Subscription on home page', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //check footer
        let footer = await driver.findElement(selenium.By.tagName('footer'))
        expect(await footer.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Subscription'.toUpperCase())
        //subscribe
        await footer.findElement(selenium.By.id('susbscribe_email')).sendKeys('21fi.v.liakh@std.npu.edu.ua')
        await footer.findElement(selenium.By.tagName('button')).click()
        //check success
        let success = await driver.findElement(selenium.By.className('alert'))
        expect(await success.isDisplayed()).toBe(true)
        expect(await success.getText()).toBe('You have been successfully subscribed!')
    }, 10000)

    test('Subscription on cart page', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click cart
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", link)
        expect(await driver.getTitle()).toContain('Checkout')
        //check footer
        let footer = await driver.findElement(selenium.By.tagName('footer'))
        expect(await footer.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('Subscription'.toUpperCase())
        //subscribe
        await footer.findElement(selenium.By.id('susbscribe_email')).sendKeys('21fi.v.liakh@std.npu.edu.ua')
        await footer.findElement(selenium.By.tagName('button')).click()
        //check success
        let success = await driver.findElement(selenium.By.className('alert'))
        expect(await success.isDisplayed()).toBe(true)
        expect(await success.getText()).toBe('You have been successfully subscribed!')
    }, 10000)

    test('Add to the cart', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        //add to the cart
        let productList = await products.findElements(selenium.By.className('single-products'))
        for (let i = 0; i < 2; i++) {
            await driver.executeScript("arguments[0].click();",
                productList[i].findElement(selenium.By.tagName('a')))
            await driver.wait(
                selenium.until.elementIsVisible(
                    driver.findElement(selenium.By.className('btn-success'))
                ), 5000).click()
        }
        //check cart
        let cart = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", cart)
        let cart_info = await driver.findElement(selenium.By.className('cart_info'))
        for (let i = 0; i < 2; i++) {
            let table = await cart_info.findElement(selenium.By.id('product-' + (i + 1)))
            expect(await table.isDisplayed()).toBe(true)
        }
    }, 10000)

    test('Verify quantity in cart', async () => {
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        //click on product
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('choose'))
                .findElement(selenium.By.tagName('a')))
        //check product
        expect(await driver.getTitle()).toContain('Product Details')
        let productInfo = await driver.findElement(selenium.By.className('product-information'))
        expect(await productInfo.findElement(selenium.By.tagName('h2')).isDisplayed()).toBe(true)
        expect(await productInfo.findElement(selenium.By.tagName('p')).isDisplayed()).toBe(true)
        //change quant
        let form = await productInfo.findElement(selenium.By.tagName('span'))
        expect(await form.isDisplayed()).toBe(true)
        await form.findElement(selenium.By.id('quantity')).clear()
        await form.findElement(selenium.By.id('quantity')).sendKeys(4)
        await form.findElement(selenium.By.tagName('button')).click()
        //confirm
        await driver.wait(
            selenium.until.elementIsVisible(
                driver.findElement(selenium.By.className('btn-success'))
            ), 5000).click()
        //check cart
        let cart = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", cart)
        let cart_info = await driver.findElement(selenium.By.id('product-1'))
        expect(await cart_info.isDisplayed()).toBe(true)
        expect(await cart_info.findElement(selenium.By.tagName('button'))
            .getText()).toBe('4')
    }, 10000)

    test('Place order, register while checkout', async () => {
        const userName = 'Vadim'
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        //add to the cart
        let productList = await products.findElement(selenium.By.className('single-products'))
        await driver.executeScript("arguments[0].click();",
            productList.findElement(selenium.By.tagName('a')))
        await driver.wait(
            selenium.until.elementIsVisible(
                driver.findElement(selenium.By.className('btn-success'))
            ), 5000).click()
        //check cart
        let cart = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", cart)
        let cart_info = await driver.findElement(selenium.By.className('cart_info'))
        let table = await cart_info.findElement(selenium.By.id('product-1'))
        expect(await table.isDisplayed()).toBe(true)
        //checkout
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('check_out')))
        let register = await driver.wait(
            selenium.until.elementIsVisible(
                driver.findElement(selenium.By.className('modal-body'))
            ), 5000).findElement(selenium.By.tagName('a'))
        await driver.executeScript("arguments[0].click();", register)
        //registration
        await registerUser(userName)
        //go to cart again
        cart = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", cart)
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('check_out')))
        await insertPayment()
        //delete user
        await deleteUser()
    }, 100000)

    test('Place order, register before checkout', async () => {
        const userName = 'Vadim'
        //check home page
        expect(await driver.getTitle()).toBe('Automation Exercise')
        //click signup
        let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
        await driver.executeScript("arguments[0].click();", signup)
        //registration
        await registerUser(userName)
        //click products
        let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
        await driver.executeScript("arguments[0].click();", link)
        //check all products
        let products = await driver.findElement(selenium.By.className('features_items'))
        expect(await products.isDisplayed()).toBe(true)
        expect(await products.findElement(selenium.By.tagName('h2'))
            .getText()).toBe('All Products'.toUpperCase())
        //add to the cart
        let productList = await products.findElement(selenium.By.className('single-products'))
        await driver.executeScript("arguments[0].click();",
            productList.findElement(selenium.By.tagName('a')))
        await driver.wait(
            selenium.until.elementIsVisible(
                driver.findElement(selenium.By.className('btn-success'))
            ), 5000).click()
        //check cart
        let cart = await driver.findElement(selenium.By.xpath('//a[@href="/view_cart"]'))
        await driver.executeScript("arguments[0].click();", cart)
        let cart_info = await driver.findElement(selenium.By.className('cart_info'))
        let table = await cart_info.findElement(selenium.By.id('product-1'))
        expect(await table.isDisplayed()).toBe(true)
        //checkout
        await driver.executeScript("arguments[0].click();",
            driver.findElement(selenium.By.className('check_out')))
        await insertPayment()
        //delete user
        await deleteUser()
    }, 100000)
})

afterAll(async () => {
    driver.quit()
})

async function registerUser(userName) {
    let signupForm = await driver.findElement(selenium.By.className('signup-form'))
    expect(await signupForm.findElement(selenium.By.tagName('h2'))
        .getText()).toBe('New User Signup!')
    //input into form
    await signupForm.findElement(selenium.By.name('name')).sendKeys(userName)
    await signupForm.findElement(selenium.By.name('email')).sendKeys('21fi.v.liakh@std.npu.edu.ua')
    await signupForm.findElement(selenium.By.tagName('button')).click()
    //check new form
    let loginForm = await driver.findElement(selenium.By.className('login-form'))
    expect(await loginForm.findElement(selenium.By.tagName('b'))
        .getText()).toBe('Enter Account Information'.toUpperCase())
    //input into new form
    await loginForm.findElement(selenium.By.id('id_gender1')).click()
    await loginForm.findElement(selenium.By.id('password')).sendKeys('Su9er_Secre7')
    await loginForm.findElement(selenium.By.id('days')).sendKeys('4')
    await loginForm.findElement(selenium.By.id('months')).sendKeys('October')
    await loginForm.findElement(selenium.By.id('years')).sendKeys('2000')
    await loginForm.findElement(selenium.By.id('newsletter')).click()
    await loginForm.findElement(selenium.By.id('optin')).click()
    await loginForm.findElement(selenium.By.id('first_name')).sendKeys(userName)
    await loginForm.findElement(selenium.By.id('last_name')).sendKeys('Liakh')
    await loginForm.findElement(selenium.By.id('company')).sendKeys('UDU')
    await loginForm.findElement(selenium.By.id('address1')).sendKeys('Somewhere')
    await loginForm.findElement(selenium.By.id('address2')).sendKeys('Somewhere else')
    await loginForm.findElement(selenium.By.id('country')).sendKeys('United States')
    await loginForm.findElement(selenium.By.id('state')).sendKeys('ny')
    await loginForm.findElement(selenium.By.id('city')).sendKeys('nyc')
    await loginForm.findElement(selenium.By.id('zipcode')).sendKeys('3030')
    await loginForm.findElement(selenium.By.id('mobile_number')).sendKeys('0933035674')
    await loginForm.findElement(selenium.By.tagName('button')).click()
    //check registration
    expect(await driver.findElement(selenium.By.className('title'))
        .findElement(selenium.By.tagName('b')).getText()).toBe('Account Created!'.toUpperCase())
    await driver.executeScript("arguments[0].click();",
        driver.findElement(selenium.By.className('btn')))
    //check logged as
    expect(await driver.findElement(selenium.By.className('fa-user'))
        .findElement(selenium.By.xpath('./..'))
        .findElement(selenium.By.tagName('b'))
        .getText()).toBe(userName)
}

async function deleteUser() {
    await driver.executeScript("arguments[0].click();",
        driver.findElement(selenium.By.xpath('//a[@href="/delete_account"]')))
    expect(await driver.findElement(selenium.By.className('title'))
        .findElement(selenium.By.tagName('b')).getText()).toBe('Account Deleted!'.toUpperCase())
    await driver.executeScript("arguments[0].click();",
        driver.findElement(selenium.By.className('btn')))
}

async function insertPayment() {
    let titles = await driver.findElements(selenium.By.className('heading'))
    expect(await titles[0].getText()).toBe('Address Details')
    expect(await titles[1].getText()).toBe('Review Your Order')
    await driver.findElement(selenium.By.className('form-control')).sendKeys('test')
    await driver.executeScript("arguments[0].click();",
        driver.findElement(selenium.By.className('check_out')))
    //payment details
    let paymentForm = await driver.findElement(selenium.By.id('payment-form'))
    await paymentForm.findElement(selenium.By.name('name_on_card')).sendKeys('Liakh Vadim')
    await paymentForm.findElement(selenium.By.name('card_number')).sendKeys('666666')
    await paymentForm.findElement(selenium.By.name('cvc')).sendKeys('666')
    await paymentForm.findElement(selenium.By.name('expiry_month')).sendKeys('10')
    await paymentForm.findElement(selenium.By.name('expiry_year')).sendKeys('6666')
    await paymentForm.findElement(selenium.By.tagName('button')).click()
    //check success
    let textContainer = await driver.wait(
        selenium.until.elementIsVisible(
            driver.findElement(selenium.By.className('col-sm-9'))
        ), 500)
    expect(await textContainer.findElement(selenium.By.tagName('p'))
        .getText()).toBe('Congratulations! Your order has been confirmed!')
}