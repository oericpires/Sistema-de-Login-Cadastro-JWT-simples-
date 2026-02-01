function base64UrlEncode(obj) {
    return btoa(JSON.stringify(obj))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(str));
}

export function gerarToken(usuario) {
    const header = {
        alg: "none",
        typ: "JWT"
    };

    const payload = {
        sub: usuario.id,
        email: usuario.email,
        cargo: usuario.cargo,
        exp: Date.now() + 1000 * 60 * 60
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    return `${encodedHeader}.${encodedPayload}.`;
}


export function getUsuarioDoToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const [, payload] = token.split(".");
    if (!payload) return null;

    return base64UrlDecode(payload);
}

export function tokenValido() {
    const dados = getUsuarioDoToken();
    return !!dados && dados.exp > Date.now();
}


export async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const dados = encoder.encode(senha);

    const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

