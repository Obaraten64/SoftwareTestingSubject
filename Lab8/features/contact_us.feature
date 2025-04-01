Feature: Contact us
  Contact us page

  Scenario: Contact us
    Given Contact us
    When Get in touch
    Then I should get "Success! Your details have been submitted successfully."