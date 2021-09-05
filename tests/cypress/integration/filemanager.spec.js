/// <reference types="cypress" />

describe('As an Admin I want to see the files in the "Files" section', () => {
    it('checks if an admin can see the files in the Files section', () => {
        cy.login();
        cy.visit('/bolt/filemanager/themes');
        cy.get('.admin__header--title').should('contain', 'Theme files');
        cy.get('.path').should('contain', 'Path: themes/');

        cy.visit('/bolt/filemanager/files');
        cy.get('.path').should('contain', 'Path: files/');
    })
});

describe('As an Admin I want to delete a file from the "Files" section', () => {
    it('checks if an admin can delete files in the Files section', () => {
        cy.login();
        cy.visit('/bolt/filemanager/files');
        cy.get('#files-list tr td b').eq(1).contains('_b-penguin.jpeg');

        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(1).click();
        cy.get('a[class="dropdown-item delete"]').eq(1).click();

        cy.get('.modal-dialog').should('have.length', 1);
        cy.get('.modal-dialog').should('contain', 'Are you sure you wish to delete this file?');
        cy.get('button[class="btn btn-primary bootbox-accept"]').click();

        cy.get('.toast-body').should('contain', 'File deleted successfully');
        cy.get('#files-list tr').should('not.contain', '_b-penguin.jpeg');
    })
});

describe('As an Admin I want accidentally click delete file and want to cancel', () => {
    it('checks if an admin can canel deleting files in the Files section', () => {
        cy.login();
        cy.visit('/bolt/filemanager/files');
        cy.get('#files-list tr td b').eq(0).contains('_a-sunrise.jpeg');

        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(0).click();
        cy.get('a[class="dropdown-item delete"]').eq(0).click();

        cy.get('.modal-dialog').should('have.length', 1);
        cy.get('.modal-dialog').should('contain', 'Are you sure you wish to delete this file?');
        cy.get('button[class="btn btn-secondary btn-default bootbox-cancel"]').click();

        cy.get('.toast-body').should('not.exist');
        cy.get('#files-list tr').should('contain', '_a-sunrise.jpeg');
    })
});

describe('As an Admin I want to duplicate a file', () => {
    it('checks if an admin can duplicate files in the Files section', () => {
        cy.login();
        cy.visit('/bolt/filemanager/files');
        cy.get('#files-list tr td b').eq(0).contains('_a-sunrise.jpeg');
        cy.get('#files-list tr').should('not.contain', '_a-sunrise (1).jpeg');

        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(0).click();
        cy.get('a[class="dropdown-item"]').find('i[class="far fa-w fa-copy"]').eq(0).click();

        cy.url().should('contain', '/bolt/filemanager/files');
        cy.get('#files-list tr').should('contain', '_a-sunrise.jpeg');
        cy.get('#files-list tr').should('contain', '_a-sunrise (1).jpeg');

        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(1).click();
        cy.get('a[class="dropdown-item"]').find('i[class="far fa-w fa-copy"]').eq(1).click();

        cy.url().should('contain', '/bolt/filemanager/files');
        cy.get('#files-list tr').should('contain', '_a-sunrise.jpeg');
        cy.get('#files-list tr').should('contain', '_a-sunrise (1).jpeg');
        cy.get('#files-list tr').should('contain', '_a-sunrise (2).jpeg');

        //cleanup
        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(0).click();
        cy.get('a[class="dropdown-item delete"]').eq(0).click();
        cy.get('.modal-dialog').should('have.length', 1);
        cy.get('button[class="btn btn-primary bootbox-accept"]').click();

        cy.get('button[class="btn btn-sm btn-secondary edit-actions__dropdown-toggler dropdown-toggle dropdown-toggle-split"]').eq(0).click();
        cy.get('a[class="dropdown-item delete"]').eq(0).click();
        cy.get('.modal-dialog').should('have.length', 1);
        cy.get('button[class="btn btn-primary bootbox-accept"]').click();
    })
});

describe('As an admin I want to create and delete a folder', () => {
    it('checks if an admin can create and delete folders in the Files section', () => {
        cy.login();
        cy.visit('/bolt/filemanager/files');
        cy.get('a').should('not.contain', 'a-new-folder/');

        cy.get('input[name="folderName"]').type('a-new-folder');
        cy.get('button[class="btn btn-secondary btn-sm"]').click();

        cy.get('a').should('contain', 'a-new-folder/');

        cy.get('input[name="folderName"]').type('a-new-folder');
        cy.get('button[class="btn btn-secondary btn-sm"]').click();
        cy.wait(100);
        cy.get('.toast-body').should('contain', 'Could not create folder');

        cy.get('a[class="btn btn-danger btn-sm btn-mb-0 text-nowrap "]').eq(0).click();
        cy.wait(1000);
        cy.get('button[class="btn btn-primary bootbox-accept"]').click();

        cy.get('.toast-body').should('contain', 'Folder deleted successfully');
        cy.get('a').should('not.contain', 'a-new-folder/');
    })
});
