"use client";

import { useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Transaction } from "../../app/types/Transaction";

interface TransactionTableProps {
  transacoes: Transaction[];
}

export function TransactionTable({ transacoes }: TransactionTableProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [listaTransacoes, setListaTransacoes] = useState(transacoes);
  const itensPorPagina = 5;

  const transacoesPaginadas = listaTransacoes.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const totalPaginas = Math.ceil(listaTransacoes.length / itensPorPagina);

  function handleEditar(transacao: Transaction) {
    alert(`Editar transação: ${transacao.descricao}`);
  }

  function handleExcluir(transacao: Transaction) {
    setListaTransacoes((prev) => prev.filter((t) => t.id !== transacao.id));
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white">
        <thead className="bg-emerald-100">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Descrição
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Valor
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Tipo
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Categoria
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Pago
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Data
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {transacoesPaginadas.length > 0 ? (
            transacoesPaginadas.map((transacao) => (
              <tr
                key={transacao.id}
                className="border-b hover:bg-emerald-50 hover:scale-[1.01] hover:shadow-md transition-all duration-300"
              >
                <td className="py-2 px-4 text-sm text-gray-700">
                  {transacao.descricao}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {transacao.tipo === "GASTO" ? "-" : "+"} R${" "}
                  {transacao.valor.toLocaleString("pt-BR")}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {transacao.tipo === "GANHO" ? "Receita" : "Despesa"}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {transacao.categoria}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {transacao.pago ? (
                    <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-100 text-emerald-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-100 text-rose-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {new Date(transacao.data).toLocaleDateString("pt-BR")}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700 flex gap-2">
                  <button
                    onClick={() => handleEditar(transacao)}
                    className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors"
                  >
                    <FiEdit size={16} className="text-emerald-600" />
                  </button>
                  <button
                    onClick={() => handleExcluir(transacao)}
                    className="p-2 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors"
                  >
                    <FiTrash2 size={16} className="text-rose-600" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 px-4 text-center text-gray-400" colSpan={7}>
                Nenhuma transação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-8 mt-8 pb-[10px]">
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <FiChevronLeft size={18} />
            Anterior
          </button>
          <div className="flex items-center gap-3 text-base font-semibold text-emerald-700">
            <span className="w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-700">
              {paginaAtual}
            </span>
            <span className="text-gray-500">de {totalPaginas}</span>
          </div>
          <button
            onClick={() =>
              setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaAtual === totalPaginas}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Próxima
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
