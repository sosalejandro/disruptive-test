import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ContentForm from '../components/ContentForm';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../enums/domain.enums';

const AddContentPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/contents');
  };

  if (!user || (user.role !== UserType.CREATOR && user.role !== UserType.ADMIN)) {
    return <p>You do not have permission to add content.</p>;
  }

  return (
    <div>
      <h1>Add Content</h1>
      <ContentForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddContentPage;