// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const plans = [
//     {
//       id: "starter",
//       name: "Starter",
//       credits: 10,
//       price: 990,
//       highlight: false,
//     },
//     {
//       id: "pro",
//       name: "Pro",
//       credits: 30,
//       price: 2490,
//       highlight: true,
//     },
//     {
//       id: "ultra",
//       name: "Ultra",
//       credits: 100,
//       price: 7990,
//       highlight: false,
//     },
//   ];

//   for (const plan of plans) {
//     await prisma.plan.upsert({
//       where: { id: plan.id },
//       update: plan,
//       create: plan,
//     });
//   }

//   const prompts = [
//     {
//       title: "Resumo acadêmico",
//       description:
//         "Ideal para gerar resumos de artigos científicos ou textos técnicos.",
//       content:
//         "Resuma o conteúdo abaixo de forma clara, destacando os principais conceitos, objetivos, metodologia e conclusões.",
//       category: "Educação",
//       premium: false,
//     },
//     {
//       title: "Explicação didática",
//       description:
//         "Transforma textos complexos em explicações fáceis de entender, como um professor faria.",
//       content:
//         "Explique o conteúdo abaixo de forma didática, como se estivesse ensinando para um iniciante. Use exemplos e linguagem simples.",
//       category: "Educação",
//       premium: true,
//     },
//     {
//       title: "Post para redes sociais",
//       description:
//         "Converte ideias em textos curtos, chamativos e com tom informal.",
//       content:
//         "Transforme o conteúdo a seguir em um post atrativo para Instagram, com tom leve, divertido e direto ao ponto.",
//       category: "Redes sociais",
//       premium: true,
//     },
//     {
//       title: "Resumo executivo",
//       description:
//         "Gera um resumo objetivo para uso em relatórios empresariais e apresentações de resultados.",
//       content:
//         "Crie um resumo executivo com foco em objetivos, resultados e próximos passos. Seja conciso e mantenha um tom profissional.",
//       category: "Negócios",
//       premium: true,
//     },
//     {
//       title: "Resumo para apresentação",
//       description:
//         "Converte textos longos em tópicos para slides de apresentação.",
//       content:
//         "Converta o conteúdo abaixo em tópicos claros e objetivos que podem ser usados em uma apresentação de slides.",
//       category: "Negócios",
//       premium: false,
//     },
//     {
//       title: "Reescrever com tom formal",
//       description:
//         "Ajusta o conteúdo para uma linguagem mais formal e adequada a contextos institucionais.",
//       content:
//         "Reescreva o conteúdo abaixo utilizando linguagem formal, com vocabulário técnico e estrutura clara. Ideal para comunicações institucionais.",
//       category: "Comunicação",
//       premium: true,
//     },
//     {
//       title: "Resumo com storytelling",
//       description:
//         "Gera um resumo com narrativa envolvente, como uma história contada.",
//       content:
//         "Reescreva o conteúdo abaixo no formato de storytelling, com início, desenvolvimento e conclusão. Use uma narrativa envolvente para transmitir a ideia central.",
//       category: "Criativo",
//       premium: true,
//     },
//     {
//       title: "Resumo para e-mail",
//       description:
//         "Converte informações em um e-mail claro, direto e bem estruturado.",
//       content:
//         "Transforme o conteúdo a seguir em um e-mail profissional com introdução, corpo e conclusão. Mantenha o tom amigável e direto.",
//       category: "Comunicação",
//       premium: false,
//     },
//   ];

//   for (const prompt of prompts) {
//     await prisma.prompt.create({
//       data: prompt,
//     });
//   }

//   console.log("Seed concluído.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
