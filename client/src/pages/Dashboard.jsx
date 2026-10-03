import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  TrendingUp,
  CloudSun,
  User,
  Settings,
  LogOut,
  Bell,
  Plus,
  MapPin,
  ArrowUpRight,
  X,
  Menu,
  Leaf,
  Tractor,
  BarChart3,
  Wheat,
  MessageCircle,
} from "lucide-react";
import { getFarmForecast } from "../services/farmWeather";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Crop Recommendation",
    icon: Sprout,
    path: "/dashboard/crop",
  },
  {
    label: "Irrigation / Growth",
    icon: Droplets,
    path: "/dashboard/growth",
  },
  {
    label: "Fertilizer",
    icon: FlaskConical,
    path: "/dashboard/fertilizer",
  },
  {
    label: "Plant Disease",
    icon: Bug,
    path: "/dashboard/disease",
  },
  {
    label: "Market Prices",
    icon: TrendingUp,
    path: "/dashboard/price",
  },
  {
    label: "Weather",
    icon: CloudSun,
    path: "/dashboard/weather",
  },
  {
    label: "Farm Assistant",
    icon: MessageCircle,
    path: "/dashboard/assistant",
  },
];

const accountNavigation = [
  {
    label: "My Profile",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const aiModels = [
  {
    title: "Crop Recommendation",
    description: "Find suitable crops using soil and climate conditions.",
    icon: Sprout,
    path: "/dashboard/crop",
  },
  {
    title: "Fertilizer Recommendation",
    description: "Get fertilizer recommendations for your crop.",
    icon: FlaskConical,
    path: "/dashboard/fertilizer",
  },
  {
    title: "Yield Prediction",
    description: "Estimate expected agricultural production.",
    icon: BarChart3,
    path: "/dashboard/yield",
  },
  {
    title: "Market Price",
    description: "Analyse expected agricultural market prices.",
    icon: TrendingUp,
    path: "/dashboard/price",
  },
  {
    title: "Disease Detection",
    description: "Analyse plant symptoms and disease conditions.",
    icon: Bug,
    path: "/dashboard/disease",
  },
  {
    title: "Growth Condition",
    description: "Analyse crop growth and irrigation conditions.",
    icon: Droplets,
    path: "/dashboard/growth",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmArea, setFarmArea] = useState("");

  const [farmError, setFarmError] = useState("");

  /* =========================================================
     LOAD LOGGED-IN FARMER
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const savedFarm = localStorage.getItem("khetwise_farm");

    if (savedFarm) {
      try {
        setFarm(JSON.parse(savedFarm));
      } catch {
        localStorage.removeItem("khetwise_farm");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!farm?.location) {
      setWeather(null);
      setWeatherError("");
      setWeatherLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setWeatherLoading(true);
    setWeatherError("");
    getFarmForecast(farm.location, { signal: controller.signal })
      .then(setWeather)
      .catch((error) => {
        if (error.name !== "AbortError") setWeatherError(error.message || "Forecast unavailable");
      })
      .finally(() => {
        if (!controller.signal.aborted) setWeatherLoading(false);
      });

    return () => controller.abort();
  }, [farm?.location]);

  /* =========================================================
     FARMER NAME
  ========================================================= */

  const farmerName = useMemo(() => {
    if (!user) return "Farmer";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email?.split("@")[0] ||
      "Farmer"
    );
  }, [user]);

  const firstLetter = farmerName.charAt(0).toUpperCase();

  /* =========================================================
     GREETING
  ========================================================= */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  }, []);

  /* =========================================================
     ADD FARM
  ========================================================= */

  const handleAddFarm = (e) => {
    e.preventDefault();

    setFarmError("");

    if (!farmName.trim()) {
      setFarmError("Please enter your farm name.");
      return;
    }

    if (!farmLocation.trim()) {
      setFarmError("Please enter your farm location.");
      return;
    }

    if (!farmArea || Number(farmArea) <= 0) {
      setFarmError("Please enter a valid farm area.");
      return;
    }

    const newFarm = {
      name: farmName.trim(),
      location: farmLocation.trim(),
      area: Number(farmArea),
    };

    setFarm(newFarm);

    localStorage.setItem(
      "khetwise_farm",
      JSON.stringify(newFarm)
    );

    setFarmName("");
    setFarmLocation("");
    setFarmArea("");
    setShowFarmModal(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("khetwise_user");

    navigate("/login", { replace: true });
  };

  /* =========================================================
     OPEN FARM MODAL
  ========================================================= */

  const openFarmModal = () => {
    setFarmError("");

    if (farm) {
      setFarmName(farm.name || "");
      setFarmLocation(farm.location || "");
      setFarmArea(farm.area || "");
    }

    setShowFarmModal(true);
  };

  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const isActive = (path) => {
    return location.pathname === path;
  };

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(190,242,100,0.14),_transparent_34%),linear-gradient(135deg,_#f8faf6_0%,_#f2f6ef_100%)] text-[#102018]">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-40 flex h-[76px] items-center justify-between border-b border-black/[0.06] bg-white/90 px-4 shadow-[0_6px_24px_rgba(16,32,24,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <button
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open dashboard navigation"
            className="rounded-xl p-2 transition hover:bg-black/5 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-200 to-lime-300 shadow-sm shadow-lime-900/10">
              <Sprout
                size={24}
                className="text-green-900"
              />
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-[#102018]">
                Khet<span className="text-green-700">Wise</span>
              </p>

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-black/40 sm:block">
                Smart Agriculture
              </p>
            </div>
          </Link>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-1.5 sm:gap-4">

          <button
            onClick={openFarmModal}
            className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-semibold text-[#26382d] shadow-sm transition hover:border-lime-300 hover:bg-lime-50 md:flex"
          >
            <MapPin size={16} />

            {farm ? farm.name : "Add Farm"}
          </button>

          <button
            onClick={() => alert("No new notifications")}
            aria-label="Notifications"
            className="relative rounded-full p-3 text-[#526157] transition hover:bg-lime-50 hover:text-green-800"
          >
            <Bell size={20} />
          </button>

          <button
            onClick={() => navigate("/dashboard/profile")}
            className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:border-lime-300 sm:gap-2.5 sm:pl-2 sm:pr-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-200 font-bold">
              {firstLetter}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[120px] truncate text-sm font-semibold">
                {farmerName}
              </p>

              <p className="text-xs capitalize text-black/40">
                Farmer
              </p>
            </div>
          </button>

        </div>
      </header>


      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileMenu(false)}
          />

          <aside className="relative h-full w-[280px] bg-[#092116] p-5 text-white">

            <div className="mb-8 flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-green-950">
                  <Sprout size={21} />
                </div>

                <div>
                  <p className="font-bold">KhetWise</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/40">
                    Farmer
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
              >
                <X size={20} />
              </button>

            </div>

            <SidebarLinks
              navigation={navigation}
              accountNavigation={accountNavigation}
              isActive={isActive}
              navigate={navigate}
              onNavigate={() => setShowMobileMenu(false)}
              dark
            />

            <button
              onClick={handleLogout}
              className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-300 hover:bg-white/10"
            >
              <LogOut size={18} />
              Logout
            </button>

          </aside>
        </div>
      )}


      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="fixed bottom-0 left-0 top-[76px] hidden w-[256px] flex-col border-r border-white/[0.06] bg-[linear-gradient(180deg,#0b2418_0%,#071a11_100%)] p-5 text-white lg:flex">

        <div className="mb-7 rounded-2xl bg-white/5 p-4">

          <p className="text-xs uppercase tracking-widest text-white/35">
            Farmer Account
          </p>

          <p className="mt-2 truncate font-semibold">
            {farmerName}
          </p>

          <p className="mt-1 truncate text-xs text-white/40">
            {user?.email || "Farmer"}
          </p>

        </div>

        <div className="dashboard-sidebar-scroll min-h-0 flex-1 overflow-y-auto pb-3">
          <SidebarLinks
            navigation={navigation}
            accountNavigation={accountNavigation}
            isActive={isActive}
            navigate={navigate}
            dark
          />
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex shrink-0 items-center gap-3 border-t border-white/10 px-4 pt-4 text-red-300 transition hover:text-red-200"
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="pt-[76px] lg:pl-[256px]">

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">

          {/* HEADER */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-800/10 bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-green-800 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500 shadow-[0_0_0_3px_rgba(132,204,22,0.16)]" />
                Smart Agriculture
              </p>

              <h1 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-[2.65rem]">
                {greeting},{" "}
                <span className="text-lime-600">
                  {farmerName}
                </span>
              </h1>

              <p className="mt-2 text-sm text-[#647168] sm:text-base">
                Here's what's happening with your farm today.
              </p>

            </div>

            <button
              onClick={openFarmModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#092116] px-6 py-3.5 font-semibold text-white shadow-[0_10px_22px_rgba(9,33,22,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-green-900 hover:shadow-[0_14px_26px_rgba(9,33,22,0.2)]"
            >
              <Plus size={18} />
              {farm ? "Edit Farm" : "Add Farm"}
            </button>

          </div>


          {/* =================================================
              FARM INTELLIGENCE HERO
          ================================================= */}

          <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[linear-gradient(118deg,#092116_0%,#103a25_58%,#17452a_100%)] p-6 text-white shadow-[0_24px_60px_rgba(9,33,22,0.16)] sm:p-9">

            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full border border-white/[0.07] bg-lime-300/[0.04]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-44 h-72 w-72 rounded-full border border-white/[0.06]" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div>

                <div className="mb-5 flex items-center gap-2 text-sm text-white/60">
                  <MapPin size={17} />

                  {farm
                    ? farm.location
                    : "Add your farm location"}
                </div>

                <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.035em] md:text-[2.65rem]">
                  {farm ? "Your farm intelligence is ready." : "Start with your farm."}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  {farm
                    ? "Use KhetWise AI models to analyse crops, irrigation, fertilizer requirements, yield, diseases and market prices."
                    : "Add your farm location to see local weather, regional soil guidance and recommendations tailored to your area."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">

                  <button
                    onClick={() => farm ? navigate("/dashboard/crop") : openFarmModal()}
                    className="flex items-center gap-2 rounded-xl bg-lime-300 px-6 py-3.5 font-bold text-[#092116] shadow-[0_8px_20px_rgba(190,242,100,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-lime-200"
                  >
                    {farm ? "Explore AI Models" : "Add Your Farm"}
                    <ArrowUpRight size={18} />
                  </button>

                  <button
                    onClick={() => farm ? openFarmModal() : navigate("/dashboard/crop")}
                    className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    {farm ? "Manage Farm" : "Explore AI Models"}
                  </button>

                </div>

              </div>


              {/* WEATHER CARD */}

              <button
                onClick={() => navigate("/dashboard/weather")}
                aria-label="Open local farm weather forecast"
                className="w-full min-w-0 rounded-2xl border border-white/[0.12] bg-white/[0.08] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.1)] backdrop-blur-md transition duration-200 hover:border-white/20 hover:bg-white/[0.12] sm:min-w-[300px] sm:p-6 lg:w-[330px]"
              >

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Farm weather</p>
                    <p className="mt-1 max-w-[190px] truncate text-sm font-medium text-white/80">{weather?.location || farm?.location || "Add farm location"}</p>
                  </div>
                  <CloudSun size={25} className="shrink-0 text-lime-300" />
                </div>

                {weatherLoading ? (
                  <p className="mt-5 text-sm text-white/65">Loading local forecast…</p>
                ) : weather ? (
                  <>
                    <div className="mt-3 flex items-end gap-3">
                      <p className="text-5xl font-semibold leading-none tracking-tight">{Math.round(weather.current.temperature_2m)}<span className="text-2xl">{weather.unit}</span></p>
                      <p className="pb-1 text-sm text-white/70">{weather.current.description}</p>
                    </div>
                    <p className="mt-3 text-xs text-white/55">Feels like {Math.round(weather.current.apparent_temperature)}{weather.unit} · Humidity {weather.current.relative_humidity_2m}%</p>
                    {weather.daily[0] && <p className="mt-1 text-xs text-white/55">Today {Math.round(weather.daily[0].low)}–{Math.round(weather.daily[0].high)}{weather.unit} · Rain {weather.daily[0].precipitationProbability ?? 0}%</p>}
                  </>
                ) : (
                  <p className="mt-5 text-sm text-white/65">{weatherError || "Add your farm location to see local weather."}</p>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-lime-300">
                  View 7-day forecast
                  <ArrowUpRight size={15} />
                </div>

              </button>

            </div>

          </section>


          {/* =================================================
              FARM SUMMARY
          ================================================= */}

          <section className="mb-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              icon={Tractor}
              label="Farm"
              value={farm ? farm.name : "Not added"}
              description={
                farm
                  ? `${farm.area} acres`
                  : "Add your farm"
              }
              onClick={openFarmModal}
            />

            <SummaryCard
              icon={MapPin}
              label="Location"
              value={
                farm
                  ? farm.location
                  : "Not available"
              }
              description="Farm location"
              onClick={openFarmModal}
            />

            <SummaryCard
              icon={Wheat}
              label="AI Solutions"
              value="6"
              description="Models available"
              onClick={() => navigate("/dashboard/crop")}
            />

            <SummaryCard
              icon={Bell}
              label="Alerts"
              value="0"
              description="No active alerts"
              onClick={() => alert("No active alerts")}
            />

          </section>


          {/* =================================================
              AI MODELS
          ================================================= */}

          <section className="mt-11">

            <div className="mb-5 flex items-end justify-between">

              <div>
                <p className="text-sm font-semibold text-green-700">
                  KhetWise AI
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Agricultural Intelligence
                </h2>

                <p className="mt-1 text-sm text-black/45">
                  Choose an AI model to analyse your farm.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/crop")}
                className="hidden text-sm font-semibold text-green-700 sm:block"
              >
                Explore →
              </button>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {aiModels.map((model) => {

                const Icon = model.icon;

                return (
                  <Link
                    key={model.title}
                    to={model.path}
                    className="group rounded-2xl border border-black/[0.055] bg-white/90 p-5 shadow-[0_3px_12px_rgba(16,32,24,0.035)] transition duration-200 hover:-translate-y-1 hover:border-lime-300 hover:bg-white hover:shadow-[0_18px_35px_rgba(16,32,24,0.09)] sm:p-6"
                  >

                    <div className="mb-6 flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 text-green-700 transition group-hover:bg-lime-200">
                        <Icon size={22} />
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-black/25 transition group-hover:text-green-700"
                      />

                    </div>

                    <h3 className="text-lg font-bold">
                      {model.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-black/45">
                      {model.description}
                    </p>

                    <div className="mt-5 text-sm font-semibold text-green-700">
                      Open model →
                    </div>

                  </Link>
                );

              })}

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-11">

            <div className="mb-5">
              <p className="text-sm font-semibold text-green-700">
                Quick Access
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Manage Your KhetWise
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <QuickAction
                icon={CloudSun}
                title="Weather"
                description="Check weather conditions."
                onClick={() => navigate("/dashboard/weather")}
              />

              <QuickAction
                icon={User}
                title="My Profile"
                description="View your farmer profile."
                onClick={() => navigate("/dashboard/profile")}
              />

              <QuickAction
                icon={Settings}
                title="Settings"
                description="Manage your account."
                onClick={() => navigate("/dashboard/settings")}
              />

              <QuickAction
                icon={MessageCircle}
                title="Farm Assistant"
                description="Get practical help for farm problems."
                onClick={() => navigate("/dashboard/assistant")}
              />

            </div>

          </section>


          {/* FOOTER */}

          <div className="mt-14 border-t border-black/5 py-7 text-center text-sm text-black/35">
            KhetWise • AI-Powered Smart Agriculture
          </div>

        </div>

      </main>


      {/* =====================================================
          ADD / EDIT FARM MODAL
      ===================================================== */}

      {showFarmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5">

          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">

            <div className="mb-7 flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-green-700">
                  My Farm
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {farm ? "Update Farm" : "Add Your Farm"}
                </h2>

                <p className="mt-1 text-sm text-black/45">
                  Add basic information about your farm.
                </p>
              </div>

              <button
                onClick={() => setShowFarmModal(false)}
                className="rounded-xl p-2 hover:bg-black/5"
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={handleAddFarm}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Farm Name
                </label>

                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Mishra Farm"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-green-600"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Farm Location
                </label>

                <input
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="e.g. Bhopal, Madhya Pradesh"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-green-600"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Farm Area
                </label>

                <div className="flex overflow-hidden rounded-xl border border-black/10">

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={farmArea}
                    onChange={(e) => setFarmArea(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-3 outline-none"
                  />

                  <div className="flex items-center bg-black/5 px-4 text-sm font-medium text-black/50">
                    acres
                  </div>

                </div>
              </div>


              {farmError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {farmError}
                </div>
              )}


              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowFarmModal(false)}
                  className="flex-1 rounded-xl border border-black/10 px-5 py-3 font-semibold transition hover:bg-black/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#092116] px-5 py-3 font-semibold text-white transition hover:bg-green-900"
                >
                  {farm ? "Update Farm" : "Save Farm"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   SIDEBAR LINKS
========================================================= */

function SidebarLinks({
  navigation,
  accountNavigation,
  isActive,
  navigate,
  onNavigate,
  dark = false,
}) {
  return (
    <div className="space-y-7">

      <div>

        <p
          className={`mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] ${
            dark ? "text-white/30" : "text-black/30"
          }`}
        >
          Workspace
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onNavigate?.();
                }}
                className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition duration-150 focus-visible:outline-offset-2 ${
                  active
                    ? dark
                      ? "bg-lime-300 font-semibold text-[#092116] shadow-sm shadow-black/10"
                      : "bg-lime-100 text-green-900"
                    : dark
                    ? "text-white/60 hover:bg-white/10 hover:text-white"
                    : "text-black/55 hover:bg-black/5 hover:text-black"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );

          })}

        </div>

      </div>


      <div className="border-t border-black/10 pt-6 dark:border-white/10">

        <p
          className={`mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] ${
            dark ? "text-white/30" : "text-black/30"
          }`}
        >
          Account
        </p>

        <div className="space-y-1">

          {accountNavigation.map((item) => {

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onNavigate?.();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? dark
                      ? "bg-lime-300 text-[#092116]"
                      : "bg-lime-100 text-green-900"
                    : dark
                    ? "text-white/60 hover:bg-white/10 hover:text-white"
                    : "text-black/55 hover:bg-black/5 hover:text-black"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );

          })}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-black/[0.055] bg-white/90 p-5 text-left shadow-[0_3px_12px_rgba(16,32,24,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-lime-300 hover:bg-white hover:shadow-[0_14px_28px_rgba(16,32,24,0.08)]"
    >

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-lime-100 p-3 text-green-700 transition group-hover:bg-lime-200">
          <Icon size={20} />
        </div>

        <ArrowUpRight
          size={17}
          className="text-black/25 transition group-hover:text-green-700"
        />

      </div>

      <p className="text-xs font-medium text-black/40">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-black/35">
        {description}
      </p>

    </button>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-black/[0.055] bg-white/90 p-5 text-left shadow-[0_3px_12px_rgba(16,32,24,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-lime-300 hover:bg-white hover:shadow-[0_14px_28px_rgba(16,32,24,0.08)]"
    >

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-green-700 transition group-hover:bg-lime-200">
        <Icon size={21} />
      </div>

      <div>
        <p className="font-bold">
          {title}
        </p>

        <p className="mt-1 text-sm text-black/40">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={18}
        className="ml-auto text-black/25 transition group-hover:text-green-700"
      />

    </button>
  );
}
