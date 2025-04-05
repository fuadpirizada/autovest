import { useState } from "react";
import { Package, insertPackageSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, MoreHorizontal, Edit, ToggleLeft, Trash } from "lucide-react";

interface PackageManagementProps {
  packages: Package[];
}

const formSchema = insertPackageSchema.extend({
  weeklyReturn: z.coerce.number().min(0.1).max(10),
  minInvestment: z.coerce.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

const PackageManagement: React.FC<PackageManagementProps> = ({ packages }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tier: "Economy",
      weeklyReturn: 1.2,
      minInvestment: 100,
      imageUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/packages", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package created",
        description: "The investment package has been created successfully",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await apiRequest("PUT", `/api/packages/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package updated",
        description: "The investment package has been updated successfully",
      });
      form.reset();
      setIsDialogOpen(false);
      setEditingPackage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      name: pkg.name,
      description: pkg.description || "",
      tier: pkg.tier,
      weeklyReturn: pkg.weeklyReturn,
      minInvestment: pkg.minInvestment,
      imageUrl: pkg.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = (pkg: Package) => {
    updateMutation.mutate({
      id: pkg.id,
      data: { ...pkg, isActive: !pkg.isActive } as any,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Investment Packages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-700">
              Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update the details of the investment package."
                  : "Add a new investment package to the platform."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Premium Tier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the package" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Economy">Economy</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                            <SelectItem value="Supercar">Supercar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weeklyReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Return (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Investment ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="100" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPackage(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingPackage ? "Update Package" : "Create Package"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Return</TableHead>
              <TableHead>Min Investment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No packages found
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.tier}</TableCell>
                  <TableCell>{pkg.weeklyReturn}%</TableCell>
                  <TableCell>${pkg.minInvestment}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pkg.isActive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(pkg)}>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          <span>{pkg.isActive ? "Deactivate" : "Activate"}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PackageManagement;
