import PageTitle from "@/components/darkone/layout/PageTitle";

interface AdminComingSoonPageProps {
  title: string;
  subTitle: string;
  message?: string;
  icon?: string;
}

const AdminComingSoonPage = ({ 
  title, 
  subTitle, 
  message = "This section will be available in a future update.",
  icon = "bx-time-five"
}: AdminComingSoonPageProps) => {
  return (
    <>
      <PageTitle title={title} subTitle={subTitle} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <i className={`bx ${icon} fs-48 text-primary mb-3 d-block`}></i>
              <h4 className="text-dark">{title}</h4>
              <p className="text-muted mb-0">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminComingSoonPage;
