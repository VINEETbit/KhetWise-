import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Sprout } from "lucide-react";

export default function AuthRequired() {
  const location = useLocation();
  const from = `${location.pathname}${location.search}${location.hash}`;
  const authState = { from: { pathname: location.pathname, search: location.search, hash: location.hash } };
  const serviceNames = {
    "/dashboard": "your KhetWise dashboard",
    "/dashboard/assistant": "the Farm Assistant",
    "/dashboard/weather": "farm weather",
    "/dashboard/profile": "your farmer profile",
    "/dashboard/settings": "account settings",
    "/dashboard/crop": "Crop Recommendation",
    "/dashboard/fertilizer": "Fertilizer Recommendation",
    "/dashboard/yield": "Yield Prediction",
    "/dashboard/price": "Market Price Prediction",
    "/dashboard/disease": "Plant Disease Screening",
    "/dashboard/growth": "Crop Growth Conditions",
  };
  const serviceName = serviceNames[location.pathname] || "this KhetWise service";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071810] px-5 py-12 text-white">
      <div aria-hidden="true" className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-lime-300/[0.08] blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-400/[0.08] blur-3xl" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/20 backdrop-blur sm:p-10">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-lime-300"><ArrowLeft size={16} /> Back to KhetWise</Link>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-[#092116]"><LockKeyhole size={25} /></div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-lime-300">Your farm workspace</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sign in to use {serviceName}</h1>
        <p className="mt-4 leading-7 text-white/60">Create an account or sign in to use KhetWise services and save your farm details. You’ll return here afterward.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to="/login" state={authState} className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-3.5 font-bold text-[#092116] transition hover:bg-lime-200">Log in <ArrowRight size={17} /></Link>
          <Link to="/signup" state={authState} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 font-bold transition hover:border-lime-300/50 hover:bg-white/[0.06]">Create account <Sprout size={17} /></Link>
        </div>
        <p className="mt-5 text-center text-xs text-white/35">You’ll continue to <span className="text-white/55">{from}</span> after authentication.</p>
      </section>
    </main>
  );
}
