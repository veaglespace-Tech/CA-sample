"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getDashboardPath, rolePath } from "../../../lib/auth";
import { validateName, validatePhone, validateEmail, validatePassword } from "../../../lib/validators";

// API Hooks
import { 
  useGetDashboardSummaryQuery, 
  useGetMeQuery, 
  useLogoutMutation, 
  useGetMyServicesQuery,
  useUpdateMeMutation
} from "../../../store/api/authApi";
import { useGetMyMessagesQuery } from "../../../store/api/messageApi";

// Components
import AdminDataView from "../../../components/admin/AdminDataView";
import DashboardSidebar from "../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";

// Sections
import OverviewSection from "../../../components/dashboard/sections/OverviewSection";
import ProfileSection from "../../../components/dashboard/sections/ProfileSection";
import MessagesSection from "../../../components/dashboard/sections/MessagesSection";
import DocumentsSection from "../../../components/dashboard/sections/DocumentsSection";
import ReferralsSection from "../../../components/dashboard/sections/ReferralsSection";
import AdminPermissionsView from "../../../features/admin-permissions/AdminPermissionsView";
import { useAdminPermissions } from "../../../features/admin-permissions/useAdminPermissions";
import ReviewsSection from "../../../components/dashboard/sections/ReviewsSection";

// Icons
import { 
  Home, FileText, MessageSquare, UserCircle,
  ClipboardList, CheckCircle, Calendar, 
  LayoutGrid, FolderOpen, Newspaper, Mail, ShieldCheck, Gift, PhoneCall, Star
} from "lucide-react";

