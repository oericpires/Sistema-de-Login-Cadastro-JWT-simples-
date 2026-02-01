import { hashSenha } from "./auth.js";

export async function criarUsuario(dados = {}) {
    return {
        id: crypto.randomUUID(),
        nome: dados.nome ?? "",
        email: dados.email ?? "",
        senha: await hashSenha(dados.senha),
        dtNascimento: dados.dtNascimento ?? null,
        ativo: dados.ativo ?? true,
        livros: [],
        dtCriacao: new Date(),
        tipo: dados.tipo ?? "usuario",
        endereco: {
            cep: dados.cep ?? "",
            numero: dados.numero ?? "",
            complemento: dados.complemento ?? ""
        }
    };
}
