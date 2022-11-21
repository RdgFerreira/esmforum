const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');

  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);

  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].texto).toBe('3 + 3 = ?');

  expect(perguntas[0].num_respostas).toBe(0);
  expect(perguntas[1].num_respostas).toBe(0);
  expect(perguntas[2].num_respostas).toBe(0);

  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de três respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');

  const perguntas_antes = modelo.listar_perguntas();

  modelo.cadastrar_resposta(perguntas_antes[0].id_pergunta, '2');
  modelo.cadastrar_resposta(perguntas_antes[0].id_pergunta, '3');
  modelo.cadastrar_resposta(perguntas_antes[1].id_pergunta, '4');

  const perguntas_depois = modelo.listar_perguntas();
  expect(perguntas_depois.length).toBe(3);

  expect(perguntas_depois[0].num_respostas).toBe(2);
  expect(perguntas_depois[1].num_respostas).toBe(1);
  expect(perguntas_depois[2].num_respostas).toBe(0);
});

test('Testando retorno de uma pergunta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');

  let perguntas = modelo.listar_perguntas();
  let pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);

  expect(pergunta.texto).toBe('1 + 1 = ?');
  expect(perguntas[0].num_respostas).toBe(0);

  modelo.cadastrar_resposta(pergunta.id_pergunta, '2');

  perguntas = modelo.listar_perguntas();
  pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);

  expect(perguntas[0].num_respostas).toBe(1);
});

test('Testando retorno de uma resposta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');

  let perguntas = modelo.listar_perguntas();
  let pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);

  modelo.cadastrar_resposta(pergunta.id_pergunta, '2');

  perguntas = modelo.listar_perguntas();
  const respostas = modelo.get_respostas(perguntas[0].id_pergunta);
  const num_respostas = modelo.get_num_respostas(perguntas[0].id_pergunta);

  expect(respostas[0].texto).toBe('2');
  expect(num_respostas).toBe(1);
});