const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function buscarJSON(url, opcoes) {
  const resposta = await fetch(API + url, opcoes);
  const texto = await resposta.text();
  try {
    const json = JSON.parse(texto);
    if (!resposta.ok) throw json;
    return json;
  } catch (erro) {
    if (!resposta.ok) throw { erro: texto || resposta.statusText };
    return JSON.parse(texto);
  }
}
