describe('Login 5 Tentativa', () => {
    it('Login - VERIFICAR SE PASSARAM 10 MINUTOS E ENTÃO LOGAR COM SUCESSO', () => {
        cy.visit('/login');

        let email;
        let timeStamp;
        const tenMinutes = 10 * 60 * 1000;

        cy.task('getEmail')
            .then(emailTentativa => {
                email = emailTentativa;

                return cy.task('getTimestamp');
            }).then(tempo => {
                timeStamp = tempo;

                

                // Verificar se 10 minutos já passaram
                // if ((Date.now() - timeStamp) < tenMinutes) {
                //     cy.log('Ainda não passaram 10 minutos desde a última tentativa de login. Pulando o teste.');
                //     return;
                // }

                // Se passaram 10 minutos, tenta logar com credenciais válidas
                loginTentativa(email, 'inexistenteSenha');
                // cy.get('#mensagem-retorno').should('not.contain.text', 'Muitas tentativas de login. Tente novamente em 10 minutos.');
                cy.get('#mensagem-retorno .alert').should('contain.text', 'Essas credenciais não correspondem aos nossos registros.');

                // cy.url().then((url) => {
                //     if (url.includes('/define-acesso')) {
                //         cy.get('.login-box-msg').should('contain.text', 'Selecione a workspace que deseja utilizar');
                //         cy.contains('button[name="subdominio_id"]', 'TesteAutomatizado2').click();
                //         cy.get('.sidebar-menu.tree').children('.header').should('contain.text', 'MENU')

                //     } else if (url.includes('/home')) {
                //         cy.get('.sidebar-menu.tree').children('.header').should('contain.text', 'MENU')

                //     } else {
                //         throw new Error('URL não encontrada');
                //     }
                // });

            });
    });
});

function loginTentativa(email, senha) {
    cy.get('#email-login').clear().type(email);
    cy.get('input[name="password"]').clear().type(senha);
    cy.get('button[type="submit"]').click();
}