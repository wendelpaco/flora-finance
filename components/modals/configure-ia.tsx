// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { User } from "@prisma/client";
// import { useState, useTransition, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// type Prompt = {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   premium: boolean;
// };

// export function ConfigureIAModal({
//   isOpen,
//   onClose,
//   user: userData,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   user: User;
// }) {
//   const [model, setModel] = useState(
//     userData.preferredModel ?? "gpt-3.5-turbo"
//   );
//   const [tone, setTone] = useState(userData.preferredTone ?? "neutral");
//   const [format, setFormat] = useState(
//     userData.preferredFormat ?? "paragraphs"
//   );
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   const [prompts, setPrompts] = useState<Prompt[]>([]);

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       const res = await fetch("/api/prompts");
//       const data = await res.json();
//       setPrompts(data);
//     };
//     fetchPrompts();
//   }, []);

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-md">
//         <DialogTitle>Configurações da IA</DialogTitle>
//         <DialogDescription>
//           Escolha o modelo, idioma e formato padrão.
//         </DialogDescription>

//         <div className="mt-4 space-y-4">
//           <div>
//             <label
//               htmlFor="model"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Modelo de IA
//             </label>
//             <select
//               id="model"
//               name="model"
//               value={model}
//               onChange={(e) => setModel(e.target.value)}
//               className="w-full rounded-md border border-gray-300 p-2 text-sm"
//             >
//               <option value="gpt-3.5-turbo">Padrão</option>
//               <option value="gpt-4-turbo">Avançado</option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="tone"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Tom do texto
//             </label>
//             <select
//               id="tone"
//               name="tone"
//               value={tone}
//               onChange={(e) => setTone(e.target.value)}
//               className="w-full rounded-md border border-gray-300 p-2 text-sm"
//             >
//               <option value="neutral">Neutro</option>
//               <option value="formal">Formal</option>
//               <option value="informal">Informal</option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="format"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Formato padrão de resumo
//             </label>
//             <select
//               id="format"
//               name="format"
//               value={format}
//               onChange={(e) => setFormat(e.target.value)}
//               className="w-full rounded-md border border-gray-300 p-2 text-sm"
//             >
//               <option value="paragraphs">Texto corrido</option>
//               <option value="bullets">Tópicos</option>
//               <option value="simple">Resumo direto</option>
//             </select>
//           </div>
//         </div>

//         {prompts.length > 0 && (
//           <div className="mt-8">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">
//               Categorias de prompts disponíveis
//             </h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
//               {Array.from(new Set(prompts.map((p) => p.category))).map(
//                 (category) => (
//                   <div
//                     key={category}
//                     className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
//                   >
//                     <span>{category}</span>
//                     <span className="text-gray-400">🔒</span>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         )}

//         <div className="mt-6 flex justify-end gap-2">
//           <button onClick={onClose} className="text-gray-500 hover:underline">
//             Cancelar
//           </button>
//           <button
//             onClick={() =>
//               startTransition(async () => {
//                 await fetch("/api/user/me", {
//                   method: "POST",
//                   body: JSON.stringify({ model, tone, format }),
//                 });
//                 router.refresh();
//                 toast.success("Preferências atualizadas com sucesso!");
//                 onClose();
//               })
//             }
//             className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
//           >
//             {isPending ? "Salvando..." : "Salvar"}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
