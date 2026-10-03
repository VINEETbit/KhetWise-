import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Sprout,
  Droplets,
  CloudSun,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import heroImage from "../../assets/hero.png";

// ============================================================
// BACKEND CONFIG
// ============================================================

// Your MongoDB authentication backend runs through
// Node/Express on port 8080.
//
// FastAPI ML backend is separate and runs on port 8000.
const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080";


// ============================================================
// LOGIN COMPONENT
// ============================================================

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ----------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove previous error when user starts typing again
    if (error) {
      setError("");
    }
  };


  // ----------------------------------------------------------
  // HANDLE LOGIN
  // ----------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear old error
    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    // --------------------------------------------------------
    // FRONTEND VALIDATION
    // --------------------------------------------------------

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // --------------------------------------------------------
    // LOGIN REQUEST
    // --------------------------------------------------------

    try {
      setLoading(true);

      const response = await fetch(
        `${AUTH_API_URL}/api/users/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // ------------------------------------------------------
      // READ RESPONSE SAFELY
      // ------------------------------------------------------

      const data = await response.json().catch(() => ({}));

      // ------------------------------------------------------
      // HANDLE BACKEND ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      // ------------------------------------------------------
      // CHECK JWT
      // ------------------------------------------------------

      if (!data.token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token."
        );
      }

      // ------------------------------------------------------
      // SAVE AUTH TOKEN
      // ------------------------------------------------------

      localStorage.setItem("token", data.token);


      // ------------------------------------------------------
      // SAVE USER INFORMATION
      // ------------------------------------------------------

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Keep compatibility with older dashboard code
        localStorage.setItem(
          "khetwise_user",
          JSON.stringify(data.user)
        );
      }


      // ------------------------------------------------------
      // SAVE LOGIN PREFERENCE
      // ------------------------------------------------------

      localStorage.setItem(
        "khetwise_remember",
        formData.remember ? "true" : "false"
      );


      // ------------------------------------------------------
      // GO TO DASHBOARD
      // ------------------------------------------------------

      navigate(location.state?.from || "/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("KhetWise login error:", error);

      // Network/backend unavailable
      if (
        error instanceof TypeError &&
        error.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Unable to connect to KhetWise server. Please make sure the Node/Express backend is running on port 8080."
        );
      } else {
        setError(
          error.message ||
            "Login failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#06110b] p-3 sm:p-5">

      {/* =====================================================
          MAIN AUTH CONTAINER
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[30px] bg-[#f8faf5] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">

        {/* =====================================================
            LEFT AGRICULTURE VISUAL
        ====================================================== */}

        <section className="relative hidden w-[54%] overflow-hidden lg:block">

          {/* Farm image */}

          <img
            src={heroImage}
            alt="KhetWise smart agriculture"
            className="absolute inset-0 h-full w-full object-cover"
          />


          {/* Dark agricultural overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-[#03130b]/90 via-[#06351f]/55 to-[#03130b]/20" />


          {/* Bottom gradient */}

          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#03130b] via-[#03130b]/70 to-transparent" />


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="absolute left-8 top-8 z-20 flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-[#06110b] shadow-lg">

              <Sprout
                size={24}
                strokeWidth={2.3}
              />

            </div>


            <div>

              <div className="text-xl font-bold tracking-tight text-white">
                KhetWise
              </div>

              <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
                smart Agriculture
              </div>

            </div>

          </Link>


          {/* =================================================
              TOP RIGHT STATUS
          ================================================= */}

          <div className="absolute right-8 top-8 z-20">

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-xl">

              <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(217,255,63,0.8)]" />

              <span className="text-xs font-medium text-white/75">
                AI systems online
              </span>

            </div>

          </div>


          {/* =================================================
              MAIN LEFT CONTENT
          ================================================= */}

          <div className="absolute bottom-12 left-10 right-10 z-20">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-black/20 px-4 py-2 backdrop-blur-xl">

              <Leaf
                size={15}
                className="text-lime-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
                Agricultural Intelligence
              </span>

            </div>


            <h1 className="max-w-2xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white xl:text-6xl">

              Grow Smarter.

              <br />

              <span className="text-lime-300">
                Harvest Better.
              </span>

            </h1>


            <p className="mt-6 text-xl font-semibold text-white">
              Smart Agriculture
            </p>


            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">

              KhetWise combines artificial intelligence, machine learning
              and agricultural data to help farmers make smarter decisions
              across every stage of farming.

            </p>


            {/* =================================================
                AGRICULTURE DATA CARDS
            ================================================= */}

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">

              {/* Crop health */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-300/15 text-lime-300">

                    <Sprout size={16} />

                  </div>

                  <span className="text-[10px] text-white/45">
                    Crop Health
                  </span>

                </div>


                <p className="mt-3 text-xl font-bold text-white">
                  94%
                </p>


                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">

                  <div className="h-full w-[94%] rounded-full bg-lime-300" />

                </div>

              </div>


              {/* Soil */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">

                    <Droplets size={16} />

                  </div>

                  <span className="text-[10px] text-white/45">
                    Soil Moisture
                  </span>

                </div>


                <p className="mt-3 text-xl font-bold text-white">
                  72%
                </p>


                <p className="mt-2 text-[10px] text-cyan-300">
                  Optimal range
                </p>

              </div>


              {/* Weather */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-300/10 text-yellow-200">

                    <CloudSun size={16} />

                  </div>

                  <span className="text-[10px] text-white/45">
                    Weather
                  </span>

                </div>


                <p className="mt-3 text-xl font-bold text-white">
                  28°C
                </p>


                <p className="mt-2 text-[10px] text-yellow-200">
                  Field conditions
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <section className="flex w-full items-center justify-center bg-[#f8faf5] px-6 py-10 sm:px-12 lg:w-[46%] lg:px-16 xl:px-24">

          <div className="w-full max-w-[430px]">


            {/* =================================================
                MOBILE LOGO
            ================================================= */}

            <div className="mb-10 lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#06110b] text-lime-300">

                  <Sprout size={22} />

                </div>


                <div>

                  <p className="text-xl font-bold text-[#102018]">
                    KhetWise
                  </p>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    smart Agriculture
                  </p>

                </div>

              </Link>

            </div>


            {/* =================================================
                FORM HEADER
            ================================================= */}

            <div className="mb-9">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">

                <Sprout size={23} />

              </div>


              <p className="mb-2 text-sm font-bold text-emerald-700">
                Welcome back to KhetWise
              </p>


              <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#102018]">
                Sign in to your farm.
              </h2>


              <p className="mt-3 text-sm leading-6 text-black/45">

                Access your AI-powered agricultural insights and continue
                making smarter farming decisions.

              </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">

                {error}

              </div>

            )}


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#102018]"
                >
                  Email address
                </label>


                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />


                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="farmer@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#102018]"
                  >
                    Password
                  </label>


                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password reset will be connected to the KhetWise backend."
                      )
                    }
                    className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-900"
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />


                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-12 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-emerald-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  REMEMBER ME
              ================================================= */}

              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-4 w-4 rounded border-black/20 accent-emerald-700"
                  />


                  <span className="text-xs font-medium text-black/45">
                    Keep me signed in
                  </span>

                </label>


                <div className="flex items-center gap-1.5 text-xs text-black/35">

                  <ShieldCheck size={14} />

                  Secure access

                </div>

              </div>


              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#07150d] font-semibold text-white shadow-[0_12px_30px_rgba(4,17,11,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0c2618] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in to KhetWise"}


                {!loading && (

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-300 text-[#07150d] transition group-hover:translate-x-1">

                    <ArrowRight size={15} />

                  </span>

                )}

              </button>

            </form>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-black/8" />

              <span className="text-xs text-black/30">
                New to smart farming?
              </span>

              <div className="h-px flex-1 bg-black/8" />

            </div>


            {/* =================================================
                SIGN UP
            ================================================= */}

            <Link
              to="/signup"
              state={location.state}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white font-semibold text-[#102018] transition duration-300 hover:border-emerald-700 hover:bg-emerald-50"
            >

              Create your KhetWise account

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />

            </Link>


            {/* =================================================
                BOTTOM FEATURES
            ================================================= */}

            <div className="mt-8 grid grid-cols-3 gap-2">

              <div className="rounded-xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-black/5">

                <Sprout
                  size={15}
                  className="mx-auto text-emerald-700"
                />

                <p className="mt-2 text-[10px] font-semibold text-black/50">
                  Crop AI
                </p>

              </div>


              <div className="rounded-xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-black/5">

                <Droplets
                  size={15}
                  className="mx-auto text-cyan-700"
                />

                <p className="mt-2 text-[10px] font-semibold text-black/50">
                  Irrigation
                </p>

              </div>


              <div className="rounded-xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-black/5">

                <TrendingUp
                  size={15}
                  className="mx-auto text-emerald-700"
                />

                <p className="mt-2 text-[10px] font-semibold text-black/50">
                  Market AI
                </p>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <p className="mt-7 text-center text-[10px] leading-5 text-black/30">

              KhetWise • Smart Agriculture

              <br />

              Intelligent decisions for a better harvest.

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;
