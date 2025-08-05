import { useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { HiTrash, HiUser } from "react-icons/hi2";

import { http, type IHttpResponse } from "~/shared";
import { Button, AlertError, Loading } from "~/components";
import type { IUser } from "~/users";

interface SettingsMemberSectionProps {
  workspaceId: string;
}

interface WorkspaceMember extends IUser {
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export function SettingsMemberSection({ workspaceId }: SettingsMemberSectionProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  // Fetch workspace members
  const { data: members, error: membersError, isLoading: membersLoading } = useSWR<WorkspaceMember[]>(
    `/workspaces/${workspaceId}/members`
  );

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await http(`/workspaces/${workspaceId}/members`, {
        method: "POST",
        body: { email, role },
      });
      
      toast.success("Member added successfully");
      setEmail("");
      setRole('member');
      // Refresh members list
      mutate(`/workspaces/${workspaceId}/members`);
    } catch (err) {
      const errorMessage = (err as IHttpResponse)?.message || "Failed to add member";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) {
      return;
    }

    setRemovingMemberId(memberId);
    try {
      await http(`/workspaces/${workspaceId}/members/${memberId}`, {
        method: "DELETE",
      });
      
      toast.success("Member removed successfully");
      // Refresh members list
      mutate(`/workspaces/${workspaceId}/members`);
    } catch (err) {
      const errorMessage = (err as IHttpResponse)?.message || "Failed to remove member";
      toast.error(errorMessage);
    } finally {
      setRemovingMemberId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Workspace Members
        </h2>
        <p className="text-sm text-gray-500">
          Add existing Selek users to join your workspace
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label
              htmlFor="member-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Add Member by Email
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                id="member-email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full sm:w-auto flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />

              <select
                id="member-role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>

              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
              >
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the email of an existing Selek user and select their role to add them to this workspace.
            </p>
          </div>

      
        </form>

        {/* Members List */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Current Members ({members?.length || 0})
          </h3>
          
          {membersLoading ? (
            <Loading />
          ) : membersError ? (
            <AlertError message="Failed to load workspace members" />
          ) : members && members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.fullName}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <HiUser className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
                    
                    {member.role !== 'owner' && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id, member.fullName)}
                        disabled={removingMemberId === member.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        {removingMemberId === member.id ? (
                          "Removing..."
                        ) : (
                          <HiTrash className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No members found. Add existing Selek users to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
