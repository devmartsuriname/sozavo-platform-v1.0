import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCaseById, 
  getCaseTimeline, 
  type CaseDetailWithRelations, 
  type TimelineEvent 
} from "@/integrations/supabase/queries/cases";
import {
  getEligibilitySummary,
  getEligibilityRulesForService,
  type EligibilityEvaluation,
  type EligibilityRule,
} from "@/integrations/supabase/queries/eligibility";
import {
  getCaseDocuments,
  type CaseDocument,
} from "@/integrations/supabase/queries/documents";
import {
  getCasePayments,
  type CasePayment,
} from "@/integrations/supabase/queries/payments";
import {
  getFraudSignalsByCase,
  getFraudRiskScoreByCase,
  type CaseFraudSignal,
  type CaseFraudRiskScore,
} from "@/integrations/supabase/queries/fraud";
import PageTitle from "@/components/darkone/layout/PageTitle";
import CaseDetailHeader from "@/components/admin/cases/CaseDetailHeader";
import CaseInfoPanel from "@/components/admin/cases/CaseInfoPanel";
import CitizenInfoPanel from "@/components/admin/cases/CitizenInfoPanel";
import ServiceInfoPanel from "@/components/admin/cases/ServiceInfoPanel";
import CaseTimeline from "@/components/admin/cases/CaseTimeline";
import CaseEligibilityPanel from "@/components/admin/cases/CaseEligibilityPanel";
import CaseDocumentsPanel from "@/components/admin/cases/CaseDocumentsPanel";
import CasePaymentsPanel from "@/components/admin/cases/CasePaymentsPanel";
import CaseFraudPanel from "@/components/admin/cases/CaseFraudPanel";

import type { Enums } from "@/integrations/supabase/types";

type CaseStatus = Enums<"case_status">;

