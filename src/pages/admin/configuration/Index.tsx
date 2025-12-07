import { useEffect, useState } from "react";
import PageTitle from "@/components/darkone/layout/PageTitle";
import { DarkoneCard } from "@/components/darkone/ui";
import {
  getServiceTypes,
  getOffices,
  getWorkflowDefinitions,
  getEligibilityRules,
  getActiveServiceTypesCount,
  getActiveOfficesCount,
  getWorkflowDefinitionsCount,
  getEligibilityRulesCount,
  type ServiceTypeRow,
  type OfficeRow,
  type WorkflowDefinitionWithService,
  type EligibilityRuleWithService,
} from "@/integrations/supabase/queries/config";

/**
 * Phase 9D-2F: Configuration Overview Page (Read-Only)
 * 
 * Displays system configuration data:
 * - Service Types
 * - Offices
 * - Workflow Definitions
 * - Eligibility Rules
 * 
 * Strictly read-only - no mutations allowed.
 */

interface ConfigCounts {
  serviceTypes: number;
  offices: number;
  workflows: number;
  eligibilityRules: number;
}

const ConfigurationIndex = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeRow[]>([]);
  const [offices, setOffices] = useState<OfficeRow[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowDefinitionWithService[]>([]);
  const [eligibilityRules, setEligibilityRules] = useState<EligibilityRuleWithService[]>([]);
  const [counts, setCounts] = useState<ConfigCounts>({
    serviceTypes: 0,
    offices: 0,
    workflows: 0,
    eligibilityRules: 0,
  });

  useEffect(() => {
    const loadConfigData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [
          serviceTypesResult,
          officesResult,
          workflowsResult,
          eligibilityResult,
          stCountResult,
          offCountResult,
          wfCountResult,
          erCountResult,
        ] = await Promise.all([
          getServiceTypes(20),
          getOffices(20),
          getWorkflowDefinitions(20),
          getEligibilityRules(20),
          getActiveServiceTypesCount(),
          getActiveOfficesCount(),
          getWorkflowDefinitionsCount(),
          getEligibilityRulesCount(),
        ]);

        // Check for errors
        const errors = [
          serviceTypesResult.error,
          officesResult.error,
          workflowsResult.error,
          eligibilityResult.error,
        ].filter(Boolean);

        if (errors.length > 0) {
          setError("We were unable to load configuration data. Please try again or contact support if the problem persists.");
          return;
        }

        // Set data
        setServiceTypes(serviceTypesResult.data || []);
        setOffices(officesResult.data || []);
        setWorkflows(workflowsResult.data || []);
        setEligibilityRules(eligibilityResult.data || []);
        setCounts({
          serviceTypes: stCountResult.count || 0,
          offices: offCountResult.count || 0,
          workflows: wfCountResult.count || 0,
          eligibilityRules: erCountResult.count || 0,
        });
      } catch (err) {
        setError("An unexpected error occurred while loading configuration data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfigData();
  }, []);

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <PageTitle title="Configuration" subTitle="Overview" />

      {/* Error Alert */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row">
        <div className="col-md-6 col-xl-3">
          <DarkoneCard>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar-sm">
                  <span className="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                    <i className="bx bx-category"></i>
                  </span>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">Service Types</p>
                {isLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                ) : (
                  <h4 className="mb-0">{counts.serviceTypes} <span className="text-muted fs-12 fw-normal">active</span></h4>
                )}
              </div>
            </div>
          </DarkoneCard>
        </div>

        <div className="col-md-6 col-xl-3">
          <DarkoneCard>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar-sm">
                  <span className="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                    <i className="bx bx-building-house"></i>
                  </span>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">Offices</p>
                {isLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                ) : (
                  <h4 className="mb-0">{counts.offices} <span className="text-muted fs-12 fw-normal">active</span></h4>
                )}
              </div>
            </div>
          </DarkoneCard>
        </div>

        <div className="col-md-6 col-xl-3">
          <DarkoneCard>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar-sm">
                  <span className="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                    <i className="bx bx-git-branch"></i>
                  </span>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">Workflow Transitions</p>
                {isLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                ) : (
                  <h4 className="mb-0">{counts.workflows} <span className="text-muted fs-12 fw-normal">total</span></h4>
                )}
              </div>
            </div>
          </DarkoneCard>
        </div>

        <div className="col-md-6 col-xl-3">
          <DarkoneCard>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar-sm">
                  <span className="avatar-title bg-info-subtle text-info rounded-circle fs-3">
                    <i className="bx bx-check-shield"></i>
                  </span>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">Eligibility Rules</p>
                {isLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                ) : (
                  <h4 className="mb-0">{counts.eligibilityRules} <span className="text-muted fs-12 fw-normal">total</span></h4>
                )}
              </div>
            </div>
          </DarkoneCard>
        </div>
      </div>

      {/* Service Types Table */}
      <div className="row">
        <div className="col-12">
          <DarkoneCard title="Service Types" titleTag="h5">
            {isLoading ? (
              <div className="placeholder-glow">
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12" style={{ height: "40px" }}></div>
              </div>
            ) : serviceTypes.length === 0 ? (
              <p className="text-muted mb-0">No service types configured.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceTypes.map((st) => (
                        <tr key={st.id}>
                          <td><code>{st.code}</code></td>
                          <td>{st.name}</td>
                          <td>
                            <span title={st.description || ""}>
                              {st.description ? (st.description.length > 50 ? st.description.slice(0, 50) + "..." : st.description) : "-"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${st.is_active ? "success" : "secondary"}`}>
                              {st.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted fs-12 mt-2 mb-0">
                  Showing up to 20 records
                </p>
              </>
            )}
          </DarkoneCard>
        </div>
      </div>

      {/* Offices Table */}
      <div className="row">
        <div className="col-12">
          <DarkoneCard title="Offices" titleTag="h5">
            {isLoading ? (
              <div className="placeholder-glow">
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12" style={{ height: "40px" }}></div>
              </div>
            ) : offices.length === 0 ? (
              <p className="text-muted mb-0">No offices configured.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>District</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offices.map((office) => (
                        <tr key={office.id}>
                          <td>{office.name}</td>
                          <td>{office.district_id}</td>
                          <td>
                            <span title={office.address || ""}>
                              {office.address ? (office.address.length > 40 ? office.address.slice(0, 40) + "..." : office.address) : "-"}
                            </span>
                          </td>
                          <td>{office.phone || "-"}</td>
                          <td>
                            <span className={`badge bg-${office.is_active ? "success" : "secondary"}`}>
                              {office.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted fs-12 mt-2 mb-0">
                  Showing up to 20 records
                </p>
              </>
            )}
          </DarkoneCard>
        </div>
      </div>

      {/* Workflow Transitions Table */}
      <div className="row">
        <div className="col-12">
          <DarkoneCard title="Workflow Transitions" titleTag="h5">
            {isLoading ? (
              <div className="placeholder-glow">
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12" style={{ height: "40px" }}></div>
              </div>
            ) : workflows.length === 0 ? (
              <p className="text-muted mb-0">No workflow transitions configured.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Service</th>
                        <th>From Status</th>
                        <th>To Status</th>
                        <th>Required Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflows.map((wf) => (
                        <tr key={wf.id}>
                          <td>
                            <code>{wf.service_types?.code || "-"}</code>
                            {wf.service_types?.name && (
                              <span className="text-muted ms-1 fs-12">({wf.service_types.name})</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {formatStatus(wf.from_status)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary">
                              {formatStatus(wf.to_status)}
                            </span>
                          </td>
                          <td>{formatRole(wf.required_role)}</td>
                          <td>
                            <span className={`badge bg-${wf.is_active ? "success" : "secondary"}`}>
                              {wf.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted fs-12 mt-2 mb-0">
                  Showing up to 20 records
                </p>
              </>
            )}
          </DarkoneCard>
        </div>
      </div>

      {/* Eligibility Rules Table */}
      <div className="row">
        <div className="col-12">
          <DarkoneCard title="Eligibility Rules" titleTag="h5">
            {isLoading ? (
              <div className="placeholder-glow">
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12 mb-2" style={{ height: "40px" }}></div>
                <div className="placeholder col-12" style={{ height: "40px" }}></div>
              </div>
            ) : eligibilityRules.length === 0 ? (
              <p className="text-muted mb-0">No eligibility rules configured.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Service</th>
                        <th>Rule Name</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Mandatory</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligibilityRules.map((rule) => (
                        <tr key={rule.id}>
                          <td>
                            <code>{rule.service_types?.code || "-"}</code>
                          </td>
                          <td>
                            <span title={rule.error_message}>
                              {rule.rule_name.length > 30 ? rule.rule_name.slice(0, 30) + "..." : rule.rule_name}
                            </span>
                          </td>
                          <td><code>{rule.rule_type}</code></td>
                          <td className="text-center">{rule.priority}</td>
                          <td>
                            <span className={`badge bg-${rule.is_mandatory ? "primary" : "secondary"}`}>
                              {rule.is_mandatory ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${rule.is_active ? "success" : "secondary"}`}>
                              {rule.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted fs-12 mt-2 mb-0">
                  Showing up to 20 records
                </p>
              </>
            )}
          </DarkoneCard>
        </div>
      </div>
    </>
  );
};

export default ConfigurationIndex;
