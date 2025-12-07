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
import PageTitle from "@/components/darkone/layout/PageTitle";
import CaseDetailHeader from "@/components/admin/cases/CaseDetailHeader";
import CaseInfoPanel from "@/components/admin/cases/CaseInfoPanel";
import CitizenInfoPanel from "@/components/admin/cases/CitizenInfoPanel";
import ServiceInfoPanel from "@/components/admin/cases/ServiceInfoPanel";
import CaseTimeline from "@/components/admin/cases/CaseTimeline";
import CaseEligibilityPanel from "@/components/admin/cases/CaseEligibilityPanel";
import CaseDocumentsPanel from "@/components/admin/cases/CaseDocumentsPanel";
import CasePaymentsPanel from "@/components/admin/cases/CasePaymentsPanel";
import CaseFraudPlaceholder from "@/components/admin/cases/placeholders/CaseFraudPlaceholder";

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
  }, [id]);

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
  }, [id]);

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
        onBack={handleBack}
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
          <CaseFraudPlaceholder />
        </div>
      </div>
    </>
  );
};

export default CaseDetailPage;
