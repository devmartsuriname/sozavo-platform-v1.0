import PageTitle from "@/components/darkone/layout/PageTitle";
import { useLocation } from "react-router-dom";

const LayoutsPlaceholder = () => {
  const location = useLocation();
  
  // Extract layout name from path
  const pathParts = location.pathname.split('/');
  const layoutName = pathParts[pathParts.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <>
      <PageTitle title={layoutName} subTitle="Layouts" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="bx bx-layout fs-48 text-primary mb-3 d-block"></i>
              <h4 className="text-dark">{layoutName} Layout</h4>
              <p className="text-muted mb-4">
                This layout variant demonstrates different sidebar and navigation configurations.
                <br />
                The current layout shows how the admin interface would appear with this configuration.
              </p>
              <div className="d-inline-block text-start">
                <h6 className="text-dark">Layout Features:</h6>
                <ul className="text-muted">
                  <li>Responsive sidebar behavior</li>
                  <li>Theme-aware color schemes</li>
                  <li>Collapsible navigation</li>
                  <li>Customizable header options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutsPlaceholder;
