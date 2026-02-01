import { criarUsuario } from "./service.js";
import { hashSenha, gerarToken, tokenValido, getUsuarioDoToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    renderizarApp();
});

function renderizarApp() {
    const container = document.getElementById("container-form");

    if (!container) {
        console.error("Elemento 'container-form' não encontrado!");
        return;
    }

    if (tokenValido()) {
        gerarHome(container);
    } else {
        gerarLogin(container);
    }
}

function gerarLogin(container) {
    container.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "login-cadastro";
    titulo.id = "login-titulo";
    titulo.textContent = "Login";

    const form = document.createElement("form");
    form.id = "formulario-login";

    const divEmail = document.createElement("div");
    divEmail.className = "form-group";

    const labelEmail = document.createElement("label");
    labelEmail.textContent = "E-mail:";
    labelEmail.htmlFor = "email-login";

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "email-login";
    inputEmail.name = "email";
    inputEmail.required = true;
    inputEmail.placeholder = "seu@email.com";

    divEmail.appendChild(labelEmail);
    divEmail.appendChild(inputEmail);

    const divSenha = document.createElement("div");
    divSenha.className = "form-group";

    const labelSenha = document.createElement("label");
    labelSenha.textContent = "Senha:";
    labelSenha.htmlFor = "senha-login";

    const inputSenha = document.createElement("input");
    inputSenha.type = "password";
    inputSenha.id = "senha-login";
    inputSenha.name = "senha";
    inputSenha.required = true;
    inputSenha.placeholder = "Digite sua senha";

    divSenha.appendChild(labelSenha);
    divSenha.appendChild(inputSenha);

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Entrar";
    button.className = "btn-login";

    const linkCadastro = document.createElement("p");
    linkCadastro.className = "link-cadastro";
    linkCadastro.innerHTML =
        'Não tem conta? <a href="#" id="link-cadastro">Cadastre-se</a>';

    form.appendChild(divEmail);
    form.appendChild(divSenha);
    form.appendChild(button);

    container.appendChild(titulo);
    container.appendChild(form);
    container.appendChild(linkCadastro);

    form.addEventListener("submit", login);

    document
        .getElementById("link-cadastro")
        .addEventListener("click", (e) => {
            e.preventDefault();
            gerarCadastro(container);
        });
}

