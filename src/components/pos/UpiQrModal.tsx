import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Copy, Check, QrCode } from 'lucide-react';
import { generateUpiUrl, DEFAULT_UPI_ID } from '../../data/upiConfig';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface UpiQrModalProps {
  amount: number;
  onConfirmPayment: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  amount,
  onConfirmPayment,
  onClose,
  isSubmitting = false,
}) => {
  const [copied, setCopied] = useState(false);
  const upiUrl = generateUpiUrl(amount);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(DEFAULT_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200/80 text-center relative animate-scale-in transition-colors duration-200 ring-1 ring-black/[0.04]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 flex items-center justify-center transition-colors disabled:opacity-50"
          aria-label="Close QR modal"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Brand Header */}
        <div className="mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-2 border border-amber-200/70 shadow-2xs transition-colors">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-stone-900 tracking-tight transition-colors">
            Scan & Pay via UPI
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            CHAI KATTA • Instant Payment
          </p>
        </div>

        {/* Amount Badge */}
        <div className="bg-amber-50/80 rounded-xl py-2 px-5 mb-4 border border-amber-200/80 inline-block mx-auto shadow-2xs animate-fade-in">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
            Amount Due
          </span>
          <span className="text-xl font-black text-amber-950 font-mono tracking-tight tabular-nums">
            <AnimatedNumber value={amount} type="currency" duration={450} />
          </span>
        </div>

        {/* High-Contrast Crisp QR Code Container with Animated Laser Scanline */}
        <div className="relative p-3.5 bg-white rounded-2xl border border-stone-200 shadow-md inline-block mx-auto mb-4 overflow-hidden">
          {/* Laser Scanner Beam */}
          <div
            className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-scanline pointer-events-none z-20"
            aria-hidden="true"
          />
          <QRCodeSVG
            value={upiUrl}
            size={170}
            level="M"
            includeMargin={true}
            className="rounded-md"
          />
        </div>

        {/* Supported Payment Apps */}
        <div className="flex items-center justify-center gap-1.5 mb-4 text-[10px] font-medium text-stone-500">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60 shadow-2xs">GPay</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60 shadow-2xs">PhonePe</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60 shadow-2xs">Paytm</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60 shadow-2xs">BHIM</span>
        </div>

        {/* UPI ID Info with Copy Button */}
        <div className="flex items-center justify-between bg-stone-50 rounded-xl p-2.5 mb-5 border border-stone-200/80 text-xs transition-colors">
          <div className="text-left font-mono">
            <span className="text-[10px] text-stone-500 font-sans block uppercase font-medium">UPI ID</span>
            <span className="font-semibold text-stone-800">{DEFAULT_UPI_ID}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 active:scale-95 transition-all shadow-2xs"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-600 animate-pop-in">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Copied</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3 h-3 text-stone-500" />
                <span>Copy</span>
              </span>
            )}
          </button>
        </div>

        {/* Action Button: Confirm & Place Order with Shimmer */}
        <button
          type="button"
          onClick={onConfirmPayment}
          disabled={isSubmitting}
          className="relative overflow-hidden w-full h-10.5 rounded-xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:from-black hover:to-amber-900 active:scale-[0.98] transition-all shadow-md group disabled:opacity-50"
        >
          {!isSubmitting && (
            <span
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-shimmer pointer-events-none"
              aria-hidden="true"
            />
          )}
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Order...</span>
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Payment Received • Complete Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
