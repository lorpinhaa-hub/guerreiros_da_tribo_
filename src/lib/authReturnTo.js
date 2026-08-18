export function authReturnTo() {
  const params = new URLSearchParams(window.location.search);
  const retorno = params.get("returnTo");
  return retorno || "/inicio";
}
