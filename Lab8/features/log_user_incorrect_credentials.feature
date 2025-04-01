Feature: Log user (Incorrect Credentials)
  Fail to log user with incorrect credential

  Scenario: Log user (Incorrect Credentials)
    Given Credentials
    When Login
    Then I should be told "Your email or password is incorrect!"