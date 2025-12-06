import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Enums } from "@/integrations/supabase/types";
import { getCases, type CaseWithRelations } from "@/integrations/supabase/queries/cases";
import PageTitle from "@/components/darkone/layout/PageTitle";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import CaseFilters from "@/components/admin/cases/CaseFilters";
import CaseListTable from "@/components/admin/cases/CaseListTable";

type CaseStatus = Enums<"case_status">;

const CasesIndexPage = () => {
  const navigate = useNavigate();
  
  // Filter state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CaseStatus | undefined>();
  const [serviceTypeId, setServiceTypeId] = useState<string | undefined>();
  const [officeId, setOfficeId] = useState<string | undefined>();
  
  // Data state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CaseWithRelations[] | null>(null);
  const [count, setCount] = useState<number | null>(null);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await getCases({
      page,
      pageSize,
      search: search || undefined,
      status,
      serviceTypeId,
      officeId,
    });
    
    if (result.error) {
      setError(result.error.message);
      setData(null);
      setCount(null);
    } else {
      setData(result.data);
      setCount(result.count);
    }
    
    setIsLoading(false);
  }, [page, pageSize, search, status, serviceTypeId, officeId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, serviceTypeId, officeId]);

  const handleViewCase = (id: string) => {
    navigate(`/admin/cases/${id}`);
  };

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <>
      <PageTitle title="Cases" subTitle="Overview" />
      
      <div className="row">
        <div className="col-12">
          <DarkoneCard title="Case Management" titleTag="h5">
            <CaseFilters
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              serviceTypeId={serviceTypeId}
              onServiceTypeChange={setServiceTypeId}
              officeId={officeId}
              onOfficeChange={setOfficeId}
            />
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bx bx-error-circle me-2"></i>
                {error}
              </div>
            )}
            
            <CaseListTable
              cases={data || []}
              isLoading={isLoading}
              onViewCase={handleViewCase}
            />
            
            {/* Pagination */}
            {!isLoading && count !== null && count > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, count)} of {count} cases
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </DarkoneCard>
        </div>
      </div>
    </>
  );
};

export default CasesIndexPage;