function gerarCadastro(container) {
    container.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.className = "login-cadastro";
    titulo.id = "cadastro-titulo";
    titulo.textContent = "Cadastro";

    const form = document.createElement("form");
    form.id = "formulario-cadastro";
    form.method = "POST";

    const campos = [
        { tipo: "text", id: "nome-cadastro", nome: "nome", label: "Nome completo:", obrigatorio: true },
        { tipo: "email", id: "email-cadastro", nome: "email", label: "E-mail:", obrigatorio: true },
        { tipo: "password", id: "senha-cadastro", nome: "senha", label: "Senha:", obrigatorio: true },
        { tipo: "date", id: "dtNascimento-cadastro", nome: "dtNascimento", label: "Data de Nascimento:", obrigatorio: false },
        { tipo: "text", id: "cep-cadastro", nome: "cep", label: "CEP:", obrigatorio: false },
        { tipo: "text", id: "numero-cadastro", nome: "numero", label: "Número:", obrigatorio: false },
        { tipo: "text", id: "complemento-cadastro", nome: "complemento", label: "Complemento:", obrigatorio: false }
    ];

    campos.forEach((campo) => {
        const div = document.createElement("div");
        div.className = "form-group";

        const label = document.createElement("label");
        label.textContent = campo.label;
        label.htmlFor = campo.id;

        const input = document.createElement("input");
        input.type = campo.tipo;
        input.id = campo.id;
        input.name = campo.nome;
        input.required = campo.obrigatorio;

        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Cadastrar";
    button.className = "btn-cadastro";

    const linkLogin = document.createElement("p");
    linkLogin.className = "link-login";
    linkLogin.innerHTML =
        'Já tem conta? <a href="#" id="link-login">Faça login</a>';

    form.appendChild(button);
    form.addEventListener("submit", cadastro);

    container.appendChild(titulo);
    container.appendChild(form);
    container.appendChild(linkLogin);

    document.getElementById("link-login").addEventListener("click", (e) => {
        e.preventDefault();
        gerarLogin(container);
    });
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarSenha(senha) {
    return senha.length >= 6;
}

function validarDataNascimento(data) {
    if (!data) return true;

    const nascimento = new Date(data);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const fezAniversario =
        hoje.getMonth() > nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() >= nascimento.getDate());

    if (!fezAniversario) idade--;

    return idade >= 13 && nascimento < hoje;
}

function validarCEP(cep) {
    return /^\d{5}-?\d{3}$/.test(cep);
}

function validarNumero(numero) {
    return /^\d+$/.test(numero) && Number(numero) > 0;
}

async function cadastro(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const dados = {
        nome: formData.get("nome")?.trim(),
        email: formData.get("email")?.trim(),
        senha: formData.get("senha")?.trim(),
        dtNascimento: formData.get("dtNascimento"),
        cep: formData.get("cep")?.trim(),
        numero: formData.get("numero")?.trim(),
        complemento: formData.get("complemento")?.trim()
    };

    const erros = [];

    if (buscarUsuarioPorEmail(dados.email)) {
        erros.push("E-mail já registrado");
    }

    if (!dados.nome || dados.nome.length < 3) {
        erros.push("Nome deve ter pelo menos 3 caracteres");
    }

    if (!dados.email || !validarEmail(dados.email)) {
        erros.push("E-mail inválido");
    }

    if (!dados.senha || !validarSenha(dados.senha)) {
        erros.push("Senha deve ter no mínimo 6 caracteres");
    }

    if (dados.dtNascimento && !validarDataNascimento(dados.dtNascimento)) {
        erros.push("Data de nascimento inválida");
    }

    if (dados.cep && !validarCEP(dados.cep)) {
        erros.push("CEP inválido");
    }

    if (!dados.numero || !validarNumero(dados.numero)) {
        erros.push("Número inválido");
    }

    if (erros.length) {
        alert(erros.join("\n"));
        return;
    }

    try {
        const usuario = await criarUsuario(dados);
        salvarUsuarioLocalStorage(usuario);
        alert("Cadastro realizado com sucesso!");
        renderizarApp()
    } catch (error) {
        console.error(error);
    }
}

function salvarUsuarioLocalStorage(usuario) {
    const usuarios = obterUsuariosLocalStorage();
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obterUsuariosLocalStorage() {
    const data = localStorage.getItem("usuarios");
    return data ? JSON.parse(data) : [];
}

function buscarUsuarioPorEmail(email) {
    if (!email) return null;

    const usuarios = obterUsuariosLocalStorage();
    return usuarios.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
    ) || null;
}

function logout() {
    localStorage.removeItem("token");
}

async function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email")?.trim();
    const senha = formData.get("senha")?.trim();

    if (!email || !senha) {
        alert("Preencha e-mail e senha");
        return;
    }

    if (!validarEmail(email)) {
        alert("E-mail inválido");
        return;
    }

    const usuario = buscarUsuarioPorEmail(email);
    if (!usuario) {
        alert("Usuário não encontrado");
        return;
    }

    const senhaHash = await hashSenha(senha);

    if (usuario.senha !== senhaHash) {
        alert("Senha incorreta");
        return;
    }

    const token = gerarToken(usuario);
    logout();
    localStorage.setItem("token", token);

    renderizarApp();
}

const token = localStorage.getItem("token");

if (token && tokenValido()) {
    gerarHome();
}

function gerarHome() {
    const container = document.getElementById("container-form");
    container.innerHTML = "";

    const usuario = getUsuarioDoToken();

    if (!usuario) {
        alert("Sessão inválida");
        localStorage.removeItem("token");
        location.reload();
        return;
    }

    const titulo = document.createElement("h1");
    titulo.className = "login-cadastro";
    titulo.textContent = "Bem-vindo 👋";

    const infoEmail = document.createElement("p");
    infoEmail.className = "sucesso-mensagem";
    infoEmail.textContent = `E-mail: ${usuario.email}`;

    const infoId = document.createElement("p");
    infoId.style.textAlign = "center";
    infoId.style.color = "#666";
    infoId.textContent = `ID do usuário: ${usuario.sub}`;

    const btnLogout = document.createElement("button");
    btnLogout.className = "btn-login";
    btnLogout.textContent = "Sair";

    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("token");
        location.reload();
    });

    container.appendChild(titulo);
    container.appendChild(infoEmail);
    container.appendChild(infoId);
    container.appendChild(btnLogout);
}
