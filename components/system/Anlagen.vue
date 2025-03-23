<template>
  <div>
    <Label for="anlagen">Anlagen</Label>
    <p class="text-muted-foreground">
      Maximal 2 Anlagen können hochgeladen werden.
    </p>
    <div class="my-2 flex flex-row space-x-2">
      <div
        v-if="!files"
        class="aspect-square w-min border-dashed rounded-lg border-border border-2 flex items-center p-4 flex-col"
      >
        <File class="size-6" />
        <span class="text-muted-foreground text-center"
          >Keine Anlagen vorhanden</span
        >
      </div>
      <div
        v-for="(file, index) in files"
        :key="index"
        class="aspect-square w-min border-dashed rounded-lg border-border border-2 flex items-center p-4 flex-col justify-center relative"
      >
        <File class="size-6" />
        <span class="text-muted-foreground text-center line-clamp-1">{{
          file.name
        }}</span>
        <span class="text-muted-foreground text-center line-clamp-1">{{
          formatSize(file.size)
        }}</span>
      </div>
      <div class="flex items-center flex-col justify-center">
        <Button
          variant="link"
          @click.prevent="open()"
          :disabled="files?.length >= 2"
        >
          <Cloud class="size-4" />
          Dokument hochladen
        </Button>
        <Button variant="link" @click.prevent="reset()">
          <Trash class="size-4" />
          Zurücksetzen
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { File, Cloud, Trash } from "lucide-vue-next";
import { useFileDialog } from "@vueuse/core";
import { useToast } from "../ui/toast";

const { toast } = useToast();

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: "image/*",
  multiple: true,
});

onChange((files) => {
  if (files && files.length > 2) {
    reset();
    toast({
      title: "Fehler",
      description: "Maximal 2 Anlagen können hochgeladen werden.",
      variant: "destructive",
    });
  }
});

const formatSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size > 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getFiles = () => {
  return files.value;
};

defineExpose({ getFiles });
</script>
