import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { 
  UserRole, 
  Child, 
  StockItem, 
  StockUsageLog, 
  StockRequisition, 
  AnganwadiCenter, 
  Announcement, 
  NotificationAlert, 
  MealItem 
} from './types';
import { 
  INITIAL_CHILDREN, 
  INITIAL_STOCK_ITEMS, 
  INITIAL_CENTERS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REQUISITIONS, 
  INITIAL_MEAL_PLAN 
} from './data/mockData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [usageLogs, setUsageLogs] = useState<StockUsageLog[]>([
    {
      id: 'log-1',
      stockItemId: 'stock-01',
      stockItemName: 'Fortified Parboiled Rice',
      quantityUsed: 8.5,
      unit: 'kg',
      date: 'Today, 08:30 AM',
      purpose: 'Cooked lunch khichdi for 29 attending children',
      loggedBy: 'Sunita Devi (Worker)',
    },
    {
      id: 'log-2',
      stockItemId: 'stock-04',
      stockItemName: 'Fortified Milk Powder',
      quantityUsed: 2.0,
      unit: 'kg',
      date: 'Today, 08:30 AM',
      purpose: 'Morning nutrition cup (100ml per child)',
      loggedBy: 'Sunita Devi (Worker)',
    },
  ]);
  const [requisitions, setRequisitions] = useState<StockRequisition[]>(INITIAL_REQUISITIONS);
  const [centers, setCenters] = useState<AnganwadiCenter[]>(INITIAL_CENTERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);
  const [mealPlan] = useState<MealItem[]>(INITIAL_MEAL_PLAN);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Worker updates
  const handleUpdateChild = (updatedChild: Child) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === updatedChild.id ? updatedChild : c))
    );
    showToast(`Updated care and health records for ${updatedChild.name}`);

    // Also add to notification stream
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `Daily Log Updated: ${updatedChild.name}`,
      message: `Attendance: ${updatedChild.attendanceToday}, Temp: ${updatedChild.healthToday.temperatureF}°F, Meals recorded.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
      roleTarget: 'parent',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleLogStockUsage = (stockId: string, quantity: number, purpose: string) => {
    const item = stockItems.find((s) => s.id === stockId);
    if (!item) return;

    // Deduct stock
    setStockItems((prev) =>
      prev.map((s) =>
        s.id === stockId
          ? {
              ...s,
              currentlyAvailable: Math.max(0, +(s.currentlyAvailable - quantity).toFixed(1)),
              lastUpdated: 'Just now',
            }
          : s
      )
    );

    // Add log
    const newLog: StockUsageLog = {
      id: `log-${Date.now()}`,
      stockItemId: stockId,
      stockItemName: item.name,
      quantityUsed: quantity,
      unit: item.unit,
      date: 'Just now',
      purpose,
      loggedBy: 'Sunita Devi (Worker)',
    };
    setUsageLogs((prev) => [newLog, ...prev]);

    showToast(`Logged usage of ${quantity} ${item.unit} for ${item.name}`);
  };

  const handleRequestStock = (
    itemName: string,
    quantity: number,
    unit: string,
    urgency: 'Normal' | 'High' | 'Emergency',
    reason: string
  ) => {
    const newReq: StockRequisition = {
      id: `req-${Date.now()}`,
      centerId: 'AW-101',
      centerName: 'Rampur Main Anganwadi Center (#12)',
      itemName,
      quantityRequested: quantity,
      unit,
      urgency,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'Pending',
      reason,
    };
    setRequisitions((prev) => [newReq, ...prev]);
    showToast(`Submitted requisition for ${quantity} ${unit} ${itemName} to Supervisor`);

    // Add notification for supervisor
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `New Supply Indent from Center #12`,
      message: `Worker requested ${quantity} ${unit} of ${itemName} (${urgency} urgency).`,
      timestamp: 'Just now',
      type: 'warning',
      read: false,
      roleTarget: 'supervisor',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Supervisor actions
  const handleApproveRequisition = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Approved' } : r))
    );
    showToast(`Approved supply consignment allocation`);

    // Add notification for worker
    const targetReq = requisitions.find((r) => r.id === reqId);
    if (targetReq) {
      const newNotif: NotificationAlert = {
        id: `notif-${Date.now()}`,
        title: `Requisition Approved: ${targetReq.itemName}`,
        message: `CDPO Supervisor Meera Rao approved dispatch of ${targetReq.quantityRequested} ${targetReq.unit}.`,
        timestamp: 'Just now',
        type: 'success',
        read: false,
        roleTarget: 'worker',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleBroadcastNotice = (noticeData: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      ...noticeData,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Notice "${noticeData.title}" broadcasted across Sector 4`);

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `Sector Broadcast: ${noticeData.title}`,
      message: noticeData.description,
      timestamp: 'Just now',
      type: 'info',
      read: false,
      roleTarget: 'all',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // The primary child shown in the Parent Dashboard
  const parentChild = childrenList.find((c) => c.id === 'ch-01') || childrenList[0];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar with Role Switcher, Alerts, Live Clock */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        notifications={notifications}
        onMarkNotificationRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Quick Switch Notification Banner */}
        <div className="mb-4 bg-white/70 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-stone-500 font-medium">Currently viewing as:</span>
            <strong className="text-stone-900 font-bold capitalize">
              {currentRole === 'parent' && '👨‍👩‍👦 Parent View (Pooja Sharma - Child: Aarav)'}
              {currentRole === 'worker' && '👩‍🏫 Anganwadi Helper / Worker (Sunita Devi - Center #12)'}
              {currentRole === 'supervisor' && '📋 CDPO Supervisor (Meera Rao - Sector 4 Inspection)'}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-stone-400 font-medium hidden sm:inline">Switch view:</span>
            <button
              onClick={() => setCurrentRole('parent')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                currentRole === 'parent'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Parent
            </button>
            <button
              onClick={() => setCurrentRole('worker')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                currentRole === 'worker'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Worker
            </button>
            <button
              onClick={() => setCurrentRole('supervisor')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                currentRole === 'supervisor'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Supervisor
            </button>
          </div>
        </div>

        {/* Dynamic Role Dashboard Rendering */}
        {currentRole === 'parent' && (
          <ParentDashboard
            child={parentChild}
            mealPlan={mealPlan}
            announcements={announcements}
          />
        )}

        {currentRole === 'worker' && (
          <WorkerDashboard
            childrenList={childrenList}
            stockItems={stockItems}
            usageLogs={usageLogs}
            onUpdateChild={handleUpdateChild}
            onLogStockUsage={handleLogStockUsage}
            onRequestStock={handleRequestStock}
          />
        )}

        {currentRole === 'supervisor' && (
          <SupervisorDashboard
            centers={centers}
            requisitions={requisitions}
            onApproveRequisition={handleApproveRequisition}
            onBroadcastNotice={handleBroadcastNotice}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-200 text-sm">
                Anganwadi Care • e-POSHAN Abhiyaan 2.0
              </p>
              <p className="text-[11px] text-stone-500">
                Integrated Child Development Services (ICDS) National Rural Healthcare Portal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Universal Immunization (UIP) Verified
            </span>
            <span>•</span>
            <span>Toll-Free POSHAN: 14408</span>
            <span>•</span>
            <span>Childline: 1098</span>
            <span>•</span>
            <span>WHO Growth Standards (Z-Score)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
