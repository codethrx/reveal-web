import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { GROUP_MANAGEMENT } from '../../constants';

const GroupManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current tab from the URL
  const getCurrentTab = () => {
    const pathSegments = location.pathname.split('/');
    
    // Find the segment after GROUP_MANAGEMENT
    const managementIndex = pathSegments.findIndex(segment => 
      segment === GROUP_MANAGEMENT.split('/').pop()
    );
    
    if (managementIndex !== -1 && managementIndex + 1 < pathSegments.length) {
      const tabSegment = pathSegments[managementIndex + 1];
      
      // Check if we're on an element view route - don't change tab for element routes
      if (tabSegment === 'element' || tabSegment.startsWith('element-')) {
        return 'group-configuration';
      }
      
      // Return valid tab names only
      if (tabSegment === 'group-configuration' || tabSegment === 'group-field-configuration') {
        return tabSegment;
      }
    }
    
    // Default to group-configuration
    return 'group-configuration';
  };

  const currentTab = getCurrentTab();

  return (
    <PageWrapper>
      <>
      <Tabs
        activeKey={currentTab}
        id="group-management-tab"
        className="mb-3"
        onSelect={tabName => {
          navigate(GROUP_MANAGEMENT + '/' + tabName);
        }}
      >
        <Tab eventKey="group-configuration" title={t('groupManagement.groupConfiguration')} />
        <Tab eventKey="group-field-configuration" title={t('groupManagement.fieldConfiguration')} />
      </Tabs>
      
      {/* Outlet renders the matched child route */}
      <Outlet />
      </>
    </PageWrapper>
  );
};

export default GroupManagement;