import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portal from "@/pages/Portal";
import SpringEquinoxV2 from "@/pages/SpringEquinoxV2";
import BeansShop from "@/pages/BeansShop";

// Admin Imports
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import ActivityManager from "@/pages/admin/ActivityManager";
import ActivityEditor from "@/pages/admin/ActivityEditor";
import ActivityLotteryRecords from "@/pages/admin/ActivityLotteryRecords";
import ShopManager from "@/pages/admin/ShopManager";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Portal Entry */}
        <Route path="/" element={<Portal />} />

        {/* Mobile Routes */}
        <Route path="/mobile/activity" element={<SpringEquinoxV2 />} />
        <Route path="/mobile/shop" element={<BeansShop />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<ActivityManager />} />
          <Route path="activities/:id" element={<ActivityEditor />} />
          <Route path="activities/:id/lottery" element={<ActivityLotteryRecords />} />
          <Route path="shop" element={<ShopManager />} />
        </Route>
      </Routes>
    </Router>
  );
}
