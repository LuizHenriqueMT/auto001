import { generate } from 'gerador-validador-cpf';
import "cypress-real-events";
const token = Cypress.env('API_TOKEN');
describe('End 2 End - Entrega', () => {

    const email = Cypress.env('login').email;
    const senha = Cypress.env('login').senha;

    // const configurarParametros = (configFile, parametrosParaAlterar, nextUrl, nextStep) => {
    //     cy.fixture(configFile).then((config) => {
    //         cy.visit('/login');
    //         cy.get('input[name="_token"]').invoke('val').then((token) => {
    //             cy.request({
    //                 method: 'POST',
    //                 url: '/login',
    //                 body: {
    //                     email: email,
    //                     password: senha,
    //                     remember: false,
    //                     _token: token
    //                 }
    //             }).then((loginResponse) => {
    //                 expect(loginResponse.status).to.eq(200);

    //                 cy.visit(nextUrl);

    //                 cy.get('input[name="_token"]').invoke('val').then((csrfToken) => {
    //                     const parametrosAtualizados = {
    //                         ...config.parametros,
    //                         ...parametrosParaAlterar,
    //                         _token: csrfToken
    //                     };

    //                     cy.request({
    //                         method: 'POST',
    //                         url: '/parametro',
    //                         body: parametrosAtualizados,
    //                         headers: {
    //                             'Content-Type': 'application/json'
    //                         },
    //                         failOnStatusCode: false
    //                     }).then((response) => {
    //                         expect(response.status).to.eq(200);
    //                         nextStep(parametrosParaAlterar);
    //                     })
    //                 });
    //             });
    //         });
    //     });
    // };

    const configurarParametros = (configFile, parametrosParaAlterar, nextUrl, nextStep) => {
        cy.fixture(configFile).then((config) => {
            cy.visit('/login');
            cy.get('input[name="_token"]').invoke('val').then((token) => {
                cy.request({
                    method: 'POST',
                    url: '/login',
                    body: {
                        email: email,
                        password: senha,
                    }
                }).then((loginResponse) => {
                    expect(loginResponse.status).to.eq(200);
                    const authToken = loginResponse.body.token;

                    cy.visit(nextUrl);

                    cy.get('input[name="_token"]').invoke('val').then((csrfToken) => {
                        const parametrosAtualizados = {
                            ...config.parametros,
                            ...parametrosParaAlterar,
                            _token: csrfToken
                        };

                        cy.request({
                            method: 'POST',
                            url: '/parametro',
                            body: parametrosAtualizados,
                            headers: {
                                'Authorization': `Bearer ${authToken}`,
                                'Content-Type': 'application/json'
                            },
                            failOnStatusCode: false
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            cy.visit(nextUrl, {
                                headers: {
                                    'Authorization': `Bearer ${authToken}`
                                }
                            }).then(() => {
                                nextStep();
                            });
                        })
                    });
                });
            });
        });
    };

    it('Cadastro de Funcionário - CADASTRAR FUNCIONÁRIO COM SUCESSO E COM NOVOS DADOS NO AUTOCOMPLETE', () => {
        cy.allure().tag("Novo Funcionario", "Novo Dado Autocomplete", "Inserção Todos Campos", "Inserção Validação Entrega - Senha");
        cy.allure().owner("Luiz Henrique T.");

        var dataAtual = gerarDataAtual(true, false);

        const realizarTeste = () => {
            cy.visit('/funcionario');
            // 
            cy.get('#btn-novo-funcionario').click();

            cy.get('#imagem-usuario').selectFile("cypress/img/profile.png", { force: true });
            cy.get('#tutorial-funcionario-nome #nome').type('Teste Automatizado ' + dataAtual);
            cy.get('#tutorial-funcionario-registro #registro').type('AUTO ' + dataAtual);
            cy.get('#tutorial-funcionario-cpf #cpf').type(generate());
            cy.get('#tutorial-funcionario-carteira #carteira').type(inserirRandom(1, 9, 7));
            cy.get('#tutorial-funcionario-pg #rg').type(inserirRandom(1, 9, 7));
            cy.get('#tutorial-funcionario-pis #pis').type(inserirRandom(1, 9, 7));


            cy.get('#tutorial-funcionario-admissao #admissao').type(gerarDataAtual(false, false));
            cy.get('#tutorial-funcionario-data-nascimento #nascimento').type(gerarDataAtual(false, true));
            cy.get('#tutorial-funcionario-email #email').type('teste@teste.com');

            cy.get('#tutorial-funcionario-lider input[name="funcionario_lider_id"]').type('Teste Automatizado').wait(700).type('{enter}');
            cy.get('#tutorial-funcionario-gestor input[name="funcionario_gestor_id"]').type('Teste Automatizado').wait(700).type('{enter}');

            cy.get('#tutorial-funcionario-turno input[name="turno_id"]').type('TURNO ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);


            cy.get('#tutorial-funcionario-setor input[name="setor_id"]').type('SETOR ' + dataAtual).wait(850).type('{enter}');
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-funcionario-cargo input[name="cargo_id"]').type('CARGO ' + dataAtual).wait(850).type('{enter}');
            cy.intercept('POST', '/autocomplete/save').as('postAutocompleteCargo');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocompleteCargo').its('response.statusCode').should('eq', 200);
            cy.get('@postAutocompleteCargo').then((interception) => {
                const data = interception.response.body.data;
                cy.task('saveCargo', data);
            });

            cy.get('#tutorial-funcionario-centro-custo input[name="centro_custo_id"]').type('CC ' + dataAtual).wait(850).type('{enter}');
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-funcionario-ghe input[name="ghe_id"]').type('GHE ' + dataAtual).wait(850).type('{enter}');
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-funcionario-local-retirada input[name="local_retirada_id"]').type('LOCAL RETIRADA ' + dataAtual).wait(850).type('{enter}');
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-funcionario-identificador #identificador').type(inserirRandom(1, 9, 7));
            cy.get('#tutorial-funcionario-inicio-ferias #inicio_ferias').type(gerarDataAtual(false, false));
            cy.get('#tutorial-funcionario-fim-ferias #fim_ferias').type(gerarDataAtual(false, false));

            cy.get('#btn-validacao-entrega-tab').click();
            cy.get('#tutorial-guiado-validacao-entrega #tipo_uso_validacao_entrega').select('S');
            cy.get('#senha_nova').type('123');
            cy.get('#confirmar').type('123');

            cy.intercept('POST', '/funcionario').as('postFuncionario');
            cy.get('#btn-salvar-funcionario').click();
            cy.wait('@postFuncionario').its('response.statusCode').should('eq', 200);

            cy.get('@postFuncionario').then((interception) => {
                const funcionario = interception.response.body.data;
                cy.task('saveFuncionarioCriado1', funcionario);
            });
        }

        configurarParametros('config.json', {
            autoincremente_funcionario: 'N',
        }, '/funcionario', realizarTeste);
    });

    it('Cadastro de Produto - CADASTRAR PRODUTO SEM LIBERAÇÃO PARA FUNCIONARIO COM SUCESSO E COM NOVOS DADOS NO AUTOCOMPLETE', () => {
        cy.allure().tag("Novo Produto", "Sem liberação Funcionario", "Novo Dado Autocomplete", "Inserção Todos Campos");
        cy.allure().owner("Luiz Henrique T.");

        var dataAtual = gerarDataAtual(true, false);

        const realizarTeste = () => {
            cy.visit('/produto');

            cy.get('#btn-novo-produto').click();

            cy.get('#tutorial-produto-foto #produto-foto').selectFile("cypress/img/epi.jpg", { force: true });
            cy.get('#tutorial-produto-codigo #codigo').type('P AUTO ' + dataAtual);
            cy.get('#tutorial-produto-descricao #descricao').type('PRODUTO Automatizado ' + dataAtual);
            cy.get('#tutorial-produto-referencia #referencia').type(inserirRandom(1, 9, 4));
            cy.get('#tutorial-produto-quantidade-entregar #qt_entrega').clear().type(inserirRandom(1, 9, 1));
            cy.get('#tutorial-produto-periodicidade #periodo').clear().type(inserirRandom(1, 9, 1));
            cy.get('#tutorial-produto-periodicidade #periodicidade').select(inserirRandom(1, 7, 1));
            cy.get('#tutorial-produto-valor #vl_custo').clear().type(inserirRandom(1, 99999, 1));
            cy.get('#tutorial-produto-percentual-ipi #percentual_ipi').clear().type(inserirRandom(1, 999, 1));

            cy.get('#tutorial-produto-marca input[name="marca_id"]').type('MARCA ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-produto-unidade input[name="unidade_id"]').type('UNIDADE ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-produto-localizacao input[name="localizacao_id"]').type('LOCALIZACAO ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-produto-tipo .fa-close').click();
            cy.get('#tutorial-produto-tipo input[name="tipo_produto_id"]').type(inserirTipoProduto()).wait(700).type('{enter}');

            cy.get('#tutorial-produto-familias input[name="familia_produtos_id"]').type('FAMILIA PRODUTOS ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-produto-familias input[name="sub_familia_id"]').type('SUBFAMILIA PRODUTOS ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('.actions a').contains('Próxima').click();

            cy.get('#tutorial-produto-fornecedor input[name="fornecedor_id"]').type('FORNECEDOR ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('#tutorial-produto-fornecedor-codigo #codigo_produto_fornecedor').type(inserirRandom(1, 9, 6));
            cy.get('#tutorial-produto-fornecedor-fator-compra #fator_compra').type(inserirRandom(1, 5, 1));
            cy.get('#tutorial-produto-fornecedor-ca #ca').type(inserirRandom(10000, 99999, 1));
            cy.get('#tutorial-produto-fornecedor-ca-data-vencimento #data_vencimento').type(inserirDataRandom('S')).type('{esc}');
            cy.get('#add-adicionar-fornecedor').click();

            cy.get('.fornecedor_desc').should('exist')

            cy.get('.actions a').contains('Próxima').click();

            cy.get('#tutorial-grade-titulo input[name="grade_id"]').type('GRADE ' + inserirEpoch()).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocompleteGrade');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocompleteGrade').its('response.statusCode').should('eq', 200);
            cy.get('@postAutocompleteGrade').then((interception) => {
                const gradeId = interception.response.body.data.id;
                cy.wrap(gradeId).as('gradeId');
            });

            cy.get('#add-grade').click();

            cy.get('.grade_desc').should('exist')

            cy.get('.actions a').contains('Próxima').click();

            cy.get('#produto-step-p-3 tr > :nth-child(6) > .form-control').type(inserirRandom(1, 9, 5))
            cy.get('#produto-step-p-3 tr > :nth-child(7) > .form-control').type(inserirRandom(1, 9, 12))
            cy.get('#produto-step-p-3 tr > :nth-child(8) > .form-control').clear().type(inserirRandom(1, 5, 1))

            cy.get('.actions a').contains('Próxima').click();

            cy.get('#tutorial-produto-grupo input[name="grupo_produto_id"]').type('GRUPO ' + dataAtual).wait(850).type('{enter}')
            cy.intercept('POST', '/autocomplete/save').as('postAutocomplete');
            cy.get('.bootbox > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            cy.wait('@postAutocomplete').its('response.statusCode').should('eq', 200);

            cy.get('.actions a').contains('Próxima').click();

            cy.get('@gradeId').then((gradeId) => {
                cy.get('#grade-estoque').select(gradeId.toString());
            });

            cy.get('@gradeId').then((gradeId) => {
                cy.get('#grade-estoque').should('have.value', gradeId);
            });

            cy.get('#estoque_minimo').type(inserirRandom(1, 9, 1))
            cy.get('#estoque_ideal').type(inserirRandom(10, 50, 1))

            cy.get('#add-adicionar-estoque').click();

            cy.get('.actions a').contains('Próxima').click();

            cy.get('#tutorial-produto-descricao-arquivo #descricao-arquivo').type('ANEXO ' + dataAtual);
            cy.get('#tutorial-produto-procurar-arquivo #arquivos').selectFile("cypress/img/epi.jpg", { force: true });
            cy.get('#tutorial-produto-adicionar-arquivo #add_arquivo').click();

            cy.get('.descricao-arquivo').should('exist');

            cy.intercept('POST', '/produto').as('postProduto');
            cy.get('.actions a').contains('Salvar').click();
            cy.wait('@postProduto').its('response.statusCode').should('eq', 200);

            cy.get('@postProduto').then((interception) => {
                const produto = interception.response.body.data;
                cy.task('saveProdutoCriado1', produto);
            });

            cy.task('getProdutoCriado1').then(data => {
                const tipoProdutoId = data.produto.tipo_produto_id;

                cy.intercept('GET', `/get_tipo_produto?id=${tipoProdutoId}`).as('getProduto');
                cy.request(`/get_tipo_produto?id=${tipoProdutoId}`).then((response) => {
                    const tipoProduto = response.body;
                    cy.task('saveTipoProduto', tipoProduto);
                });

            });

        }

        configurarParametros('config.json', {
            permite_liberacao_funcionario: 'N',
        }, '/produto', realizarTeste);

    });

    it('Liberação de Produto - LIBERAR O PRODUTO PARA O FUNCIONÁRIO ATRAVÉS DO CARGO', () => {
        cy.allure().tag("Liberação de Produto", "Produto", "Funcionario", "Cargo", "1 liberação");
        cy.allure().owner("Luiz Henrique T.");

        const realizarTeste = () => {
            cy.visit('/liberacao_produto');

            cy.get('#tutorial-liberacao-tipo-liberacao #tipoLiberacao').select('LP');

            cy.task('getProdutoCriado1').then(data => {
                const descricao = data.produto.descricao;
                cy.get('#filtro_relacao').type(descricao);
                cy.get('input[data-descricao="' + descricao + '"]').check();
            })

            cy.get('.liberacao-produto a').contains('Cargo').click();

            cy.task('getFuncionarioCriado1').then(data => {
                cy.get('#cargo').type(data.cargo.descricao).wait(500);
                cy.get('.select2-results__option').click();
            });

            cy.get('#adicionar-liberacao-cargo').click();

            cy.intercept('POST', '/salvar_liberacao_produto').as('postLiberacaoProduto');
            cy.get('#salvar').click();
            cy.wait('@postLiberacaoProduto').its('response.statusCode').should('eq', 200);

        }

        configurarParametros('config.json', {
        }, '/liberacao_produto', realizarTeste);
    });

    it('Entrega de Produto - REALIZAR ENTREGA DE PRODUTO PELA FORMA PADRÃO UTILIZANDO O FUNCIONARIO E PRODUTO CADASTRADO E LIBERADOS', () => {
        cy.allure().tag("Entrega de Produto", "Produto", "Funcionario", "Entrega normal", "Validação");
        cy.allure().owner("Luiz Henrique T.");

        const realizarTeste = () => {
            cy.visit('/entrega_produtos');

            cy.task('getFuncionarioCriado1').then(data => {
                cy.get('#tutorial-entrega-funcionario input[name="funcionario_id"]').type(data.funcionario.nome).wait(700).type('{enter}');

                cy.task('getProdutoCriado1').then(data => {
                    const qtdeEntrega = data.tipoProduto.informar_quantidade_na_entrega;
                    const produtoId = data.produto.id;
                    const qtdeEntregaProduto = data.produto.qt_entrega;

                    cy.intercept('GET', `/get_produto?id=${produtoId}`).as('getProduto');
                    cy.request({
                        method: 'GET',
                        url: `/get_produto?id=${produtoId}`
                    }).then((response) => {
                        const gradeId = response.body.grades[0].grade_id;

                        cy.request({
                            method: 'POST',
                            url: Cypress.env('API_DUAPI'),
                            headers: {
                                'Content-Type': 'application/json',
                                'Token': token
                            },
                            body: {
                                produto_id: produtoId,
                                quantidade: qtdeEntregaProduto,
                                grade_id: gradeId,
                                fornecedor_produto_id: produtoId,
                                numero_nota: "",
                                serie: "",
                                tipo_movimento: "E",
                                empresa_id: 1,
                                deposito_id: 1,
                                observacao: "MOVIMENTAÇÃO AUTOMATICA"
                            },
                            failOnStatusCode: false
                        });
                    });

                    if (qtdeEntrega === 'N') {
                        cy.get('a.btn-entrega').click().wait(1000);
                        cy.get('a.btn-entrega').click();

                        cy.get('.produto_descricao', { timeout: 10000 }).should('be.visible');

                        cy.get('#btnSalvar').click();
                        cy.get('#validacao_senha').type('123');
                        cy.get('.btn').contains('Validar').click();
                    } else {
                        cy.get('a.btn-entrega').click().wait(1000);
                        cy.get('a.btn-entrega').click();

                        cy.get('#seleciona_quantidade').click().wait(950);
                        cy.get('.produto_descricao', { timeout: 10000 }).should('be.visible');

                        cy.get('#btnSalvar').click();
                        cy.get('#validacao_senha').type('123');
                        cy.get('.btn').contains('Validar').click();
                    }
                })
            });
        }

        configurarParametros('config.json', {
        }, '/entrega_produtos', realizarTeste);
    });

});

function gerarDataAtual(hora = false, nascimento = false) {
    var dataAtual = new Date();
    var dd = String(dataAtual.getDate()).padStart(2, '0');
    var mm = String(dataAtual.getMonth() + 1).padStart(2, '0');
    var yyyy = dataAtual.getFullYear();

    var H = String(dataAtual.getHours()).padStart(2, '0');
    var m = String(dataAtual.getMinutes()).padStart(2, '0');
    var i = String(dataAtual.getSeconds()).padStart(2, '0');

    if (nascimento === true) {
        yyyy -= 20;
    }

    if (hora === true) {
        dataAtual = dd + '/' + mm + '/' + yyyy + ' ' + H + ':' + m + ':' + i;
    } else {
        dataAtual = dd + '/' + mm + '/' + yyyy;
    }

    return dataAtual;
}

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function inserirRandom(min, max, digit = 0) {
    var numRandom = [];
    var numString = '';
    var num = null;
    var i = 0;

    if (digit !== 0) {
        for (i = 0; i < digit; i++) {
            num = gerarNumeroAleatorio(min, max);
            numRandom.push(num);
        }

        numString = numRandom.join('');
        return numString
    }

    return '0000';
}

function inserirEpoch() {
    var timestamp = new Date().getTime();
    return timestamp;
}

function inserirTipoProduto() {
    var numero = gerarNumeroAleatorio(1, 3);

    switch (numero) {
        case 1:
            return 'EPI';
            break;
        case 2:
            return 'Consumíveis';
            break;
        case 3:
            return 'Uniforme'
            break;
        default:
            return null;
            break;
    }
}

function inserirDataRandom(dataValida = 'A') {
    var dataAtual = new Date();
    var yyyy = dataAtual.getFullYear();

    var dia = gerarNumeroAleatorio(1, 30);
    var mes = gerarNumeroAleatorio(1, 12);

    var ano = gerarNumeroAleatorio(1, 3);

    if (dataValida === 'S') {
        ano = 3;
    }

    switch (ano) {
        case 1:
            yyyy -= gerarNumeroAleatorio(1, 2);
            break;
        case 2:
            yyyy = yyyy;
            break;
        case 3:
            yyyy += gerarNumeroAleatorio(1, 2);
            break;
        default:
            null;
            break;
    }

    if (dia < 10) {
        dia = '0' + dia;
    }

    if (mes < 10) {
        mes = '0' + mes;
    }

    dataAtual = dia + '/' + mes + '/' + yyyy;

    return dataAtual;
}