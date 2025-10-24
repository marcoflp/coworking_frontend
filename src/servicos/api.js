const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function buscarJSON(url, opcoes) {
  console.log('API URL:', API);
  console.log('Chamando:', API + url);
  try {
    const resposta = await fetch(API + url, opcoes);
    console.log('Status:', resposta.status);
    const texto = await resposta.text();
    console.log('Resposta:', texto);
    
    if (!texto) {
      if (!resposta.ok) throw { erro: `Erro ${resposta.status}: ${resposta.statusText}` };
      return [];
    }
    
    const json = JSON.parse(texto);
    if (!resposta.ok) throw json;
    return json;
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    throw erro;
  }
}
