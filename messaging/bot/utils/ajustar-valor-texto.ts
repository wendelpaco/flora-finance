const mapaExtenso: Record<string, number> = {
  um: 1,
  dois: 2,
  três: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
  cento: 100,
  duzentos: 200,
  trezentos: 300,
  quatrocentos: 400,
  quinhentos: 500,
  seiscentos: 600,
  setecentos: 700,
  oitocentos: 800,
  novecentos: 900,
  mil: 1000,
  milhão: 1000000,
  milhões: 1000000,
};

function ajustarValorTexto(texto: string): string {
  texto = texto.replace(/\b(\d+)\s*(mil)\b/gi, (_, numero) => {
    return (parseInt(numero) * 1000).toString();
  });

  texto = texto.replace(/\b(\d+)\s*(milhão|milhões)\b/gi, (_, numero) => {
    return (parseInt(numero) * 1000000).toString();
  });

  texto = texto.replace(
    /\b(cinquenta|cem|cem|duzentos|trezentos|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novecentos)\s*(mil|milhão|milhões)?\b/gi,
    (_, palavra, unidade) => {
      const numero = mapaExtenso[palavra.toLowerCase()];
      const multiplicador = unidade
        ? mapaExtenso[unidade.toLowerCase()] || 1
        : 1;
      return (numero * multiplicador).toString();
    }
  );

  return texto;
}

function formatarValorParaBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export { ajustarValorTexto, formatarValorParaBRL };
