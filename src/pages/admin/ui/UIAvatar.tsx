import PageTitle from "@/components/darkone/layout/PageTitle";

const UIAvatar = () => {
  return (
    <>
      <PageTitle title="Avatar" subTitle="Base UI" />
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Avatar Sizes</h4></div>
            <div className="card-body d-flex gap-3 align-items-end">
              <img src="/darkone/images/users/avatar-1.jpg" alt="" className="rounded-circle avatar-xs" />
              <img src="/darkone/images/users/avatar-2.jpg" alt="" className="rounded-circle avatar-sm" />
              <img src="/darkone/images/users/avatar-3.jpg" alt="" className="rounded-circle avatar-md" />
              <img src="/darkone/images/users/avatar-4.jpg" alt="" className="rounded-circle avatar-lg" />
              <img src="/darkone/images/users/avatar-5.jpg" alt="" className="rounded-circle avatar-xl" />
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Avatar Shapes</h4></div>
            <div className="card-body d-flex gap-3">
              <img src="/darkone/images/users/avatar-1.jpg" alt="" className="rounded avatar-md" />
              <img src="/darkone/images/users/avatar-2.jpg" alt="" className="rounded-circle avatar-md" />
              <img src="/darkone/images/users/avatar-3.jpg" alt="" className="img-thumbnail avatar-md" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIAvatar;
