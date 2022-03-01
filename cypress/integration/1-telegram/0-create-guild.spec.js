/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("create-guild", () => {
  before(() => {
    cy.visit("/create-guild")
  })

  describe("without wallet", () => {
    it("renders alert", () => {
      cy.get("div.chakra-alert").contains(
        "Please connect your wallet in order to continue!"
      )
    })
  })

  describe("with wallet", () => {
    before(() => {
      cy.connectWallet()
    })

    it("does not render alert", async () => {
      cy.get("h1").contains("Create Guild")
    })

    describe("creating guild", () => {
      it("fill name field", () => {
        cy.get("input[name='name']").type("Cypress Gang").blur()
        cy.wait(500)
        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
      })

      /* it("upload image", () => {
        cy.get("button.chakra-button[aria-label='Guild logo']").click()
        cy.findByText("Choose image").attachFile("cypress.jpg", {
          subjectType: "drag-n-drop",
        })
        cy.wait(200)
        cy.get("button > div > span > img").should("exist")
      }) */

      it("fill description", () => {
        const description =
          "This Guild was created by Cypress during automated tests. Should be automatically removed when test process is completed."
        cy.get("textarea[name='description']").type(description)
      })

      it("select Telegram group", () => {
        // for some reaston .findByText("Telegram") won't work, using .last() instead
        cy.get("h2").last().click()

        cy.get("input[name='TELEGRAM.platformId']")
          .invoke("val", "-1001653099938")
          .type(" {backspace}")

        cy.findByText("Guild bot added").should("exist")
      })

      it("check free entry", () => {
        cy.findByText("Free entry").click()
      })

      it("submit form", () => {
        cy.findByText("Summon").click()
        cy.confirmMetamaskSignatureRequest()
      })

      it("/cypress-gang exists", () => {
        cy.visit("/cypress-gang", { retryOnStatusCodeFailure: true })
        cy.get("h1").should("contain.text", "Cypress Gang")
      })
    })
  })
})