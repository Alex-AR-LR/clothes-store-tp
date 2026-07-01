"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactInfo = [
  {
    icon: Location01Icon,
    title: "Dirección",
    value: "Av. Siempre Viva 742, CABA",
  },
  { icon: Call02Icon, title: "Teléfono", value: "+54 11 5555-5555" },
  { icon: Mail01Icon, title: "Email", value: "hola@urbana.com" },
  { icon: Clock01Icon, title: "Horario", value: "Lun a Sáb de 9 a 20 hs" },
];

const subjects = [
  "Consulta general",
  "Estado de mi pedido",
  "Cambios y devoluciones",
  "Otro",
];

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // INTEGRACIÓN BACKEND: enviar el mensaje a la API (POST /contact) o a un
    // servicio de emails. Por ahora solo mostramos una confirmación.
    setSending(false);
    e.currentTarget.reset();
    toast.success("Mensaje enviado", {
      description: "Te responderemos a la brevedad. ¡Gracias por escribirnos!",
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Contacto</h1>
        <p className="text-muted-foreground">
          ¿Tenés una consulta? Escribinos y te respondemos lo antes posible.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Envianos un mensaje</CardTitle>
            <CardDescription>
              Completá el formulario y nos pondremos en contacto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="subject">Asunto</Label>
                <Select name="subject" defaultValue={subjects[0]}>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder="Elegí un asunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start gap-3">
                  <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={info.icon} className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{info.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden pt-0">
            <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center text-sm">
              <HugeiconsIcon icon={Location01Icon} className="mr-2 size-5" />
              Mapa de ubicación
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
