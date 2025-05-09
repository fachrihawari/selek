import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function WorkspaceDetailPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  useEffect(() => {
    navigate(`/${workspaceId}/threads`, { replace: true });
  }, [workspaceId, navigate]);

  return null;
}
