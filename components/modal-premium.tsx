"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface ModalPremiumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  inviteUrl: string;
  handleCopy: () => void;
  copied: boolean;
  footer?: ReactNode;
  showGradient?: boolean;
}

export function ModalPremium({
  open,
  onOpenChange,
  title,
  description,
  handleCopy,
  copied,
  inviteUrl,
  footer,
  showGradient = true,
}: ModalPremiumProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg rounded-3xl px-6 py-10 space-y-6 text-center border border-border shadow-xl bg-gradient-to-b from-white via-background to-muted/50 z-50">
        {showGradient && (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none animate-pulse-slow" />
        )}
        <div className="relative z-10 space-y-4">
          <DialogTitle className="text-3xl font-extrabold text-primary">
            {title}
          </DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          )}
          <div className="mt-4">
            {/* Link de convite */}
            <div className="rounded-xl border border-dashed border-border p-4 bg-muted/40 space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Seu link:
              </p>
              <div className="flex items-center bg-background px-3 py-2 rounded-lg border shadow-sm space-x-2 overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <span className="text-sm font-mono block truncate max-w-[calc(100vw-160px)] md:max-w-[360px]">
                    {inviteUrl}
                  </span>
                </div>
                <Button size="icon" variant="ghost" onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code + Compartilhar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-6">
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-xl border shadow-md border-primary/30">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${inviteUrl}&size=150x150`}
                    alt="QR Code"
                    width={120}
                    height={120}
                    className="rounded"
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Button
                  className="w-full justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 shadow-md hover:scale-[1.03] transition-transform"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=Confira%20este%20app%20incr%C3%ADvel%20que%20transforma%20selfies%20em%20retratos%20premium!%20Use%20meu%20link:%20${inviteUrl}`,
                      "_blank"
                    )
                  }
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.7 13.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.3.2-.6 0-1.1-.4-2-1.2c-.7-.7-1.2-1.5-1.4-1.8s0-.4.2-.6c.2-.2.4-.5.6-.8.2-.2.2-.4.3-.6s0-.4 0-.6c0-.2-.7-1.8-1-2.4s-.5-.6-.7-.6H8c-.2 0-.4 0-.6.1s-.8.7-.8 1.7.8 2 1 2.2c.1.2 1.6 2.4 3.9 3.3 2.4.9 2.4.6 2.8.6.4 0 1.3-.5 1.5-1s.2-.9.1-1.1c0-.2-.3-.3-.6-.5z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.4C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Compartilhar no WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Envie para seus contatos e ganhe créditos extras!
                </p>
              </div>
            </div>
          </div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
