export function safeReturnTo() {
  const params = new URLSearchParams(window.location.search);
  const retorno = params.get("returnTo");
  return retorno || "/inicio";
}
