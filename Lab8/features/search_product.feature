Feature: Search product
  Find specific product

  Scenario: Search product
    Given Product
    When Search
    Then I should find "Blue Top"