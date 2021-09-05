/// <reference types="cypress" />

describe('As an editor I should not be able to access Configuration', () => {
    it('checks if an editor can access Configuration', () => {
        cy.login('john_editor', 'john%1');
        cy.url().should('contain', '/bolt/');
        cy.get('ul[class="admin__sidebar--menu"]').find('li').find('a[href="/bolt/menu/configuration"]').should('not.exist');
    })
});

describe('As an editor I should only be able to view the About Bolt maintenance page', () => {
    it('checks if an editor can access maintenance oages besides About Bolt', () => {
        cy.login('john_editor', 'john%1');
        cy.url().should('contain', '/bolt/');
        cy.get('ul[class="admin__sidebar--menu"]').find('li').eq(10).trigger('mouseover');

        cy.get('a[href="/bolt/menu/maintenance"]').click();
        cy.url().should('contain', '/bolt/menu/maintenance');
        cy.get('.menupage').find('ul').find('li').its('length').should('eq', 1);
        cy.get('.menupage').find('ul').find('li').click();
        cy.url().should('contain', '/bolt/about');

        cy.visit('/bolt/extensions');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/extensions');

        cy.visit('/bolt/logviewer');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/logviewer');

        cy.visit('/bolt/api', {failOnStatusCode: false});
        cy.get('h1').should('contain', '403 Forbidden');

        cy.visit('/bolt/clearcache');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/clearcache');

        cy.visit('/bolt/_trans', {failOnStatusCode: false});
        cy.get('h1').should('contain', '403 Forbidden');

        cy.visit('/bolt/kitchensink');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/kitchensink');
    })
});

describe('As an editor I should only be able to view uploaded files', () => {
    it('checks if an editor can access templates', () => {
        cy.login('john_editor', 'john%1');
        cy.url().should('contain', '/bolt/');
        cy.get('ul[class="admin__sidebar--menu"]').find('li').eq(10).trigger('mouseover');

        cy.get('a[href="/bolt/menu/filemanagement"]').click();
        cy.url().should('contain', '/bolt/menu/filemanagement');
        cy.get('.menupage').find('ul').find('li').its('length').should('eq', 1);
        cy.get('.menupage').find('ul').find('li').click();
        cy.url().should('contain', '/bolt/filemanager/files');

        cy.visit('/bolt/filemanager/themes');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/filemanager/themes');

        cy.visit('/bolt/filemanager/config');
        cy.url().should('contain', '/bolt/');
        cy.url().should('not.contain', '/bolt/filemanager/config');
    })
});

//TODO: test editor permissions in maintenance mode
