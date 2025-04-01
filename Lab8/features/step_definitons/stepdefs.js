const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const selenium = require('selenium-webdriver')
const path = require("path");
let driver

async function buildDriver() {
    driver = await new selenium.Builder()
        .forBrowser(selenium.Browser.CHROME)
        .build()
    await driver.get('https://automationexercise.com/')
}

async function destroyDriver() {
    driver.quit()
}

Given('Credentials', function () {
    this.email = '213fi.v.liakh@std.npu.edu.ua'
    this.password = 'Su9er_Secre7'
})

When('Login', {timeout: 60 * 100000}, async function () {
    await buildDriver()
    //click signup
    let signup = await driver.findElement(selenium.By.xpath('//a[@href="/login"]'))
    await driver.executeScript("arguments[0].click();", signup)
    //check login form
    let signupForm = await driver.findElement(selenium.By.className('login-form'))
    //input login form
    await signupForm.findElement(selenium.By.name('email')).sendKeys(this.email)
    await signupForm.findElement(selenium.By.name('password')).sendKeys(this.password)
    await signupForm.findElement(selenium.By.tagName('button')).click()
    //check error
    let error = await driver.wait(
        selenium.until.elementLocated(selenium.By
            .xpath('//p[text()="Your email or password is incorrect!"]')),
        100
    )

    this.actual = await error.getText()
    await destroyDriver()
})

Then('I should be told {string}', async function(expected){
    assert.strictEqual(this.actual, expected)
})

Given('Contact us', function () {
    this.name = 'Vadim'
    this.email = '213fi.v.liakh@std.npu.edu.ua'
    this.subject = 'Su9er_Secre7'
    this.message = 'Bla-bla-bla-bla'
    this.file = path.resolve('./package.json')
})

When('Get in touch', {timeout: 60 * 100000}, async function () {
    await buildDriver()
    //find link
    let link = await driver.findElement(selenium.By.xpath('//a[@href="/contact_us"]'))
    await driver.executeScript("arguments[0].click();", link)
    //check contact form
    let contactForm = await driver.findElement(selenium.By.className('contact-form'))
    //input into form
    await contactForm.findElement(selenium.By.name('name')).sendKeys(this.name)
    await contactForm.findElement(selenium.By.name('email')).sendKeys(this.email)
    await contactForm.findElement(selenium.By.name('subject')).sendKeys(this.subject)
    await contactForm.findElement(selenium.By.name('message')).sendKeys(this.message)
    await contactForm.findElement(selenium.By.name('upload_file')).sendKeys(path.resolve(this.file))
    await contactForm.findElement(selenium.By.name('submit')).click()
    //check success
    await driver.switchTo().alert().accept()
    let success = await driver.wait(
        selenium.until.elementLocated(selenium.By
            .className('contact-form')),
        100
    )

    this.actual = await success.findElement(selenium.By.className('status'))
        .getText()
    await destroyDriver()
})

Then('I should get {string}', async function(expected){
    assert.strictEqual(this.actual, expected)
})

Given('Product', function () {
    this.product = 'Blue Top'
})

When('Search', {timeout: 60 * 100000}, async function () {
    await buildDriver()
    //click products
    let link = await driver.findElement(selenium.By.xpath('//a[@href="/products"]'))
    await driver.executeScript("arguments[0].click();", link)
    //search container
    let searchContainer = await driver.findElement(selenium.By.id('advertisement'))
    await searchContainer.findElement(selenium.By.name('search')).sendKeys(this.product)
    await searchContainer.findElement(selenium.By.tagName('button')).click()
    //check product
    let searchedProduct = await driver.findElement(selenium.By.className('productinfo'))
        .findElement(selenium.By.tagName('p'))

    this.actual = await searchedProduct.getText()
    await destroyDriver()
})

Then('I should find {string}', async function(expected){
    assert.strictEqual(this.actual, expected)
})