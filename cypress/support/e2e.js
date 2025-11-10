// Ignora erros JavaScript vindos da aplicação testada
Cypress.on('uncaught:exception', (err, runnable) => {
  // Mostra o erro no log para depuração
  console.warn('⚠️ Ignorando erro do app:', err.message);

  // Ignora erros relacionados ao bundle do portal
  if (
    err.message.includes('is not a function') ||
    err.message.includes("Cannot set properties of null") ||
    err.message.includes("innerHTML") ||
    err.message.includes('intermediate value')
  ) {
    console.info('Ignorando erro interno do portal:', err.message);
    return false;
  }

  // Deixa outros erros quebrarem o teste
  return true;
});
import './commands'