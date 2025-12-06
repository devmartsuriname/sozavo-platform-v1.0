import PageTitle from "@/components/darkone/layout/PageTitle";
import { Link } from "react-router-dom";

const UIBreadcrumb = () => {
  return (
    <>
      <PageTitle title="Breadcrumb" subTitle="Base UI" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Breadcrumb Examples</h4></div>
            <div className="card-body">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">Home</li>
                </ol>
              </nav>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Library</li>
                </ol>
              </nav>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="#">Library</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Data</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIBreadcrumb;
