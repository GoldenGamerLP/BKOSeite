<template>
  <div
    class="w-full mx-auto flex flex-col justify-center items-center h-[calc(100vh-10rem)]"
  >
    <span class="mb-4 flex items-center gap-2">
      <Cable class="size-14 text-primary" />
      <div class="grid">
        <h1 class="text-3xl font-bold">BKO-Seite</h1>
        <p class="text-lg text-muted-foreground leading-none">
          Hier kannst du dich registrieren oder einloggen.
        </p>
      </div>
    </span>
    <Tabs default-value="login" class="max-w-md w-full">
      <TabsList class="w-full">
        <TabsTrigger value="register" class="w-full">
          Registrieren
        </TabsTrigger>
        <TabsTrigger value="login" class="w-full"> Log-In </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen zur BKO-Seite!</CardTitle>
            <CardDescription>Bitte registriere dich.</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              :schema="registerSchema"
              @submit="onRegister"
              class="space-y-8"
            >
              <Button class="w-full mt-4" :disabled="loading" type="submit">
                <template v-if="loading">
                  <Loader2 class="size-4 animate-spin" /> Loading...
                </template>
                <template v-else>Registrieren</template>
              </Button>
            </AutoForm>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen zurück!</CardTitle>
            <CardDescription>Bitte logge dich ein.</CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm :schema="loginSchema" @submit="onLogin" class="space-y-8">
              <Button class="w-full mt-4" type="submit" :disabled="loading">
                <template v-if="loading">
                  <Loader2 class="size-4 animate-spin" /> Loading...
                </template>
                <template v-else>Einloggen</template>
              </Button>
            </AutoForm>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Cable, Loader2 } from "lucide-vue-next";
import { loginSchema, registerSchema } from "~/types/User";
import { useToast } from "~/components/ui/toast";

const { toast } = useToast();
const loading = ref(false);

onMounted(() => {
  const forwardedUrl = (useRoute().query.forward as string);
  if (forwardedUrl) {
    toast({
      title: "Bitte einloggen",
      description: "Du musst dich einloggen, um diese Seite zu sehen.",
      variant: "default",
    });
  }
})

const onLogin = async (values: Record<string, any>) => {
  try {
    loading.value = true;
    const response = await $fetch("/api/v1/auth/actions/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.success) {
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Willkommen zurück!",
        variant: "default",
      });

      await forward();
    } else {
      toast({
        title: "Fehler beim Einloggen",
        description: "Bitte überprüfe deine Eingaben und versuche es erneut.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Fehler beim Einloggen",
      description:
        error.statusText ||
        "Bitte überprüfe deine Eingaben und versuche es erneut.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const onRegister = async (values: Record<string, any>) => {
  try {
    loading.value = true;
    const response = await $fetch("/api/v1/auth/actions/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.success) {
      toast({
        title: "Erfolgreich registriert",
        description: "Willkommen zur BKO-Seite!",
        variant: "default",
      });

      await forward();
    } else {
      toast({
        title: "Fehler beim Registrieren",
        description: "Bitte überprüfe deine Eingaben und versuche es erneut.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Fehler beim Registrieren",
      description:
        error.statusText ||
        "Bitte überprüfe deine Eingaben und versuche es erneut.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const forward = async () => {
  const forwardedUrl = (useRoute().query.forward as string) || "/dashboard";
  await useRouter().push("/authenticated" + forwardedUrl);
};
</script>
