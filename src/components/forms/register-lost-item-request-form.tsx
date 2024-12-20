"use client";

import { cpfMask } from "@/lib/utils";
import { registerLostItemRequest } from "@/use-cases/register-lost-item-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const registerLostItemSchemaForm = z.object({
  description: z.string({ message: "Informe uma descrição valida", required_error: "Informe uma descrição valida" }).min(10).max(100),
  title: z.string().min(10).max(50),
  lostLocationDescription: z.string().min(10).max(100),
  contactEmail: z.string().email(),
  cpf: z.string().regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/),
});
type RegisterLostItemSchema = z.infer<typeof registerLostItemSchemaForm>;

export function RegisterLostItemRequest() {
  const form = useForm<RegisterLostItemSchema>({
    values: {
      description: "",
      lostLocationDescription: "",
      title: "",
      cpf: "",
      contactEmail: "",
    },
    resolver: zodResolver(registerLostItemSchemaForm),
    reValidateMode: "onChange",
  });

  async function handleRegisterLostItem(payload: RegisterLostItemSchema) {
    const results = await registerLostItemRequest({
      description: payload.description,
      lostLocationDescription: payload.lostLocationDescription,
      title: payload.title,
      cpf: payload.cpf,
    });

    if (!results.success) {
      if (results.exception.code === "QUOTE_LIMIT_EXCEEDED") {
        toast.error("Limite de solicitações atingido", {
          description: "Você só pode registrar um item perdido a cada 8 horas.",
        });
      } else {
        toast.error("Erro ao registrar item perdido");
      }

      return;
    }

    toast.success("Item perdido registrado com sucesso", {
      description: "Enviaremos um e-mail para você quando encontrarmos o item",
      duration: 5000,
    });
  }

  if (form.formState.isSubmitSuccessful) {
    return (
      <div className="flex justify-center items-center text-center flex-col mt-10 gap-4">
        <h2 className="text-2xl">Solicitação Enviada</h2>
        <CheckCircle className="size-10 text-emerald-500" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4 flex justify-center gap-10 max-w-[800px] w-full px-10" onSubmit={form.handleSubmit(handleRegisterLostItem)}>
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
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificação (CPF)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: 000-000-000-00 "
                    {...field}
                    onChange={(e) => {
                      e.target.value = cpfMask(e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail de contato</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ex: @gmail.com" {...field} />
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
            name="lostLocationDescription"
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

          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader className="size-5 animate-spin" /> : "Registar item perdido"}
          </Button>
        </section>
      </form>
    </Form>
  );
}
