import { ShieldCheck, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api/staff";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/toast";

export default function StaffManagementPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const staffQuery = useQuery({ queryKey: ["staff"], queryFn: staffApi.list });
  const statusMutation = useMutation({
    mutationFn: (member) => staffApi.update(member.id, {
      name: member.name,
      email: member.email,
      role: member.role,
      salary: member.salary,
      status: member.status === "Active" ? "Suspended" : "Active",
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff status updated");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Page>
      <PageHeader>
        <PageTitle description="Manage staff users and access status." icon={Users} title="User Management" />
      </PageHeader>
      <div className="px-4 pb-8 sm:px-6">
        {staffQuery.isError && (
          <ErrorBanner error={staffQuery.error} onRetry={staffQuery.refetch} />
        )}
        <Card>
          {staffQuery.isLoading ? <LoadingState /> : (staffQuery.data || []).length === 0 ? <EmptyState title="No users found" /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{(staffQuery.data || []).map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium text-slate-950">{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell><Badge variant={staff.status === "Active" ? "success" : "warning"}>{staff.status || "Active"}</Badge></TableCell>
                  <TableCell><div className="flex justify-end"><Button onClick={() => statusMutation.mutate(staff)} size="sm" variant="ghost"><ShieldCheck className="h-4 w-4" />Toggle</Button></div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          )}
        </Card>
      </div>
    </Page>
  );
}