export default function RoleDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 1. Auth & User State
  const token = useSelector((state) => state.auth?.token);
  const { data: meData, isLoading: isUserLoading, isError: isUserError } = useGetMeQuery(undefined, { skip: !token });
  const user = meData?.user || null;
  const isStaff = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canChangePassword = user?.role !== "SUPER_ADMIN";
  
  // 2. Data Queries
  const { data: summaryData } = useGetDashboardSummaryQuery(undefined, { 
    skip: !isStaff,
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });
  const { data: myServicesData } = useGetMyServicesQuery(undefined, { skip: isStaff });
  const { data: myMessagesData } = useGetMyMessagesQuery(undefined, { skip: !user, pollingInterval: 30000 });
  
  const myMessages = useMemo(() => myMessagesData?.data || [], [myMessagesData]);
  const myServicesList = useMemo(() => {
    const combined = [
      ...(myServicesData?.data?.leads || []).map(l => ({ ...l, isReg: false })), 
      ...(myServicesData?.data?.registrations || []).map(r => ({ ...r, isReg: true }))
    ];
    return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [myServicesData]);

  // Admin Permissions
  const { can } = useAdminPermissions(user);

  // 3. Mutations
  const [logoutMutation] = useLogoutMutation();
  const [updateMe, updateMeResult] = useUpdateMeMutation();

  // 4. Form State
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", password: "", oldPassword: "" });
  const [profileErrors, setProfileErrors] = useState({});

  // Sync profile form when user data loads
  useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        let userPhone = user.phone || "";
        if (userPhone && userPhone.length === 10 && !userPhone.startsWith('+')) {
          userPhone = '91' + userPhone;
        }
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: userPhone,
          password: "",
          oldPassword: "",
        });
      });
    }
    queueMicrotask(() => {
      setProfileErrors({});
    });
  }, [user]);

  // Redirect if not logged in or wrong role
  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!isUserLoading) {
      if (isUserError) router.replace("/login");
      else {
        const currentRolePath = pathname.split("/").filter(Boolean).at(-1);
        const expectedRolePath = rolePath[user?.role] || "user";
        if (currentRolePath !== expectedRolePath) {
          router.replace(getDashboardPath(user.role));
        }
      }
    }
  }, [token, isUserError, isUserLoading, user, pathname, router]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const newErrors = {};
    const nameErr = validateName(profileForm.name);
    const emailErr = validateEmail(profileForm.email);
    const phoneErr = validatePhone(profileForm.phone);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;

    if (canChangePassword) {
      const passwordErr = validatePassword(profileForm.password, true, 8, true);
      if (passwordErr) newErrors.password = passwordErr;
      if (profileForm.password && !profileForm.oldPassword) {
        newErrors.oldPassword = "Current password is required to set a new one.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors);
      return;
    }

    try {
      const payload = { name: profileForm.name, email: profileForm.email, phone: profileForm.phone };
      if (canChangePassword && profileForm.password) {
        payload.password = profileForm.password;
        payload.oldPassword = profileForm.oldPassword;
      }
      await updateMe(payload).unwrap();
      if (canChangePassword) setProfileForm((prev) => ({ ...prev, password: "", oldPassword: "" }));
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err?.data?.message || "Failed to update profile.");
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      router.replace("/login");
    } catch {}
  };

  const handleSectionChange = (sectionId) => {
    router.push(`${pathname}?section=${sectionId}`);
  };

  if (isUserLoading || (!user && !isUserError)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-navy">
        <span className="loading loading-spinner loading-lg text-gold"></span>
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-navy p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Session Expired</h2>
        <p className="text-slate-400 mb-6">Please sign in again to access your dashboard.</p>
        <Link href="/login" className="btn btn-primary rounded-sm px-8 font-bold uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    );
  }

  // Menu Definition
  const menuItems = isStaff ? [
    { id: "overview", label: "Dashboard", icon: <Home /> },
    { id: "users", label: "User Management", icon: <UserCircle />, hide: !can("users", "view") },
    { id: "leads", label: "Service Leads", icon: <ClipboardList />, hide: !can("leads", "view") },
    { id: "callbacks", label: "Callback Requests", icon: <PhoneCall />, hide: !can("leads", "view") },
    { id: "registrations", label: "Registrations", icon: <CheckCircle />, hide: !can("registrations", "view") },
    { id: "contacts", label: "Contact Queries", icon: <MessageSquare />, hide: !can("contacts", "view") },
    { id: "events", label: "Platform Events", icon: <Calendar />, hide: !can("events", "view") },
    { id: "plans", label: "Service Plans", icon: <LayoutGrid />, hide: !can("plans", "view") },
    { id: "articles", label: "Blog Articles", icon: <Newspaper />, hide: !can("articles", "view") },
    { id: "reviews", label: "Reviews", icon: <Star />, hide: !can("articles", "view") },
    { id: "repository", label: "Doc Repository", icon: <FolderOpen />, hide: !can("repository", "view") },
    { id: "newsletter", label: "Newsletter Mails", icon: <Mail />, hide: !can("newsletter", "view") },
    { id: "referrals", label: "Referrals", icon: <ClipboardList />, hide: !can("referrals", "view") },
    { id: "payments", label: "Paid Clients", icon: <ClipboardList />, hide: !can("payments", "view") },
    // SUPER_ADMIN only
    ...(isSuperAdmin ? [{ id: "permissions", label: "Staff Permissions", icon: <ShieldCheck />, superAdminOnly: true }] : []),
    { id: "profile", label: "My Profile", icon: <UserCircle /> },
  ].filter(item => !item.hide) : [
    { id: "overview", label: "Overview", icon: <Home /> },
    { id: "documents", label: "My Documents", icon: <FileText /> },
    { id: "messages", label: "Messages", icon: <MessageSquare />, count: myMessages.filter(m => !m.isRead && m.receiverId === user?.id).length },
    { id: "referrals", label: "Referrals", icon: <Gift /> },
    { id: "profile", label: "Profile", icon: <UserCircle /> },
  ];
  const validSections = ["overview", "documents", "messages", "users", "leads", "callbacks", "registrations", "events", "plans", "articles", "reviews", "repository", "profile", "newsletter", "contacts", "referrals", "payments", "permissions"];
  const activeSection = validSections.includes(searchParams.get("section")) ? searchParams.get("section") : "overview";
  const currentSection = menuItems.some((item) => item.id === activeSection) ? activeSection : "overview";

  console.log({
    AdminDataView: typeof AdminDataView,
    DashboardSidebar: typeof DashboardSidebar,
    DashboardHeader: typeof DashboardHeader,
    OverviewSection: typeof OverviewSection,
    ProfileSection: typeof ProfileSection,
    MessagesSection: typeof MessagesSection,
    DocumentsSection: typeof DocumentsSection,
    ReferralsSection: typeof ReferralsSection,
    AdminPermissionsView: typeof AdminPermissionsView,
    ReviewsSection: typeof ReviewsSection,
  });

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col bg-slate-50 overflow-hidden h-screen">
        <DashboardHeader 
          activeSection={currentSection}
          user={user}
          isStaff={isStaff}
          onLogout={logout}
          onNavigateToSection={handleSectionChange}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {currentSection === "overview" && (
              <OverviewSection 
                user={user}
                isStaff={isStaff}
                summary={summaryData?.data}
                activeServicesCount={myServicesList.length}
                pendingItemsCount={myMessages.filter(m => m.isDocRequest && !m.isRead).length}
                onNavigateToSection={handleSectionChange}
                myServicesList={myServicesList}
              />
            )}

            {currentSection === "profile" && (
              <ProfileSection 
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                handleProfileUpdate={handleProfileUpdate}
                isUpdating={updateMeResult.isLoading}
                errors={profileErrors}
                setErrors={setProfileErrors}
                isStaff={isStaff}
                canChangePassword={canChangePassword}
              />
            )}

            {isStaff && ["users", "leads", "callbacks", "registrations", "events", "plans", "articles", "repository", "newsletter", "contacts", "referrals", "payments"].includes(currentSection) && (
              <AdminDataView activeSection={currentSection} />
            )}

            {isStaff && currentSection === "reviews" && (
              <ReviewsSection />
            )}

            {isSuperAdmin && currentSection === "permissions" && (
              <AdminPermissionsView />
            )}

            {!isStaff && currentSection === "messages" && (
              <MessagesSection messages={myMessages} user={user} onNavigateToSection={handleSectionChange} />
            )}

            {!isStaff && currentSection === "documents" && (
              <DocumentsSection myServicesList={myServicesList} myMessages={myMessages} />
            )}

            {!isStaff && currentSection === "referrals" && (
              <ReferralsSection user={user} />
            )}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <DashboardSidebar 
          menuItems={menuItems}
          activeSection={currentSection}
          onSectionChange={handleSectionChange}
          onLogout={logout}
        />
      </div>
    </div>
  );
}
