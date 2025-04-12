<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-3xl font-semibold">Willkommen auf der BKO-Verwaltungs-Seite!</h1>
        <p class="text-lg text-muted-foreground mb-4">Bitte melde dich an, um fortzufahren.</p>
        <Button>
            <NuxtLink to="/authenticated/dashboard" class="w-full">
                Anmelden
            </NuxtLink>
        </Button>
    </div>
</template>