const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Case data state
  const [isLoadingCase, setIsLoadingCase] = useState(true);
  const [errorCase, setErrorCase] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<CaseDetailWithRelations | null>(null);

  // Timeline state
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [errorTimeline, setErrorTimeline] = useState<string | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[] | null>(null);

  // Eligibility state
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);
  const [errorEligibility, setErrorEligibility] = useState<string | null>(null);
  const [eligibilityEval, setEligibilityEval] = useState<EligibilityEvaluation | null>(null);
  const [eligibilityRules, setEligibilityRules] = useState<EligibilityRule[] | null>(null);

  // Documents state
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [errorDocuments, setErrorDocuments] = useState<string | null>(null);
  const [documents, setDocuments] = useState<CaseDocument[] | null>(null);

  // Payments state
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [errorPayments, setErrorPayments] = useState<string | null>(null);
  const [payments, setPayments] = useState<CasePayment[] | null>(null);

  // Fraud state
  const [isLoadingFraud, setIsLoadingFraud] = useState(true);
  const [errorFraud, setErrorFraud] = useState<string | null>(null);
  const [fraudSignals, setFraudSignals] = useState<CaseFraudSignal[] | null>(null);
  const [fraudRiskScore, setFraudRiskScore] = useState<CaseFraudRiskScore | null>(null);

  // Refresh counter to trigger re-fetches
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle status change - refresh case and timeline data
  const handleStatusChanged = (newStatus: CaseStatus) => {
    // Optimistically update the status in local state
    if (caseData) {
      setCaseData({ ...caseData, current_status: newStatus });
    }
    // Trigger a refresh of all data
    setRefreshKey((prev) => prev + 1);
  };

  // Fetch case details
  useEffect(() => {
    if (!id) return;

    const fetchCase = async () => {
      setIsLoadingCase(true);
      setErrorCase(null);

      const result = await getCaseById(id);

      if (result.error) {
        setErrorCase(result.error.message);
        setCaseData(null);
      } else {
        setCaseData(result.data);
      }

      setIsLoadingCase(false);
    };

    fetchCase();
  }, [id, refreshKey]);

  // Fetch timeline
  useEffect(() => {
    if (!id) return;

    const fetchTimeline = async () => {
      setIsLoadingTimeline(true);
      setErrorTimeline(null);

      const result = await getCaseTimeline(id);

      if (result.error) {
        setErrorTimeline(result.error.message);
        setTimelineEvents(null);
      } else {
        setTimelineEvents(result.data);
      }

      setIsLoadingTimeline(false);
    };

    fetchTimeline();
  }, [id, refreshKey]);

  // Fetch eligibility data after case is loaded
  useEffect(() => {
    if (!id || !caseData) return;

    const fetchEligibility = async () => {
      setIsLoadingEligibility(true);
      setErrorEligibility(null);

      // Fetch evaluation
      const evalResult = await getEligibilitySummary(id);
      if (evalResult.error) {
        setErrorEligibility(evalResult.error.message);
      } else {
        setEligibilityEval(evalResult.data);
      }

      // Fetch rules for service type
      if (caseData.service_type_id) {
        const rulesResult = await getEligibilityRulesForService(caseData.service_type_id);
        if (!rulesResult.error) {
          setEligibilityRules(rulesResult.data);
        }
      }

      setIsLoadingEligibility(false);
    };

    fetchEligibility();
  }, [id, caseData]);

  // Fetch documents
  useEffect(() => {
    if (!id) return;

    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      setErrorDocuments(null);

      const result = await getCaseDocuments(id);

      if (result.error) {
        setErrorDocuments(result.error.message);
        setDocuments(null);
      } else {
        setDocuments(result.data);
      }

      setIsLoadingDocuments(false);
    };

    fetchDocuments();
  }, [id]);

  // Fetch payments
  useEffect(() => {
    if (!id) return;

    const fetchPayments = async () => {
      setIsLoadingPayments(true);
      setErrorPayments(null);

      const result = await getCasePayments(id);

      if (result.error) {
        setErrorPayments(result.error.message);
        setPayments(null);
      } else {
        setPayments(result.data);
      }

      setIsLoadingPayments(false);
    };

    fetchPayments();
  }, [id]);

  // Fetch fraud data
  useEffect(() => {
    if (!id) return;

    const fetchFraudData = async () => {
      setIsLoadingFraud(true);
      setErrorFraud(null);

      // Fetch signals and risk score in parallel
      const [signalsResult, riskScoreResult] = await Promise.all([
        getFraudSignalsByCase(id),
        getFraudRiskScoreByCase(id),
      ]);

      if (signalsResult.error) {
        setErrorFraud(signalsResult.error.message);
        setFraudSignals(null);
      } else {
        setFraudSignals(signalsResult.data);
      }

      if (riskScoreResult.error && !signalsResult.error) {
        // Only set error if signals also failed, otherwise just show signals
        setErrorFraud(riskScoreResult.error.message);
      }
      setFraudRiskScore(riskScoreResult.data);

      setIsLoadingFraud(false);
    };

    fetchFraudData();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/cases');
  };

  // Loading state for case
  if (isLoadingCase) {
    return (
      <>
        <PageTitle title="Cases" subTitle="Case Detail" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading case details...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (errorCase) {
    return (
      <>
        <PageTitle title="Cases" subTitle="Case Detail" />
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              Error loading case: {errorCase}
            </div>
            <button className="btn btn-secondary" onClick={handleBack}>
              <i className="bx bx-arrow-back me-1"></i>
              Back to Cases
            </button>
          </div>
        </div>
      </>
    );
  }

  // Case not found
  if (!caseData) {
    return (
      <>
        <PageTitle title="Cases" subTitle="Case Detail" />
        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <i className="bx bx-info-circle me-2"></i>
              Case not found
            </div>
            <button className="btn btn-secondary" onClick={handleBack}>
              <i className="bx bx-arrow-back me-1"></i>
              Back to Cases
            </button>
          </div>
        </div>
      </>
    );
  }

  // Build citizen name
  const citizenName = caseData.citizens 
    ? `${caseData.citizens.first_name} ${caseData.citizens.last_name}`
    : null;

  // Build service name
  const serviceName = caseData.service_types?.name || null;

  return (
    <>
      <PageTitle title="Cases" subTitle="Case Detail" />
      
      <CaseDetailHeader
        caseReference={caseData.case_reference}
        status={caseData.current_status}
        citizenName={citizenName}
        serviceName={serviceName}
        caseId={caseData.id}
        onBack={handleBack}
        onStatusChanged={handleStatusChanged}
      />

      <div className="row">
        {/* Left Column - Info Panels */}
        <div className="col-lg-6">
          <CaseInfoPanel caseData={caseData} />
          <CitizenInfoPanel citizen={caseData.citizens} />
          <ServiceInfoPanel serviceType={caseData.service_types} />
        </div>

        {/* Right Column - Timeline & Placeholders */}
        <div className="col-lg-6">
          <CaseTimeline
            events={timelineEvents}
            isLoading={isLoadingTimeline}
            error={errorTimeline}
          />
          <CaseEligibilityPanel
            evaluation={eligibilityEval}
            rules={eligibilityRules}
            isLoading={isLoadingEligibility}
            error={errorEligibility}
          />
          <CaseDocumentsPanel
            documents={documents}
            isLoading={isLoadingDocuments}
            error={errorDocuments}
          />
          <CasePaymentsPanel
            payments={payments}
            isLoading={isLoadingPayments}
            error={errorPayments}
          />
          <CaseFraudPanel
            signals={fraudSignals}
            riskScore={fraudRiskScore}
            isLoading={isLoadingFraud}
            error={errorFraud}
          />
        </div>
      </div>
    </>
  );
};

export default CaseDetailPage;
