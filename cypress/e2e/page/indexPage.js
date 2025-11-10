import searchElements from "../../fixtures/searchElements.json";
import { baseUrl } from "../../support/e2e";

export class IndexPage {
  visit() {
    cy.visit("https://www.pcphom.com.br");
  }

  preencherCamposBasicos(objeto, processo, orgao) {
    cy.get(searchElements.search.objeto).type(objeto);
    cy.get(searchElements.search.processo).type(processo);
    cy.get(searchElements.search.orgao).type(orgao);
  }

  aguardaCarregamento() {
    cy.get(searchElements.container.innerContainer, { timeout: 10000 })
      .should("be.visible")
      .and("exist");
  }

  abrirBuscaAvancada() {
    cy.get(searchElements.search.buscaAvancada).click();
    // cy.get(searchElements.search.buscaAvancada).then(($bt) => {
    //   // valida se ja está aberta
    //   if ($bt.hasClass("open")) {
    //     throw new Error(
    //       "Erro: Tentativa de abrir busca avançada, mas ela já está aberta."
    //     );
    //   }
    //   cy.wrap($bt).click();
    //   cy.get(searchElements.search.blocoBuscaAvancada)
    //     .should("be.visible")
    //     .then(() => {
    //       cy.log("Busca avançada aberta com sucesso");
    //     });
    // });
  }

  fecharBuscaAvancada() {
    cy.get(searchElements.search.buscaAvancada).then(($btn) => {
      if (!$btn.hasClass("open")) {
        throw new Error(
          "Erro: Tentativa de fechar busca avançada, mas ela já está fechada."
        );
      }
      // Caso contrário, fecha e valida o desaparecimento do bloco
      cy.wrap($btn).click();
      cy.get(searchElements.search.blocoBuscaAvancada)
        .should("not.be.visible")
        .then(() => {
          cy.log("Busca avançada fechada com sucesso");
        });
    });
  }

  selecionarFiltrosAvancados({
    status,
    modalidade,
    realizacao,
    julgamento,
    uf,
  }) {
    if (status) cy.get(searchElements.selects.status).select(status);
    if (modalidade)
      cy.get(searchElements.selects.modalidade).select(modalidade);
    if (realizacao)
      cy.get(searchElements.selects.realizacao).select(realizacao);
    if (julgamento)
      cy.get(searchElements.selects.julgamento).select(julgamento);
    if (uf) cy.get(searchElements.selects.uf).select(uf);
  }

  selecionarFiltro(tipo, valor) {
    cy.log(`Selecionando filtro: ${tipo} = ${valor}`);

    const seletor = searchElements.search[tipo] || searchElements.selects[tipo];
    if (!seletor) {
      throw new Error(`Filtro "${tipo}" não mapeado em searchElements.json`);
    }

    // Espera o elemento existir e estar visível
    cy.get(seletor, { timeout: 10000 })
      .should("exist")
      .should("be.visible")
      .then(() => {
        // Rebusca o elemento para garantir estabilidade (evita re-render)
        cy.get(seletor).then(($el) => {
          const tagName = $el.prop("tagName").toLowerCase();

          if (tagName === "select") {
            cy.wrap($el)
              .should("be.enabled")
              .select(valor, { force: true })
              .then(() => {
                cy.log(`Select "${tipo}" selecionado: ${valor}`);
              });
          } else {
            cy.wrap($el)
              .clear({ force: true })
              .type(valor, { force: true })
              .then(() => {
                cy.log(`Input "${tipo}" preenchido: ${valor}`);
              });
          }
        });
      });
  }

  verificarFiltrosPadrao() {
    cy.log("Verificando filtros padrão (reset inicial)");

    const filtros = [
      "status",
      "modalidade",
      "realizacao",
      "julgamento",
      "uf",
      "municipio",
    ];

    filtros.forEach((tipo) => {
      const seletor = searchElements.search[tipo];
      if (!seletor) return;

      cy.get(seletor)
        .should("exist")
        .invoke("val")
        .then((val) => {
          cy.log(`Filtro "${tipo}" = ${val || "vazio"}`);
          expect(val === "" || val === null, `Filtro ${tipo} está padrão`).to.be
            .true;
        });
    });
  }

  selecionarFiltrosAvancados(filtros) {
    cy.log("Selecionando múltiplos filtros avançados");

    Object.entries(filtros).forEach(([tipo, valor]) => {
      const seletor = searchElements.selects[tipo];
      if (!seletor) {
        cy.log(`Filtro "${tipo}" não encontrado em searchElements.json`);
        return;
      }

      cy.get(seletor)
        .should("exist")
        .select(valor, { force: true })
        .then(() => {
          cy.log(`Filtro "${tipo}" selecionado com sucesso: ${valor}`);
        });
    });
  }

  clicarBuscar() {
    cy.get(searchElements.search.botaoBuscar).click();
  }

  selecionarFiltrosAleatorios() {
    const selects = [
      { id: "#Status", nome: "Status" },
      { id: "#Modalidade", nome: "Modalidade" },
      { id: "#Realizacao", nome: "Realização" },
      { id: "#julgamento", nome: "Julgamento" },
      { id: "#UF", nome: "UF" },
    ];

    selects.forEach(({ id, nome }) => {
      cy.get(`${id} option`).then((options) => {
        const validas = [...options].filter((o) => o.value !== "0");
        const aleatoria = validas[Math.floor(Math.random() * validas.length)];

        cy.get(id).select(aleatoria.value);

        // Log para console e relatório
        cy.log(`${nome} selecionado: ${aleatoria.text}`);
        console.log(`${nome}: ${aleatoria.text} (valor: ${aleatoria.value})`);
      });
    });
  }
}
