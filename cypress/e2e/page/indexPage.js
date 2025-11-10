import searchElements from "../../fixtures/searchElements.json";

export class IndexPage {
  visit() {
    cy.visit("https://www.pcphom.com.br");
  }

  preencherCamposBasicos(objeto, processo, orgao) {
    cy.get(searchElements.search.objeto).type(objeto);
    cy.get(searchElements.search.processo).type(processo);
    cy.get(searchElements.search.orgao).type(orgao);
  }

  abrirBuscaAvancada() {
    cy.get(searchElements.search.buscaAvancada).click();
    cy.get(searchElements.search.blocoBuscaAvancada).should("be.visible");
  }

  fecharBuscaAvancada() {
    cy.get(searchElements.search.buscaAvancada).click();
    cy.get(searchElements.search.blocoBuscaAvancada).should("not.be.visible");
  }

  selecionarFiltrosAvancados({
    status,
    modalidade,
    realizacao,
    julgamento,
    uf,
  }) {
    if (status) cy.get(searchElements.selects.status).select(status);
    if (modalidade) cy.get(searchElements.selects.modalidade).select(modalidade);
    if (realizacao) cy.get(searchElements.selects.realizacao).select(realizacao);
    if (julgamento) cy.get(searchElements.selects.julgamento).select(julgamento);
    if (uf) cy.get(searchElements.selects.uf).select(uf);
  }

  clicarBuscar() {
    cy.get(searchElements.search.botaoBuscar).click();
  }
}
