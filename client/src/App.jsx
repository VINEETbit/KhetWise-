import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import Dashboard from "./pages/Dashboard";

import Weather from "./pages/Weather";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import CropPrediction from "./pages/models/CropPrediction";
import FertilizerPrediction from "./pages/models/FertilizerPrediction";
import YieldPrediction from "./pages/models/YieldPrediction";
import PricePrediction from "./pages/models/PricePrediction";
import DiseasePrediction from "./pages/models/DiseasePrediction";
import GrowthPrediction from "./pages/models/GrowthPrediction";
import AuthRequired from "./pages/AuthRequired";
import Assistant from "./pages/Assistant";

function RequireAuth({ children }) {
  return localStorage.getItem("token") ? children : <AuthRequired />;
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<RequireAuth><Dashboard /></RequireAuth>}
        />

        {/* AI Models */}

        <Route
          path="/dashboard/crop"
          element={<RequireAuth><CropPrediction /></RequireAuth>}
        />

        <Route
          path="/dashboard/fertilizer"
          element={<RequireAuth><FertilizerPrediction /></RequireAuth>}
        />

        <Route
          path="/dashboard/yield"
          element={<RequireAuth><YieldPrediction /></RequireAuth>}
        />

        <Route
          path="/dashboard/price"
          element={<RequireAuth><PricePrediction /></RequireAuth>}
        />

        <Route
          path="/dashboard/disease"
          element={<RequireAuth><DiseasePrediction /></RequireAuth>}
        />

        <Route
          path="/dashboard/growth"
          element={<RequireAuth><GrowthPrediction /></RequireAuth>}
        />


        {/* Farmer pages */}

        <Route
          path="/dashboard/weather"
          element={<RequireAuth><Weather /></RequireAuth>}
        />

        <Route
          path="/dashboard/assistant"
          element={<RequireAuth><Assistant /></RequireAuth>}
        />

        <Route
          path="/dashboard/profile"
          element={<RequireAuth><Profile /></RequireAuth>}
        />

        <Route
          path="/dashboard/settings"
          element={<RequireAuth><Settings /></RequireAuth>}
        />


        {/* Fallback */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
