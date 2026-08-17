// src/api/base44Client.js

const API_URL = import.meta.env.VITE_BASE44_URL || "https://api.base44.com";
const API_KEY = import.meta.env.VITE_BASE44_KEY || "";

class Base44Client {
  constructor() {
    this.baseURL = API_URL;
    this.apiKey = API_KEY;
    this.token = localStorage.getItem("auth_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }

  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": this.token ? `Bearer ${this.token}` : "",
      "X-API-Key": this.apiKey,
      ...options.headers,
    };

    const res = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Autenticação
  auth = {
    me: () => this.request("/auth/me"),
    login: (email, senha) =>
      this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      }),
    register: (dados) =>
      this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(dados),
      }),
    logout: () => this.setToken(null),
  };

  // Entidades
  entities = {
    Socio: {
      list: (ordem = "-created_date", limite = 100) =>
        this.request(`/entities/Socio?ordem=${ordem}&limite=${limite}`),
      create: (dados) =>
        this.request("/entities/Socio", {
          method: "POST",
          body: JSON.stringify(dados),
        }),
      delete: (id) =>
        this.request(`/entities/Socio/${id}`, { method: "DELETE" }),
    },
    Evento: {
      list: (ordem = "-created_date", limite = 100) =>
        this.request(`/entities/Evento?ordem=${ordem}&limite=${limite}`),
      create: (dados) =>
        this.request("/entities/Evento", {
          method: "POST",
          body: JSON.stringify(dados),
        }),
      delete: (id) =>
        this.request(`/entities/Evento/${id}`, { method: "DELETE" }),
    },
    FotoGaleria: {
      list: (ordem = "-created_date", limite = 100) =>
        this.request(`/entities/FotoGaleria?ordem=${ordem}&limite=${limite}`),
      create: (dados) =>
        this.request("/entities/FotoGaleria", {
          method: "POST",
          body: JSON.stringify(dados),
        }),
      delete: (id) =>
        this.request(`/entities/FotoGaleria/${id}`, { method: "DELETE" }),
    },
  };

  // Integrações
  integrations = {
    Core: {
      SendEmail: (dados) =>
        this.request("/integrations/SendEmail", {
          method: "POST",
          body: JSON.stringify(dados),
        }),
    },
  };
}

export default new Base44Client();
