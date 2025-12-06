import { useLocation } from "react-router-dom";
import AdminComingSoonPage from "@/components/darkone/placeholders/AdminComingSoonPage";

const LayoutsPlaceholder = () => {
  const location = useLocation();
  
  // Extract layout name from path
  const pathParts = location.pathname.split('/');
  const layoutName = pathParts[pathParts.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <AdminComingSoonPage
      title={`${layoutName} Layout`}
      subTitle="Layouts"
      message="This layout variant demonstrates different sidebar and navigation configurations."
      icon="bx-layout"
    />
  );
};

export default LayoutsPlaceholder;
