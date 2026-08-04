import { useParams } from "react-router-dom";
import MemberList from "../../components/workspace/MemberList";

const ChangeRolePage = () => {
  const { workspaceId } = useParams();

  if (!workspaceId) return null;

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="mx-auto max-w-2xl">
        <MemberList
          workspaceId={workspaceId}
          onlineUsers={[]}
          role="OWNER" // temporary
          mode="role"
        />
      </div>
    </div>
  );
};

export default ChangeRolePage;