import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Sprout,
  User,
  Phone,
  Droplets,
  BarChart3,
} from "lucide-react";

import heroImage from "../../assets/hero.png";


// ============================================================
// BACKEND CONFIG
// ============================================================

// MongoDB authentication is handled by your
// Node/Express backend.
//
// FastAPI ML backend remains separate on port 8000.

const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080";


// ============================================================
// SIGNUP COMPONENT
// ============================================================

function Signup() {

  const navigate = useNavigate();
  const location = useLocation();


  // ----------------------------------------------------------
  // PASSWORD VISIBILITY
  // ----------------------------------------------------------

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ----------------------------------------------------------
  // FORM DATA
  // ----------------------------------------------------------

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    password: "",

    confirmPassword: "",

    phone: "",

    terms: false,

  });


  // ----------------------------------------------------------
  // UI STATES
  // ----------------------------------------------------------

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));


    // Clear previous error
    if (error) {
      setError("");
    }

  };


  // ==========================================================
  // HANDLE SIGNUP
  // ==========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    setError("");


    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    const phone =
      formData.phone.trim();

    const terms =
      formData.terms;


    // --------------------------------------------------------
    // FRONTEND VALIDATION
    // --------------------------------------------------------

    if (!name) {

      setError(
        "Please enter your full name."
      );

      return;

    }


    if (!email) {

      setError(
        "Please enter your email address."
      );

      return;

    }


    if (!email.includes("@")) {

      setError(
        "Please enter a valid email address."
      );

      return;

    }


    if (!password) {

      setError(
        "Please create a password."
      );

      return;

    }


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    if (!terms) {

      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );

      return;

    }


    // --------------------------------------------------------
    // SEND REQUEST TO EXPRESS + MONGODB
    // --------------------------------------------------------

    try {

      setLoading(true);


      const response = await fetch(
        `${AUTH_API_URL}/api/users`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            name,

            email,

            password,

            phone,

            role: "farmer",

          }),
        }
      );


      // ------------------------------------------------------
      // SAFELY READ RESPONSE
      // ------------------------------------------------------

      const data =
        await response.json().catch(
          () => ({})
        );


      // ------------------------------------------------------
      // BACKEND ERROR
      // ------------------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Registration failed. Please try again."
        );

      }


      // ------------------------------------------------------
      // CHECK TOKEN
      // ------------------------------------------------------

      if (!data.token) {

        throw new Error(
          "Account was created, but the server did not return an authentication token."
        );

      }


      // ------------------------------------------------------
      // SAVE JWT
      // ------------------------------------------------------

      localStorage.setItem(
        "token",
        data.token
      );


      // ------------------------------------------------------
      // SAVE USER
      // ------------------------------------------------------

      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );


        // Compatibility with your
        // existing dashboard

        localStorage.setItem(
          "khetwise_user",
          JSON.stringify(
            data.user
          )
        );

      }


      // ------------------------------------------------------
      // REDIRECT
      // ------------------------------------------------------

      navigate(
        location.state?.from || "/dashboard",
        {
          replace: true,
        }
      );


    } catch (error) {

      console.error(
        "KhetWise signup error:",
        error
      );


      // Server not reachable

      if (
        error instanceof TypeError &&
        error.message
          .toLowerCase()
          .includes("fetch")
      ) {

        setError(
          "Unable to connect to KhetWise server. Please make sure the Node/Express backend is running on port 8080."
        );

      } else {

        setError(
          error.message ||
          "Unable to create your account."
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
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] overflow-hidden rounded-[30px] bg-[#f8faf5] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">


        {/* ===================================================
            LEFT AGRICULTURE PANEL
        ==================================================== */}

        <section className="relative hidden w-[54%] overflow-hidden lg:block">

          {/* Farm image */}

          <img
            src={heroImage}
            alt="KhetWise smart agriculture"
            className="absolute inset-0 h-full w-full object-cover"
          />


          {/* Main overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-[#03130b]/90 via-[#06351f]/50 to-[#03130b]/20" />


          {/* Bottom gradient */}

          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#03130b] via-[#03130b]/70 to-transparent" />


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
                Smart Agriculture
              </div>

            </div>

          </Link>


          {/* =================================================
              ONLINE STATUS
          ================================================= */}

          <div className="absolute right-8 top-8 z-20">

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-xl">

              <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(217,255,63,0.8)]" />

              <span className="text-xs font-medium text-white/75">
                KhetWise AI
              </span>

            </div>

          </div>


          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="absolute bottom-12 left-10 right-10 z-20">


            {/* Badge */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-black/20 px-4 py-2 backdrop-blur-xl">

              <Leaf
                size={15}
                className="text-lime-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
                Join the smarter farming ecosystem
              </span>

            </div>


            {/* Heading */}

            <h1 className="max-w-2xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white xl:text-6xl">

              Your farm.

              <br />

              <span className="text-lime-300">
                Smarter decisions.
              </span>

            </h1>


            {/* Tagline */}

            <p className="mt-6 text-xl font-semibold text-white">
              Smart Agriculture
            </p>


            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">

              Build a smarter approach to farming with AI-powered
              crop recommendations, irrigation intelligence,
              yield prediction, fertilizer insights and market analytics.

            </p>


            {/* =================================================
                AGRICULTURE INSIGHTS
            ================================================= */}

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">


              {/* Crop */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-300/15 text-lime-300">

                    <Sprout size={16} />

                  </div>


                  <span className="text-[10px] text-white/45">
                    Crop AI
                  </span>

                </div>


                <p className="mt-3 text-sm font-bold text-white">
                  Smart
                </p>


                <p className="mt-1 text-[10px] text-lime-300">
                  Recommendations
                </p>

              </div>


              {/* Irrigation */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">

                    <Droplets size={16} />

                  </div>


                  <span className="text-[10px] text-white/45">
                    Irrigation
                  </span>

                </div>


                <p className="mt-3 text-sm font-bold text-white">
                  Intelligent
                </p>


                <p className="mt-1 text-[10px] text-cyan-300">
                  Water insights
                </p>

              </div>


              {/* Market */}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-300/10 text-yellow-200">

                    <BarChart3 size={16} />

                  </div>


                  <span className="text-[10px] text-white/45">
                    Market AI
                  </span>

                </div>


                <p className="mt-3 text-sm font-bold text-white">
                  Data-driven
                </p>


                <p className="mt-1 text-[10px] text-yellow-200">
                  Price insights
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIGNUP PANEL
        ====================================================== */}

        <section className="flex w-full items-center justify-center bg-[#f8faf5] px-6 py-10 sm:px-12 lg:w-[46%] lg:px-16 xl:px-24">

          <div className="w-full max-w-[430px]">


            {/* =================================================
                MOBILE LOGO
            ================================================= */}

            <div className="mb-8 lg:hidden">

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
                    Smart Agriculture
                  </p>

                </div>

              </Link>

            </div>


            {/* =================================================
                FORM HEADER
            ================================================= */}

            <div className="mb-7">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">

                <Sprout size={23} />

              </div>


              <p className="mb-2 text-sm font-bold text-emerald-700">
                Welcome to KhetWise
              </p>


              <h2 className="text-4xl font-bold tracking-[-0.03em] text-[#102018]">
                Create your farm profile.
              </h2>


              <p className="mt-3 text-sm leading-6 text-black/45">

                Join KhetWise and start making smarter,
                data-driven farming decisions.

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
                SIGNUP FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >


              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#102018]"
                >
                  Full name
                </label>


                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />


                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />

                </div>

              </div>


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
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />

                </div>

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#102018]"
                >
                  Phone number
                  <span className="ml-1 font-normal text-black/35">
                    (optional)
                  </span>
                </label>


                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />


                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#102018]"
                >
                  Create password
                </label>


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
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-12 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
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
                  CONFIRM PASSWORD
              ================================================= */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#102018]"
                >
                  Confirm password
                </label>


                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />


                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-12 text-sm text-[#102018] outline-none transition placeholder:text-black/25 hover:border-black/20 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-emerald-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  TERMS
              ================================================= */}

              <label className="flex cursor-pointer items-start gap-3 pt-1">

                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                />


                <span className="text-xs leading-5 text-black/45">

                  I agree to the{" "}

                  <span className="font-semibold text-emerald-700">
                    Terms of Service
                  </span>{" "}

                  and{" "}

                  <span className="font-semibold text-emerald-700">
                    Privacy Policy
                  </span>

                  .

                </span>

              </label>


              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#07150d] font-semibold text-white shadow-[0_12px_30px_rgba(4,17,11,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0c2618] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Creating account..."
                  : "Create my KhetWise account"}


                {!loading && (

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-300 text-[#07150d] transition group-hover:translate-x-1">

                    <ArrowRight size={15} />

                  </span>

                )}

              </button>

            </form>


            {/* =================================================
                LOGIN LINK
            ================================================= */}

            <div className="mt-7 text-center">

              <p className="text-sm text-black/45">

                Already part of KhetWise?{" "}


                <Link
                  to="/login"
                  state={location.state}
                  className="font-semibold text-emerald-700 transition hover:text-emerald-900"
                >
                  Sign in
                </Link>

              </p>

            </div>


            {/* =================================================
                FEATURE STRIP
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

                <BarChart3
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


export default Signup;
