"use client";

import { registerFoundItem } from "@/use-cases/register-found-item";
import { saveFoundImagesIntent } from "@/use-cases/save-foundItem-images-itent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageDropZone } from "../image-drop-zone";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(10).max(100),
  locationDescription: z.string().min(10).max(100),
  images: z.array(z.instanceof(File)).max(5),
});

type FormSchema = z.infer<typeof formSchema>;

export function RegisterFoundItemForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      description: "",
      images: [],
      locationDescription: "",
      title: "",
    },
    reValidateMode: "onChange",
  });

  async function handleRegisterItem(values: FormSchema) {
    const results = await registerFoundItem({
      title: values.title,
      description: values.description,
      locationDescription: values.locationDescription,
    });

    if (!results.success) {
      return toast.error("Erro ao registrar item encontrado");
    }

    const { foundItemId } = results.data;

    const haveImagesToSave = !!values.images.length;

    if (haveImagesToSave) {
      const { images } = values;

      const results = await saveFoundImagesIntent({
        foundItemId,
        images: images.map((item) => {
          return {
            contentType: item.type,
            filename: item.name,
          };
        }),
      });

      if (!results.success) {
        console.log(results.exception);

        return toast.error("Erro ao salvar imagens");
      }
      const { data: imagesStorageUrls } = results;

      const toastRef = toast.loading("Salvando imagens");

      for (const imageIntent of imagesStorageUrls) {
        const currentImage = images.find((item) => item.name === imageIntent.filename);

        const response = await fetch(imageIntent.uploadUrl, {
          method: "PUT",
          body: currentImage,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        if (!response.ok) {
          await response.json();

          console.log(response);

          return toast.error(`Erro ao salvar imagens ${imageIntent.filename}`);
        }
      }

      toast.dismiss(toastRef);

      toast.success("Item encontrado registrado com sucesso");
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4 flex justify-center gap-10 max-w-[1000px] w-full" onSubmit={form.handleSubmit(handleRegisterItem)}>
        <section className="flex-col gap-4 flex flex-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do item</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Garrafa de água" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição o item" {...field} />
                </FormControl>
                <FormDescription>Descreva o item de forma direta</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do local</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>Informe o local onde o viu pela ultima vez</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            {form.formState.isSubmitting ? <Loader className="size-5 animate-spin" /> : "Salvar item encontrado"}
          </Button>
        </section>

        <section className="flex flex-1">
          <ImageDropZone
            maxSizeMB={5}
            onFilesUpload={(images) => {
              form.setValue("images", images);
            }}
          />
        </section>
      </form>
    </Form>
  );
}
