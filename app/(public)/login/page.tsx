"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiOutlineLockClosed } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [authId, setAuthId] = useState<string | null>(null);

  const hasSignedIn = useRef(false);

  // Polling do status de autenticação
  const { data: statusData } = useQuery({
    queryKey: ["auth-status", authId],
    queryFn: async () => {
      if (!authId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WHATSAPP_URL_BOT}/api/auth/whatsapp/status/${authId}`
      );
      if (!res.ok) throw new Error("Erro ao checar status");
      return res.json();
    },
    enabled: !!authId,
    refetchInterval: 2000, // a cada 2 segundos
  });

  // Redireciona se status for confirmado
  useEffect(() => {
    if (
      statusData?.status === "CONFIRMED" &&
      authId &&
      phone &&
      !hasSignedIn.current
    ) {
      hasSignedIn.current = true;
      signIn("credentials", {
        phone,
        authId,
        redirect: true,
        callbackUrl: "/painel/visao-geral",
      });
    }
  }, [statusData, authId, phone]);

  const handleWhatsAppLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.match(/^[0-9]{10,15}$/)) {
      toast({
        title: "Digite um número de telefone válido.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const fullPhone = "55" + phone;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WHATSAPP_URL_BOT}/api/auth/whatsapp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone }),
        }
      );
      if (!response.ok) throw new Error("Erro ao enviar código");
      const data = await response.json();
      setAuthId(data.authId); // Salva o authId retornado
      toast({ title: "Código enviado para seu WhatsApp!" });
    } catch {
      toast({ title: "Erro ao enviar código", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <form
        onSubmit={handleWhatsAppLogin}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="bg-emerald-100 p-3 rounded-full">
            <HiOutlineLockClosed className="w-7 h-7 text-emerald-600" />
          </span>
          <h1 className="text-2xl font-extrabold text-emerald-700">
            Entrar com WhatsApp
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Digite seu número para receber o código de acesso.
          </p>
        </div>
        <Input
          type="tel"
          placeholder="Seu número com DDD (ex: 11999999999)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          maxLength={15}
          required
          className="text-lg"
          disabled={!!authId}
        />
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 w-full flex items-center justify-center gap-2 text-lg py-3"
          disabled={loading || !!authId}
        >
          <FaWhatsapp className="w-6 h-6" />
          {loading ? "Enviando código..." : "Receber código no WhatsApp"}
        </Button>
        {authId && (
          <div className="text-center text-emerald-700 text-sm mt-2 animate-pulse">
            Aguardando confirmação do código no WhatsApp...
          </div>
        )}
        <div className="text-center text-xs text-gray-400 mt-2">
          Você receberá um código via WhatsApp para acessar sua conta.
        </div>
      </form>
    </div>
  );
}
