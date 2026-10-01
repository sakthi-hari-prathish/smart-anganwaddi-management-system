import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { LoginModal } from './components/auth/LoginModal';
import { 
  UserRole, 
  Child, 
  StockItem, 
  StockUsageLog, 
  StockRequisition, 
  AnganwadiCenter, 
  Announcement, 
  NotificationAlert, 
  MealItem,
  UserProfile,
  SidebarSection,
  HealthSubSection
} from './types';
import { 
  INITIAL_CHILDREN, 
  INITIAL_STOCK_ITEMS, 
  INITIAL_CENTERS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REQUISITIONS, 
  INITIAL_MEAL_PLAN,
  DEMO_PROFILES 
} from './data/mockData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake, 
  HelpCircle,
  ExternalLink,
  KeyRound,
  LogIn,
  Building2,
  ChevronRight,
  ArrowRight,
  User,
  Lock,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [activeSection, setActiveSection] = useState<SidebarSection>('home');
  const [healthSubSection, setHealthSubSection] = useState<HealthSubSection>('overview');

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isSwitchAccountMode, setIsSwitchAccountMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [selectedParentChildId, setSelectedParentChildId] = useState<string>('ch-01');

  // Application Data States
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
      stockItemName: 'Skimmed Milk Powder',
      quantityUsed: 2.0,
      unit: 'kg',
      date: 'Today, 09:15 AM',
      purpose: 'Prepared 5.5L warm milk for morning snack',
      loggedBy: 'Sunita Devi (Worker)',
    },
  ]);
  const [requisitions, setRequisitions] = useState<StockRequisition[]>(INITIAL_REQUISITIONS);
  const [centers, setCenters] = useState<AnganwadiCenter[]>(INITIAL_CENTERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);
  const [mealPlan] = useState<MealItem[]>(INITIAL_MEAL_PLAN);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectSection = (section: SidebarSection, subSection?: HealthSubSection) => {
    setActiveSection(section);
    if (subSection) {
      setHealthSubSection(subSection);
    }
  };

  // Switch role handler (synchronizes currentUser profile with selected role)
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setActiveSection('home');
    setHealthSubSection('overview');

    const matchedProfile = DEMO_PROFILES.find((p) => p.role === role) || DEMO_PROFILES[0];
    setCurrentUser(matchedProfile);

    if (role === 'parent' && matchedProfile.childId) {
      setSelectedParentChildId(matchedProfile.childId);
    }

    showToast(`Switched active view to ${role.toUpperCase()} role`);
  };

  // Authenticated login callback
  const handleLoginAs = (role: UserRole, userProfile: UserProfile) => {
    setCurrentRole(role);
    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    setActiveSection('home');
    setHealthSubSection('overview');

    if (role === 'parent' && userProfile.childId) {
      setSelectedParentChildId(userProfile.childId);
    }

    showToast(`Authenticated successfully as ${userProfile.name} (${role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Logged out of Anganwadi Care portal.');
  };

  // Update a child's record (e.g. from Worker edits or BMI calculator)
  const handleUpdateChild = (updatedChild: Child) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === updatedChild.id ? updatedChild : c))
    );
    showToast(`Updated health & growth record for ${updatedChild.name}`);

    // If worker added new clinical record, generate a notification for the parent
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `Health Record Updated: ${updatedChild.name}`,
      message: `Anganwadi Helper logged latest growth (BMI: ${updatedChild.bmi || 'Normal'}) at Rampur Center.`,
      timestamp: 'Just now',
      type: 'info',
      read: false,
      roleTarget: 'parent',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Log stock consumption (by Worker)
  const handleLogStockUsage = (
    stockId: string,
    quantity: number,
    purpose: string
  ) => {
    const item = stockItems.find((s) => s.id === stockId);
    if (!item) return;

    if (quantity > item.currentlyAvailable) {
      showToast('Error: Quantity exceeds available stock');
      return;
    }

    const updatedItems = stockItems.map((s) => {
      if (s.id === stockId) {
        return {
          ...s,
          currentlyAvailable: parseFloat((s.currentlyAvailable - quantity).toFixed(1)),
        };
      }
      return s;
    });

    setStockItems(updatedItems);

    const newLog: StockUsageLog = {
      id: `log-${Date.now()}`,
      stockItemId: stockId,
      stockItemName: item.name,
      quantityUsed: quantity,
      unit: item.unit,
      date: 'Today, Just now',
      purpose: purpose || 'Daily center meal cooking',
      loggedBy: 'Sunita Devi (Worker)',
    };

    setUsageLogs([newLog, ...usageLogs]);
    showToast(`Logged ${quantity} ${item.unit} of ${item.name}`);

    // Low stock trigger alert
    const remaining = item.currentlyAvailable - quantity;
    if (remaining <= item.thresholdLowStock) {
      const lowStockNotif: NotificationAlert = {
        id: `notif-${Date.now()}`,
        title: `Low Stock Alert: ${item.name}`,
        message: `Current stock (${remaining} ${item.unit}) is below minimum threshold (${item.thresholdLowStock} ${item.unit}). Restock requested.`,
        timestamp: 'Just now',
        type: 'alert',
        read: false,
        roleTarget: 'worker',
      };
      setNotifications((prev) => [lowStockNotif, ...prev]);
    }
  };

  // Request new stock (Worker -> Supervisor)
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
      workerName: 'Sunita Devi',
      itemName,
      quantityRequested: quantity,
      unit,
      urgency,
      reason,
      status: 'Pending',
      dateRequested: 'Today',
    };

    setRequisitions([newReq, ...requisitions]);
    showToast(`Submitted requisition for ${quantity} ${unit} of ${itemName}`);

    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `New Stock Requisition: ${itemName}`,
      message: `Rampur Center requested ${quantity} ${unit} (${urgency} urgency) for CDPO approval.`,
      timestamp: 'Just now',
      type: 'warning',
      read: false,
      roleTarget: 'supervisor',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Supervisor approves requisition
  const handleApproveRequisition = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Approved' } : r))
    );
    showToast('Requisition approved and dispatched to Rampur Center');

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
  const parentChild =
    childrenList.find((c) => c.id === selectedParentChildId) ||
    childrenList.find((c) => c.id === currentUser.childId) ||
    childrenList[0];

  // If user is logged out, render the Official Government Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-emerald-300 selection:text-emerald-950 font-sans">
        <header className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-md">
              🏛️
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg font-serif">
                Ministry of Women & Child Development
              </h1>
              <p className="text-xs text-stone-400">
                POSHAN Abhiyaan 2.0 • Anganwadi Management System
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
            Govt. of India
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="inline-block p-3 rounded-2xl bg-emerald-50 text-3xl mb-1">
                🧒
              </span>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Official Portal Sign-In
              </h2>
              <p className="text-xs text-stone-500">
                Select your role, enter credentials, and access your dashboard
              </p>
            </div>

            <button
              onClick={() => {
                setIsSwitchAccountMode(false);
                setShowLoginModal(true);
              }}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Open Authenticated Login Form</span>
            </button>

            {/* Quick 1-click Demo Accounts for Reviewers */}
            <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
              <span className="text-[11px] font-bold text-stone-400 block text-center uppercase tracking-wider">
                1-Click Quick Demo Sign-In
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleLoginAs('parent', DEMO_PROFILES[0])}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👨‍👩‍👦</span>
                    <span>Sign in as Parent (Pooja Sharma)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>

                <button
                  onClick={() => handleLoginAs('worker', DEMO_PROFILES[2])}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👩‍🏫</span>
                    <span>Sign in as Worker (Sunita Devi)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700" />
                </button>

                <button
                  onClick={() => handleLoginAs('supervisor', DEMO_PROFILES[3])}
                  className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-semibold flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span>Sign in as Supervisor (Meera Rao)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-700" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-stone-500 border-t border-stone-800">
          POSHAN Abhiyaan 2.0 • Integrated Child Development Services (ICDS) • Helpline: 14408
        </footer>

        {/* Modal for manual credentials entry */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginAs={handleLoginAs}
          currentRole={currentRole}
          isSwitchAccount={isSwitchAccountMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
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
        onOpenLoginModal={() => {
          setIsSwitchAccountMode(true);
          setShowLoginModal(true);
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Layout: Left Vertical Sidebar + Main Content Area */}
      <div className="flex-1 flex w-full relative">
        {/* Left Vertical Sidebar Dashboard */}
        <Sidebar
          currentUser={currentUser}
          currentRole={currentRole}
          activeSection={activeSection}
          healthSubSection={healthSubSection}
          onSelectSection={handleSelectSection}
          onSwitchAccount={() => {
            setIsSwitchAccountMode(true);
            setShowLoginModal(true);
          }}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          badgeCounts={{
            alerts: notifications.filter((n) => !n.read).length,
            pendingRequisitions: requisitions.filter((r) => r.status === 'Pending').length,
            lowStock: stockItems.filter((s) => s.currentlyAvailable <= s.thresholdLowStock).length,
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Active Breadcrumb / Section Header Banner */}
          <div className="mb-4 bg-white border border-stone-200/90 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-stone-400 font-medium">Active Section:</span>
              <strong className="text-stone-900 font-bold capitalize flex items-center gap-1.5">
                <span>{activeSection}</span>
                {activeSection === 'health' && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-emerald-700">{healthSubSection}</span>
                  </>
                )}
              </strong>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-stone-400 font-medium hidden sm:inline">Role View:</span>
              <span className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase ${
                currentRole === 'parent'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : currentRole === 'worker'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
              }`}>
                {currentRole}
              </span>

              <button
                onClick={() => {
                  setIsSwitchAccountMode(true);
                  setShowLoginModal(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                title="Switch Account (requires Role, Username, Password)"
              >
                <KeyRound className="w-3 h-3 text-emerald-400" />
                <span>Switch Account</span>
              </button>
            </div>
          </div>

          {/* Dynamic Role Dashboard Rendering */}
          {currentRole === 'parent' && (
            <ParentDashboard
              child={parentChild}
              mealPlan={mealPlan}
              announcements={announcements}
              availableChildren={childrenList}
              onSelectChild={setSelectedParentChildId}
              activeSection={activeSection}
              healthSubSection={healthSubSection}
              onNavigateSection={handleSelectSection}
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
              activeSection={activeSection}
              healthSubSection={healthSubSection}
              onNavigateSection={handleSelectSection}
            />
          )}

          {currentRole === 'supervisor' && (
            <SupervisorDashboard
              centers={centers}
              requisitions={requisitions}
              onApproveRequisition={handleApproveRequisition}
              onBroadcastNotice={handleBroadcastNotice}
              childrenList={childrenList}
              activeSection={activeSection}
              healthSubSection={healthSubSection}
              onNavigateSection={handleSelectSection}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authentication / Separate Login Experiences Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginAs={handleLoginAs}
        currentRole={currentRole}
        isSwitchAccount={isSwitchAccountMode}
      />

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-stone-200 text-sm">
                Anganwadi Care • e-POSHAN Abhiyaan 2.0
              </p>
              <p className="text-[11px] text-stone-500">
                Integrated Child Development Services (ICDS) National Portal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role-Based Access Control (RBAC) Verified
            </span>
            <span>•</span>
            <span>Toll-Free POSHAN: 14408</span>
            <span>•</span>
            <span>Childline: 1098</span>
            <span>•</span>
            <span>WHO Child Growth Standards (Z-Score)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
