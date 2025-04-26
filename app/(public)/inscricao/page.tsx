"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function SubscriptionPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "basic" | "pro" | null
  >(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white px-6 py-20">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Organização Financeira no seu WhatsApp
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl text-center max-w-2xl text-zinc-300 mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Preencha as informações e garanta total acesso ao seu assistente de
        finanças pessoais no WhatsApp. Mais dinheiro economizado, menos tempo
        perdido!
      </motion.p>

      {!showSuccess && (
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(true);
          }}
          className="w-full max-w-xl space-y-4 p-8 bg-zinc-900/70 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Input
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800/70 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 placeholder-zinc-400"
          />
          <Input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="bg-zinc-800/70 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 placeholder-zinc-400"
          />
          <Input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800/70 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 placeholder-zinc-400"
          />
          <Input
            placeholder="Código de indicação (opcional)"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="bg-zinc-800/70 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 placeholder-zinc-400"
          />

          <p className="text-xs text-zinc-400 text-center">
            Ao continuar você concorda com nossos{" "}
            <span className="underline">Termos de Uso</span> e{" "}
            <span className="underline">Políticas de Privacidade</span>.
          </p>

          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 animate-glow"
          >
            🚀 Comece agora mesmo
          </Button>
        </motion.form>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="w-full max-w-3xl mt-12 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-white"
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            Escolha seu plano ideal
          </h2>
          <p className="text-center text-zinc-400 mb-6">
            Garanta total acesso ao seu assistente de finanças pessoais com o
            plano ideal para você!
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <motion.div
              onClick={() => setSelectedPlan("free")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex-1 rounded-xl p-6 border shadow-lg transition-all duration-300 ${
                selectedPlan === "free"
                  ? "bg-green-900/70 border-green-400"
                  : "bg-zinc-800 border-green-600"
              } cursor-pointer`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="text-green-400">●</span> Plano Free
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Registre seus gastos e ganhos manualmente, e peça resumos sempre
                que quiser.
              </p>
              <p className="text-lg font-semibold text-white">Grátis</p>
              <p className="text-xs text-zinc-400">Sem resumos automáticos</p>
            </motion.div>
            <motion.div
              onClick={() => setSelectedPlan("basic")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex-1 rounded-xl p-6 border shadow-lg transition-all duration-300 ${
                selectedPlan === "basic"
                  ? "bg-yellow-900/70 border-yellow-400"
                  : "bg-zinc-800 border-yellow-600"
              } cursor-pointer`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="text-yellow-400">●</span> Plano Basic
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Copiloto Financeiro, interações ilimitadas, relatórios, suporte,
                insights e planejamento.
              </p>
              <p className="text-lg font-semibold text-white">R$29,90/mês</p>
              <p className="text-xs text-zinc-400">Cobrado mensalmente</p>
            </motion.div>
            <motion.div
              onClick={() => setSelectedPlan("pro")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex-1 rounded-xl p-6 border shadow-lg transition-all duration-300 ${
                selectedPlan === "pro"
                  ? "bg-blue-900/70 border-blue-500"
                  : "bg-zinc-800 border-zinc-700"
              } cursor-pointer`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="text-blue-400">●</span> Plano Pro
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Tudo do Basic mais consultoria, treinamento e renovação
                automática.
              </p>
              <p className="text-lg font-semibold text-white">R$269,90/ano</p>
              <p className="text-xs text-zinc-400">Cobrado anualmente</p>
            </motion.div>
          </div>

          <Button
            onClick={() => {
              if (selectedPlan) {
                window.location.href = "/dashboard";
              }
            }}
            disabled={!selectedPlan}
            className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:brightness-110 transition-all rounded-full text-white py-3 font-semibold text-lg ${
              !selectedPlan ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Confirmar plano e prosseguir
          </Button>
        </motion.div>
      )}
    </div>
  );
}
