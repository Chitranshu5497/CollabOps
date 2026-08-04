import { useParams } from "react-router-dom";
import MemberList from "../../components/workspace/MemberList";

const MembersPage = () => {
  const { workspaceId } = useParams();

  if (!workspaceId) return null;

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="mx-auto max-w-2xl">
        <MemberList
          workspaceId={workspaceId}
          onlineUsers={[]}
          role="OWNER"
          mode="remove"
        />
      </div>
    </div>
  );
};

export default MembersPage;
