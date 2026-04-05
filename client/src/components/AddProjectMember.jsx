import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace || null,
  );

  const project = currentWorkspace?.projects.find((p) => p.id === id);
  const projectMembersEmails = project?.members.map(
    (member) => member.user.email,
  );

  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (!isDialogOpen) return null;
  return <div>AddProjectMember</div>;
};

export default AddProjectMember;
