import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, UserPlus, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import GuaraniAuthLayout from "@/components/GuaraniAuthLayout";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (cpf.replace(/\D/g, "").length < 11) {
      setError("Informe um CPF válido (11 números). Ele será sua senha.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password: cpf.replace(/\D/g, "") });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      try {
        await base44.entities.Socio.create({
          nome,
          email,
          cpf: cpf.replace(/\D/g, ""),
          telefone,
        });
      } catch (_) {}
      try {
        await base44.integrations.Core.SendEmail({
          to: "sociosgto@gmail.com",
          subject: `Novo sócio cadastrado: ${nome}`,
          body: `Um novo sócio se cadastrou no app Guerreiros da Tribo:\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone || "Não informado"}\n\nForte abraço, Guerreiros da Tribo 💚`,
        });
      } catch (_) {}
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Código de verificação inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Código enviado",
        description: "Verifique seu e-mail.",
      });
    } catch (err) {
      setError(err.message || "Falha ao reenviar código");
    }
  };

  if (showOtp) {
    return (
      <GuaraniAuthLayout>
        <h2 className="text-white text-lg font-bold text-center mb-1">Verifique seu e-mail</h2>
        <p className="text-white/70 text-sm text-center mb-5">
          Enviamos um código para {email}
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-300/30 text-red-100 text-sm text-center">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-bold bg-[#2E8B57] hover:bg-[#35996a] text-white"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar"
          )}
        </Button>
        <p className="text-center text-sm text-white/80 mt-4">
          Não recebeu?{" "}
          <button onClick={handleResend} className="text-[#9CE5B5] font-semibold hover:underline">
            Reenviar
          </button>
        </p>
      </GuaraniAuthLayout>
    );
  }

  return (
    <GuaraniAuthLayout
      footer={
        <>
          Já tem conta?{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="text-[#9CE5B5] font-semibold hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <div className="text-center mb-4">
        <h2 className="text-white text-lg font-bold">CADASTRO</h2>
        <p className="text-white/70 text-sm">Cadastre-se para ser sócio</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-300/30 text-red-100 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="nome" className="text-white">Nome completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" aria-hidden="true" />
            <Input
              id="nome"
              type="text"
              autoFocus
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="pl-10 h-12 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/50"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-white">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/50"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cpf" className="text-white">CPF (será sua senha)</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" aria-hidden="true" />
            <Input
              id="cpf"
              type="text"
              inputMode="numeric"
              placeholder="Somente números"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="pl-10 h-12 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/50"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefone" className="text-white">Telefone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" aria-hidden="true" />
            <Input
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="pl-10 h-12 bg-[#007A2E] border-[#2E8B57] text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-12 font-bold text-base bg-[#2E8B57] hover:bg-[#35996a] text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Cadastrando...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              CADASTRAR
            </>
          )}
        </Button>
      </form>
    </GuaraniAuthLayout>
  );
}
