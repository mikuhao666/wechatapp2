/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Application } from './types';
import { getStoredApplications, saveApplications } from './data/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { ApplicationList } from './components/ApplicationList';
import { CertificateIssuance } from './components/CertificateIssuance';
import { ApprovalManagement } from './components/ApprovalManagement';
import { StatisticsView } from './components/StatisticsView';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { CertificatePrintModal } from './components/CertificatePrintModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { VerificationModal } from './components/VerificationModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; username: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('suizhou_qxj_session_user');
      return saved ? JSON.parse(saved) : { role: 'staff', username: '工作人员（李明）' };
    } catch {
      return { role: 'staff', username: '工作人员（李明）' };
    }
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('stats');

  // Core Data State (Applications)
  const [applications, setApplications] = useState<Application[]>([]);

  // Modals & Active Selections
  const [inspectApp, setInspectApp] = useState<Application | null>(null);
  const [printApp, setPrintApp] = useState<Application | null>(null);
  const [draftTargetAppId, setDraftTargetAppId] = useState<string | undefined>(undefined);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Initialize data from localStorage
  useEffect(() => {
    const list = getStoredApplications();
    setApplications(list);
  }, []);

  // Sync session
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('suizhou_qxj_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('suizhou_qxj_session_user');
    }
  }, [currentUser]);

  const handleLoginSuccess = (role: UserRole, username: string) => {
    setCurrentUser({ role, username });
    if (role === 'staff') {
      setCurrentTab('list');
    } else {
      setCurrentTab('approval');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchRole = () => {
    if (!currentUser) return;
    if (currentUser.role === 'staff') {
      setCurrentUser({ role: 'leader', username: '领导（王局长）' });
      setCurrentTab('approval');
    } else {
      setCurrentUser({ role: 'staff', username: '工作人员（李明）' });
      setCurrentTab('draft');
    }
  };

  // Workflow Handlers
  const handleStartDrafting = (app: Application) => {
    setDraftTargetAppId(app.id);
    setCurrentTab('draft');
  };

  const handleStartApproval = (app: Application) => {
    setCurrentTab('approval');
  };

  const handleDataUpdated = (updated: Application[]) => {
    setApplications(updated);
    saveApplications(updated);
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingDraftCount = applications.filter(a => a.status === '待受理' || a.status === '开具中').length;
  const pendingApprovalCount = applications.filter(a => a.status === '待审批').length;

  return (
    <div className="h-screen bg-[#f0f2f5] text-slate-800 flex overflow-hidden relative font-sans select-text">
      
      {/* Left Full-Height Elegant Dark Sidebar (#001529) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        currentRole={currentUser.role}
        currentUserName={currentUser.username}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        pendingDraftCount={pendingDraftCount}
        pendingApprovalCount={pendingApprovalCount}
        totalApplicationsCount={applications.length}
      />

      {/* Right Column: Top Header + Main Content Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header Navbar */}
        <Navbar
          currentRole={currentUser.role}
          currentUserName={currentUser.username}
          currentTab={currentTab}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
          pendingApprovalCount={pendingApprovalCount}
        />

        {/* Scrollable Content Canvas in #f0f2f5 */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#f0f2f5]">
          <div className="max-w-[1600px] mx-auto">
            {currentTab === 'stats' && (
              <StatisticsView applications={applications} />
            )}

            {currentTab === 'list' && (
              <ApplicationList
                applications={applications}
                currentRole={currentUser.role}
                onViewDetail={(app) => setInspectApp(app)}
                onDraftCertificate={handleStartDrafting}
                onApprove={handleStartApproval}
                onPrintCertificate={(app) => setPrintApp(app)}
                onAddNewApplication={() => setShowNewModal(true)}
              />
            )}

            {currentTab === 'draft' && (
              <CertificateIssuance
                applications={applications}
                selectedAppId={draftTargetAppId}
                currentRole={currentUser.role}
                currentUserName={currentUser.username}
                onSuccessSubmit={(updated) => {
                  handleDataUpdated(updated);
                  setCurrentTab('list');
                }}
                onViewMaterials={(app) => setInspectApp(app)}
              />
            )}

            {currentTab === 'approval' && (
              <ApprovalManagement
                applications={applications}
                currentRole={currentUser.role}
                currentUserName={currentUser.username}
                onUpdateApplications={handleDataUpdated}
                onViewMaterials={(app) => setInspectApp(app)}
              />
            )}

            {currentTab === 'verify' && (
              <VerificationModal
                applications={applications}
                onOpenPrint={(app) => setPrintApp(app)}
              />
            )}

            {currentTab === 'export' && (
              <StandaloneExportModal />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {inspectApp && (
        <ApplicationDetailModal
          application={inspectApp}
          currentRole={currentUser.role}
          onClose={() => setInspectApp(null)}
          onDraftCertificate={(app) => {
            setInspectApp(null);
            handleStartDrafting(app);
          }}
          onApprove={(app) => {
            setInspectApp(null);
            handleStartApproval(app);
          }}
          onPrintCertificate={(app) => {
            setInspectApp(null);
            setPrintApp(app);
          }}
        />
      )}

      {printApp && (
        <CertificatePrintModal
          application={printApp}
          onClose={() => setPrintApp(null)}
        />
      )}

      {showNewModal && (
        <NewApplicationModal
          onClose={() => setShowNewModal(false)}
          onAdded={(updated) => handleDataUpdated(updated)}
        />
      )}
    </div>
  );
}
