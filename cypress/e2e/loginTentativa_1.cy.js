describe('Login 5 Tentativas', () => {

    it('Login - 5 TENTATIVAS DE LOGIN FALHADAS RETORNANDO BLOQUEIO POR 10 MINUTOS', () => {
        cy.visit('/login');

        var numerosRandom = inserirNumeroAleatorio();
        var email = 'automacao' + numerosRandom + '@automacao.com';

        for (var i = 0; i < 4; i++) {
            loginTentativa(email, 'inexistenteSenha');
            cy.get('#mensagem-retorno .alert').should('contain.text', 'Essas credenciais não correspondem aos nossos registros.');

        }

        loginTentativa(email, 'inexistenteSenha');
        cy.get('#mensagem-retorno .alert').should('contain.text', 'Muitas tentativas de login. Tente novamente em 10 minutos.');

        cy.task('saveTimestamp', Date.now());
        cy.task('saveEmail', email);
    });

});

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inserirNumeroAleatorio() {
    var numerosAleatorios = [];

    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < 1; j++) {
            var numero = gerarNumeroAleatorio(1, 100000);
            numerosAleatorios.push(numero);
        }

        var numerosString = numerosAleatorios.join('');

        if (i === 0) {
            return numerosString;
        }
    }
}

function loginTentativa(email, senha) {
    cy.get('#email-login').clear().type(email);
    cy.get('input[name="password"]').clear().type(senha, { log: false });
    cy.get('button[type="submit"]').click();
}