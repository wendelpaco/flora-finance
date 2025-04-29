"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Bot,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function Home() {
  const testimonials = [
    {
      name: "Isabela",
      avatar: "/emoji-avatar-2.png",
      text: "O Flora me ajudou demais a ver meus gastos. Mandar mensagem no WhatsApp facilitou demais a vida! Uma das melhores coisas que já fiz pra organizar minha vida financeira.",
    },
    {
      name: "Dan Bueno",
      avatar: "/emoji-avatar-3.png",
      text: "A praticidade de lançar despesas pelo WhatsApp é surreal! Tudo muito rápido e funcional.",
    },
    {
      name: "Gabriel",
      avatar: "/emoji-avatar-4.png",
      text: "Muito fácil de usar e já recebo os resumos direto no WhatsApp. Sensacional!",
    },
    {
      name: "Thais",
      avatar: "/emoji-avatar-2.png",
      text: "Depois que comecei a usar o Flora, passei a ter muito mais clareza sobre meus gastos. Recomendo demais!",
    },
    {
      name: "Rafael",
      avatar: "/emoji-avatar-3.png",
      text: "Flora AI parece que me conhece! As dicas fazem muito sentido pra minha rotina.",
    },
    {
      name: "Carla",
      avatar: "/emoji-avatar-4.png",
      text: "É como conversar com um amigo no WhatsApp, só que esse amigo entende de finanças!",
    },
    {
      name: "Lucas",
      avatar: "/emoji-avatar-1.png",
      text: "Comecei usando por curiosidade e agora não fico sem. Flora mudou minha forma de lidar com dinheiro.",
    },
    {
      name: "Bianca",
      avatar: "/emoji-avatar-2.png",
      text: "Muito prático. Já recomendei pra minha família inteira!",
    },
    {
      name: "Felipe",
      avatar: "/emoji-avatar-3.png",
      text: "Gosto da experiência minimalista e da forma como o Flora entrega os resumos.",
    },
  ];

  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;

    const scrollAmount = 340;
    let interval: NodeJS.Timeout | undefined;

    const startAutoScroll = () => {
      interval = setInterval(() => {
        if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }, 5000);
    };

    startAutoScroll();

    const pause = () => {
      if (interval) clearInterval(interval);
    };

    const resume = () => {
      pause();
      startAutoScroll();
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      if (interval) clearInterval(interval);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-[#0d1117] text-white">
      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-32 w-full bg-[#0d1117]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Partículas animadas na Hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle top-[20%] left-[10%]" />
          <div className="absolute w-1.5 h-1.5 bg-green-400/40 rounded-full animate-particle delay-2000 top-[40%] left-[30%]" />
          <div className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-particle delay-4000 top-[60%] left-[70%]" />
          <div className="absolute w-1.5 h-1.5 bg-white/20 rounded-full animate-particle delay-6000 top-[80%] left-[50%]" />
        </div>
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text mb-10 leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          Transforme suas finanças
          <br />
          com inteligência no WhatsApp
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl drop-shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          Gastos e ganhos organizados com inteligência artificial, no lugar que
          você mais usa: seu WhatsApp.
        </motion.p>
        <Button
          asChild
          className="relative w-full max-w-xs md:max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold px-8 py-7 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out transform hover:scale-105 ring-2 ring-green-400/50 animate-glow"
        >
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ✨ Comece sua jornada financeira grátis
          </a>
        </Button>
      </motion.section>

      {/* Destaque visual estilo MoneyMio */}
      <motion.section
        className="relative bg-[#0d1117] text-white py-16 md:py-20 px-6 flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Imagem central do usuário */}
        <div className="relative z-10 w-[400px] h-[500px] md:w-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/flora-hero.webp"
            alt="Pessoa feliz usando o Flora"
            fill
            className="object-cover ring-1 ring-white/10 will-change-transform transform scale-105 motion-safe:animate-parallax"
          />
        </div>

        {/* Balão: porcentagem */}
        <div className="absolute z-20 top-1/2 -translate-y-[130%] right-[10%] bg-white/5 backdrop-blur-lg border border-white/10 text-white px-4 py-3 rounded-xl shadow-md w-64 rotate-[6deg] balloon-float">
          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/emoji-avatar-1.png"
              alt="emoji"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-white font-bold text-xl">67%</span>
          </div>
          <p className="text-white/80 leading-snug">
            dos brasileiros não têm nenhuma reserva financeira para imprevistos.
          </p>
          <p className="text-white/50 text-[10px] mt-1">Segundo InfoMoney</p>
        </div>

        {/* Balão: prova social */}
        <div className="absolute z-20 top-1/2 -translate-y-[10%] left-[14%] bg-white/5 backdrop-blur-lg border border-white/10 text-white px-4 py-3 rounded-xl shadow-md w-64 -rotate-[5deg] balloon-float">
          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/emoji-avatar-2.png"
              alt="grupo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <Image
              src="/emoji-avatar-3.png"
              alt="grupo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <Image
              src="/emoji-avatar-4.png"
              alt="grupo"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
          <p className="text-white/80 leading-snug">
            Relatórios mensais e planejamento financeiro na palma da mão.
          </p>
        </div>

        {/* Selo de IA */}
        <div className="absolute z-20 top-[22%] -translate-y-1/2 right-[14%] bg-white/5 backdrop-blur-lg border border-white/10 text-white px-4 py-3 rounded-xl shadow-md w-64 rotate-[1deg] balloon-float">
          <div className="inline-flex items-center gap-2 text-green-300 font-semibold mb-1">
            Flora AI ✨
          </div>
          <p className="text-white/80 leading-snug">
            Inteligência Artificial integrada fornecendo consultoria financeira
            gratuita.
          </p>
        </div>
      </motion.section>

      {/* Benefícios */}
      <motion.section
        className="px-6 py-16 md:py-20 max-w-7xl mx-auto text-center bg-[#0d1117]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-12">
          Como o Flora Finance te ajuda?
        </h2>

        <div className="grid md:grid-cols-3 gap-16">
          <motion.div
            className="max-w-sm mx-auto flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl shadow hover:shadow-lg hover:scale-[1.01] transition p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-5xl mb-12">💬</div>
            <h3 className="text-2xl font-extrabold text-white mb-12">
              Registro rápido e fácil
            </h3>
            <p className="text-base text-gray-400 leading-relaxed">
              Basta enviar uma mensagem como &quot;gastei 40 reais no
              mercado&quot; e pronto — o Flora registra automaticamente.
              Simples, rápido e natural.
            </p>
          </motion.div>
          <motion.div
            className="max-w-sm mx-auto flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl shadow hover:shadow-lg hover:scale-[1.01] transition p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-5xl mb-12">📈</div>
            <h3 className="text-2xl font-extrabold text-white mb-12">
              Resumos inteligentes
            </h3>
            <p className="text-base text-gray-400 leading-relaxed">
              Descubra onde você mais gasta e quanto ganha, visualize tendências
              e receba alertas personalizados de acordo com seu perfil
              financeiro.
            </p>
          </motion.div>
          <motion.div
            className="max-w-sm mx-auto flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl shadow hover:shadow-lg hover:scale-[1.01] transition p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-5xl mb-12">🚀</div>
            <h3 className="text-2xl font-extrabold text-white mb-12">
              Experiência premium via WhatsApp
            </h3>
            <p className="text-base text-gray-400 leading-relaxed">
              Interface moderna, IA integrada e resumos automáticos que ajudam
              você a economizar de verdade. Tudo direto no WhatsApp.
            </p>
          </motion.div>
        </div>
        <div className="flex justify-center mt-16">
          <Button
            asChild
            className="relative w-full max-w-xs md:max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-110 text-white font-bold px-8 py-7 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-transform duration-300 ease-in-out transform hover:scale-105 ring-2 ring-green-400/50 animate-glow"
          >
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📲 Organize seu dinheiro hoje mesmo
            </a>
          </Button>
        </div>
      </motion.section>

      {/* Planos */}
      <motion.section
        className="px-6 py-16 md:py-20 bg-[#0d1117] max-w-7xl mx-auto text-center rounded-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-12">
          Escolha o plano ideal para você
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <a
            href="/inscricao"
            className="max-w-sm mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl shadow hover:shadow-lg hover:scale-[1.01] transition block cursor-pointer"
          >
            <h3 className="text-2xl font-extrabold text-white mb-8">
              Plano Free 🌱
            </h3>
            <ul className="text-base text-gray-400 leading-relaxed space-y-2 mb-8">
              <li>
                <span className="text-green-400">✔️</span> Registre seus gastos
                manualmente
              </li>
              <li>
                <span className="text-green-400">✔️</span> Registre seus ganhos
                manualmente
              </li>
              <li>
                <span className="text-green-400">✔️</span> Peça resumos manuais
                quando quiser
              </li>
              <li>❌ Sem resumos automáticos</li>
            </ul>
            <p className="text-base font-bold text-white">Gratuito</p>
          </a>

          <a
            href="/inscricao"
            className="max-w-sm mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl shadow hover:shadow-lg hover:scale-[1.01] transition block cursor-pointer"
          >
            <h3 className="text-2xl font-extrabold text-white mb-8">
              Plano Basic 💼
            </h3>
            <ul className="text-base text-gray-400 leading-relaxed space-y-2 mb-8">
              <li>
                <span className="text-green-400">✔️</span> Tudo do Free
              </li>
              <li>
                <span className="text-green-400">✔️</span> Registro de ganhos e
                visualização por categorias
              </li>
              <li>
                <span className="text-green-400">✔️</span> Resumos automáticos
                semanais
              </li>
              <li>
                <span className="text-green-400">✔️</span> Insights financeiros
                personalizados
              </li>
              <li>
                <span className="text-green-400">✔️</span> Acesso ao suporte por
                WhatsApp
              </li>
              <li>
                <span className="text-green-400">✔️</span> Relatórios detalhados
                por categoria
              </li>
              <li>
                <span className="text-green-400">✔️</span> Comparativo mensal de
                gastos
              </li>
            </ul>
            <p className="text-base font-bold text-white">R$ 29,90/mês</p>
          </a>

          <a
            href="/inscricao"
            className="max-w-sm mx-auto p-8 bg-white/5 border-2 border-green-400 rounded-2xl shadow-2xl hover:shadow-green-400/30 hover:scale-[1.01] transition transform relative ring-2 ring-green-400/60 block cursor-pointer"
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-400 text-sm text-black font-medium px-3 py-1 rounded-full shadow">
              Mais indicado pra você
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-8">
              Plano Pro 🚀
            </h3>
            <ul className="text-base text-gray-400 leading-relaxed space-y-2 mb-8">
              <li>
                <span className="text-green-400">✔️</span> Tudo do Basic
              </li>
              <li>
                <span className="text-green-400">✔️</span> Análise avançada de
                ganhos com gráficos comparativos
              </li>
              <li>
                ✨ <strong className="text-white">Consultoria com IA</strong>
              </li>
              <li>
                <span className="text-green-400">✔️</span> Acompanhamento
                contínuo
              </li>
              <li>
                <span className="text-green-400">✔️</span> Economia e metas
                automáticas
              </li>
              <li>
                📤 <strong className="text-white">Exportação de dados</strong>
              </li>
              <li>
                <span className="text-green-400">✔️</span> Planejamento
                financeiro avançado
              </li>
            </ul>
            <p className="text-base font-bold text-white">R$ 269,90/ano</p>
            <p className="text-xs text-gray-400 mt-1">(Economia de 25%)</p>
          </a>
        </div>
        <div className="flex justify-center mt-16">
          <Button
            asChild
            className="relative w-full max-w-xs md:max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 hover:ring-4 hover:ring-green-300 text-white font-bold px-8 py-7 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-transform duration-300 ease-in-out transform hover:scale-105 ring-2 ring-green-400/50 animate-glow"
          >
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ✅ Invista no seu futuro financeiro
            </a>
          </Button>
        </div>
      </motion.section>

      {/* Como funciona */}
      <motion.section
        className="px-6 py-16 md:py-20 max-w-6xl mx-auto text-center bg-[#0d1117]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-12">
          Como funciona?
        </h2>
        <motion.section
          className="flex flex-col md:flex-row items-center justify-center gap-16 px-6 py-20 max-w-7xl mx-auto text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Subtítulo premium */}
          <div className="w-full md:absolute md:top-0 md:left-0 md:translate-y-[-110%]">
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Integração via WhatsApp: Simples e Poderosa
            </motion.h2>
          </div>

          {/* Mockup da conversa */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-xl mx-auto flex flex-col gap-4">
            {/* Mensagens simuladas */}
            <div className="flex flex-col gap-3">
              {/* Mensagem do cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-end bg-white/20 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%]"
              >
                Recebi R$ 2000 de salário
              </motion.div>
              {/* Mensagem da Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-start bg-green-500 text-black p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]"
              >
                Receita de R$ 2000,00 adicionada à categoria Salário. Saldo
                atual: R$ 2000,00.
              </motion.div>
              {/* Mensagem do cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-end bg-white/20 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%]"
              >
                Paguei R$ 500 de aluguel
              </motion.div>
              {/* Mensagem da Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-start bg-green-500 text-black p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]"
              >
                Despesa de R$ 500,00 adicionada à categoria Moradia. Saldo
                atual: R$ 1500,00.
              </motion.div>
              {/* Mensagem do cliente (áudio animado) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-end bg-white/20 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%] flex items-center gap-2"
              >
                <motion.div
                  className="relative flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Pulso centralizado e menor */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeOut",
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-400/20" />
                  </motion.div>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="relative z-10 h-5 w-5 text-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path d="M6 4l12 6-12 6V4z" />
                  </motion.svg>
                </motion.div>
                <span className="relative z-10">
                  Áudio: comprei R$ 200 em supermercado
                </span>
              </motion.div>
              {/* Mensagem da Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-start bg-green-500 text-black p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]"
              >
                Áudio interpretado! Despesa de R$ 200,00 adicionada à categoria
                Alimentação. Saldo atualizado: R$ 1300,00.
              </motion.div>
              {/* Mensagem do cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-end bg-white/20 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%]"
              >
                Recebi R$ 150 de cashback
              </motion.div>
              {/* Mensagem da Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-start bg-green-500 text-black p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]"
              >
                Receita de R$ 150,00 adicionada à categoria Outros Ganhos. Saldo
                atual: R$ 1450,00.
              </motion.div>
              {/* Mensagem do cliente (áudio) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-end bg-white/20 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%] flex items-center gap-2"
              >
                <motion.div className="relative flex items-center">
                  {/* Pulso centralizado e menor */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeOut",
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-green-400/20" />
                  </motion.div>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="relative z-10 h-5 w-5 text-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path d="M6 4l12 6-12 6V4z" />
                  </motion.svg>
                </motion.div>
                <span className="relative z-10">
                  Áudio: gasto de R$ 80 em farmácia
                </span>
              </motion.div>
              {/* Mensagem da Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="self-start bg-green-500 text-black p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]"
              >
                Áudio transcrito! Despesa de R$ 80,00 adicionada à categoria
                Saúde. Saldo atualizado: R$ 1370,00.
              </motion.div>
            </div>
          </div>

          {/* Explicação em 4 etapas premium */}
          <div className="flex flex-col gap-10 max-w-lg w-full">
            <div className="group flex items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 transition-transform hover:scale-105 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">
                  1. Envie uma Mensagem
                </h4>
                <p className="text-gray-400 text-base">
                  Mande sua transação pelo WhatsApp de forma natural, como
                  <span className="text-white/80 font-mono ml-1">
                    gastei 40 reais no mercado
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 transition-transform hover:scale-105 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500">
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">
                  2. IA Processa a Informação
                </h4>
                <p className="text-gray-400 text-base">
                  Nossa inteligência artificial interpreta automaticamente sua
                  mensagem e categoriza.
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 transition-transform hover:scale-105 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500">
                <RefreshCw className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">
                  3. Atualização Automática
                </h4>
                <p className="text-gray-400 text-base">
                  Seus ganhos e despesas são atualizados em tempo real no
                  sistema.
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 transition-transform hover:scale-105 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">
                  4. Confirmação Imediata
                </h4>
                <p className="text-gray-400 text-base">
                  Você recebe uma confirmação instantânea via WhatsApp que a
                  transação foi registrada.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.section>

      {/* Seção de Perguntas Frequentes */}
      <motion.section
        className="px-6 py-20 max-w-4xl mx-auto text-center bg-[#0d1117]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-12">
          Perguntas Frequentes
        </h2>
        <div className="flex flex-col gap-6 text-left">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Como funciona a integração com o WhatsApp?
            </h3>
            <p className="text-gray-400 text-base">
              Você simplesmente envia uma mensagem com suas despesas ou
              receitas, e a Flora Finance cuida do resto!
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Posso enviar foto ou áudio?
            </h3>
            <p className="text-gray-400 text-base">
              Sim! Além de mensagens por texto, você pode enviar um áudio ou até
              uma foto, e a Flora Finance interpreta para você.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Quais categorias de gastos posso adicionar?
            </h3>
            <p className="text-gray-400 text-base">
              A Flora Finance categoriza seus gastos em diversas áreas como
              alimentação, transporte, saúde, lazer, e muito mais.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              É seguro usar a Flora Finance?
            </h3>
            <p className="text-gray-400 text-base">
              Sim! Priorizamos a segurança dos seus dados com criptografia e
              garantimos total privacidade.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Depoimentos reformulados */}
      <motion.section
        className="bg-[#0d1117] w-full px-0 pt-16 md:pt-20 pb-32 mx-auto text-center text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
          O que nossos usuários dizem:
        </h2>

        <p className="text-lg text-white/70 max-w-xl mx-auto mb-12">
          Faça parte dessa comunidade que está desfrutando do melhor apoio
          financeiro com suporte de IA.
        </p>
        <div className="relative">
          <div
            ref={testimonialsRef}
            className="relative flex gap-6 overflow-x-hidden scroll-smooth snap-x snap-mandatory px-6 md:px-10 lg:px-20 mt-8"
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                className="min-w-[320px] snap-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={item.avatar}
                    alt="Usuário"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-white/90 font-medium">{item.name}</span>
                </div>
                <div className="flex gap-1 mt-2 justify-center">
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <span
                        key={idx}
                        className="text-yellow-400 text-sm animate-pulse"
                      >
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-base text-white/90 leading-relaxed">
                  &#34;{item.text}&#34;
                </p>
              </motion.div>
            ))}
          </div>
          {/* Setas de navegação */}
          <button
            onClick={() =>
              testimonialsRef.current?.scrollBy({
                left: -340,
                behavior: "smooth",
              })
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-110 rounded-full p-3 backdrop-blur-md text-white shadow-lg hover:scale-110 transition-transform duration-300 ease-out"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() =>
              testimonialsRef.current?.scrollBy({
                left: 340,
                behavior: "smooth",
              })
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-110 rounded-full p-3 backdrop-blur-md text-white shadow-lg hover:scale-110 transition-transform duration-300 ease-out"
            type="button"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.section>

      <div className="flex justify-center mb-12">
        <Button
          asChild
          className="relative w-full max-w-xs md:max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 hover:shadow-3xl text-white font-bold px-8 py-7 text-xl rounded-full shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 ring-2 ring-green-400/50 animate-glow"
        >
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Tenha controle financeiro instantâneo
          </a>
        </Button>
      </div>

      {/* Demonstração do WhatsApp
      <motion.section
        className="relative px-6 py-32 bg-[#0d1117] text-white text-center overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold mb-10">
          Veja como é simples registrar seus gastos pelo WhatsApp
        </h2>
        <div className="flex justify-center">
          <div className="relative w-[300px] sm:w-[360px] md:w-[420px] rounded-[2.5rem] bg-[#0d1117] shadow-2xl overflow-hidden">
            <Image
              src="/mockup.png"
              alt="Simulação de conversa no WhatsApp"
              width={420}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </motion.section> */}

      {/* Rodapé */}
      <footer className="w-full bg-gradient-to-b from-transparent to-[#0d1117] text-white text-center px-6 py-12 text-sm flex flex-col items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-xs">
          <span>© {new Date().getFullYear()} Flora Finance</span>
          <span className="hidden md:inline">|</span>
          <span>Todos os direitos reservados</span>
        </div>
        <p className="text-white/50 text-xs max-w-md leading-relaxed">
          Feito com 💚 para ajudar você a organizar sua vida financeira de forma
          simples, prática e inteligente.
        </p>
      </footer>
    </main>
  );
}
