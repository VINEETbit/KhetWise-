import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, UserRound } from "lucide-react";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || localStorage.getItem("khetwise_user") || "{}");
  } catch {
    return {};
  }
}

export default function Profile() {
  const [user, setUser] = useState(loadUser);
  const [saved, setSaved] = useState(false);

  const update = (event) => {
    setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const save = (event) => {
    event.preventDefault();
    const updated = { ...user, name: user.name?.trim() || "Farmer", email: user.email?.trim() || "" };
    localStorage.setItem("user", JSON.stringify(updated));
    localStorage.setItem("khetwise_user", JSON.stringify(updated));
    setUser(updated);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-8 text-[#102018] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"><ArrowLeft size={17} /> Back to Dashboard</Link>
        <header className="mb-8"><p className="text-sm font-semibold text-green-700">Account</p><h1 className="mt-1 text-3xl font-bold">My Profile</h1><p className="mt-2 text-black/55">Review and update the details shown in your KhetWise account.</p></header>
        <form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="mb-7 flex items-center gap-4 border-b border-black/5 pb-6"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-green-800"><UserRound size={26} /></div><div><h2 className="font-bold">Farmer details</h2><p className="text-sm capitalize text-black/50">{user.role || "Farmer"}</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">Full name<input name="name" value={user.name || ""} onChange={update} autoComplete="name" className="mt-2 block w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-green-700" /></label>
            <label className="text-sm font-medium">Email address<input name="email" type="email" value={user.email || ""} onChange={update} autoComplete="email" className="mt-2 block w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-green-700" /></label>
            <label className="text-sm font-medium">Phone number<input name="phone" type="tel" value={user.phone || ""} onChange={update} autoComplete="tel" className="mt-2 block w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-green-700" /></label>
            <label className="text-sm font-medium">Account role<input value={user.role || "farmer"} readOnly className="mt-2 block w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3 capitalize text-black/60" /></label>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4"><button type="submit" className="rounded-xl bg-[#092116] px-5 py-3 font-semibold text-white hover:bg-green-900">Save profile</button>{saved && <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-green-800"><Check size={17} /> Saved on this device</p>}</div>
          <p className="mt-5 text-xs leading-5 text-black/45">Profile changes are saved in this browser. Server-side profile syncing is not available in the current backend.</p>
        </form>
      </div>
    </main>
  );
}
