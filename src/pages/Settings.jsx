import { Save, Settings, Building, CreditCard, Percent } from "lucide-react";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsApi } from "../api/settings";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input, Label } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { ErrorBanner, LoadingState } from "../components/ui/state";
import { useToast } from "../components/ui/toast";

const schema = z.object({
  business_name: z.string().optional(),
  business_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  business_phone: z.string().optional(),
  business_address: z.string().optional(),
  tax_rate: z.coerce.number().min(0, "Tax cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
});

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      business_name: "",
      business_email: "",
      business_phone: "",
      business_address: "",
      tax_rate: 7.5,
      currency: "NGN",
    },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset({
        business_name: settingsQuery.data.business_name || "",
        business_email: settingsQuery.data.business_email || "",
        business_phone: settingsQuery.data.business_phone || "",
        business_address: settingsQuery.data.business_address || "",
        tax_rate: Number(settingsQuery.data.tax_rate || 7.5),
        currency: settingsQuery.data.currency || "NGN",
      });
    }
  }, [form, settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Page>
      <form onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
      <PageHeader>
        <PageTitle
          description="Configure business details, tax, currency, and payment methods."
          icon={Settings}
          title="System Settings"
        />
        <Button disabled={saveMutation.isPending} type="submit">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </PageHeader>

      <section className="space-y-6 px-4 pb-8 sm:px-6">
        {settingsQuery.isLoading && <LoadingState label="Loading settings..." />}
        {settingsQuery.isError && <ErrorBanner error={settingsQuery.error} onRetry={settingsQuery.refetch} />}
        {!settingsQuery.isLoading && (
        <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-slate-600" />
              Business Information
            </CardTitle>
            <CardDescription>These details appear on invoices and receipts.</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Business Name</Label>
              <Input
                type="text"
                placeholder="Enter your business name"
                className="mt-1"
                {...form.register("business_name")}
              />
            </div>
            <div>
              <Label>Business Email</Label>
              <Input
                type="email"
                placeholder="example@business.com"
                className="mt-1"
                {...form.register("business_email")}
              />
              {form.formState.errors.business_email && <p className="mt-1 text-xs text-red-600">{form.formState.errors.business_email.message}</p>}
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                type="text"
                placeholder="+234 812 345 6789"
                className="mt-1"
                {...form.register("business_phone")}
              />
            </div>
            <div>
              <Label>Business Address</Label>
              <Input
                type="text"
                placeholder="123 Example Street, Lagos"
                className="mt-1"
                {...form.register("business_address")}
              />
            </div>
          </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-slate-600" />
              Tax & Currency
            </CardTitle>
            <CardDescription>Set default checkout calculations.</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                placeholder="7.5"
                className="mt-1"
                step="0.01"
                {...form.register("tax_rate")}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <select className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" {...form.register("currency")}>
                <option value="NGN">₦ — Nigerian Naira</option>
                <option value="USD">$ — US Dollar</option>
                <option value="GBP">£ — British Pound</option>
              </select>
            </div>
          </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-600" />
              Payment Options
            </CardTitle>
            <CardDescription>Enable methods accepted at checkout.</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            {["Cash", "POS Terminal", "Bank Transfer", "Online Payment"].map((method, i) => (
              <label key={i} className="flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 accent-slate-950" />
                {method}
              </label>
            ))}
          </div>
          </CardContent>
        </Card>
        </>
        )}
      </section>
      </form>
    </Page>
  );
}
