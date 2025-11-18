import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { GROUP_MANAGEMENT } from '../../constants';
import GroupConfiguration from '../../features/group-management/components/groupConfiguration';
// import { GROUP_MANAGEMENT } from '../../constants';
// import { useKeycloak } from '@react-keycloak/web';

const GroupManagement = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
//   const { keycloak } = useKeycloak();

  return (
    
    <PageWrapper>
      <Tabs
        defaultActiveKey={'group-configuration'}
        id="group-management-tab"
        className="mb-3"
        mountOnEnter={true}
        unmountOnExit={true}
        onSelect={tabName => {
          navigate(GROUP_MANAGEMENT + '/' + tabName);
        }}
      >
        <Tab eventKey="group-configuration" title={t('groupManagement.groupConfiguration')}>
          <div>
           <GroupConfiguration/>
          </div>
        </Tab>

        <Tab eventKey="group-field-configuration" title={t('groupManagement.fieldConfiguration')}>
          <div>
           
            <p>Manage group members, roles, and member permissions.</p>
            {/* Add your group members content here */}
          </div>
        </Tab>
      </Tabs>
    </PageWrapper>
  );
};

export default GroupManagement;