import { useUser } from "~/composable/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser();

  if(user.value !== null) return;

  const route = to.path.split("/")[2];
  let isProtected = false,
    forward = "";

  for (let crrRoute of route) {
    if (crrRoute === "authenticated") {
      isProtected = true;
      continue;
    }
    if(isProtected) {
        forward += `/${crrRoute}`;
    }
  }

    if (isProtected) {
        return navigateTo(`/authenticated?forward=${forward}`);
    }
});
