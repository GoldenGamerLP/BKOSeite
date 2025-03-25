import { useUser } from "~/composable/auth";

export default defineNuxtRouteMiddleware((to) => {
  const user = useUser();

  if (user.value !== null) return;
  if (to.path === '/authenticated') return;

  const routeParts = to.path.split("/");
  let isProtected = false,
    forward = "";

  for (let crrRoute of routeParts) {
    if (crrRoute === "authenticated") {
      isProtected = true;
      continue;
    }
    if (isProtected) {
      forward += `/${crrRoute}`;
    }
  }

  if (isProtected) {
    return navigateTo(`/authenticated?forward=${forward}`);
  }
});
