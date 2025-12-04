import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Play, StopCircle, Eye, Loader2, Upload, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  adminApi,
  electionApi,
  categoryApi,
  candidateApi,
  type Election,
  type Category,
  type Candidate,
} from "@/lib/api";

const Admin = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [showElectionDialog, setShowElectionDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);
  
  // Edit states
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  
  // Delete confirmation states
  const [deleteElectionId, setDeleteElectionId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [electionsData, categoriesData, candidatesData] = await Promise.all([
        electionApi.getElections(),
        categoryApi.getCategories(),
        candidateApi.getCandidates(),
      ]);
      setElections(electionsData);
      setCategories(categoriesData);
      setCandidates(candidatesData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Election handlers
  const handleCreateElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await adminApi.createElection({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        is_public: true,
        allowed_voters: [],
        categories: [],
        status: 'draft',
        results_released: false,
      });
      
      toast({ title: "Success", description: "Election created successfully" });
      setShowElectionDialog(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create election",
        variant: "destructive",
      });
    }
  };

  const handleUpdateElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingElection) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await adminApi.updateElection(editingElection.id, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
      });
      
      toast({ title: "Success", description: "Election updated successfully" });
      setEditingElection(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update election",
        variant: "destructive",
      });
    }
  };

  const handleDeleteElection = async () => {
    if (!deleteElectionId) return;
    
    try {
      await adminApi.deleteElection(deleteElectionId);
      toast({ title: "Success", description: "Election deleted successfully" });
      setDeleteElectionId(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete election",
        variant: "destructive",
      });
    }
  };

  // Category handlers
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await categoryApi.createCategory({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        election: parseInt(formData.get('election') as string),
      });
      
      toast({ title: "Success", description: "Category created successfully" });
      setShowCategoryDialog(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await categoryApi.updateCategory(editingCategory.id, {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      });
      
      toast({ title: "Success", description: "Category updated successfully" });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    
    try {
      await categoryApi.deleteCategory(deleteCategoryId);
      toast({ title: "Success", description: "Category deleted successfully" });
      setDeleteCategoryId(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Candidate handlers
  const handleCreateCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const candidate = await adminApi.createCandidate({
        name: formData.get('name') as string,
        bio: formData.get('bio') as string,
        manifesto: formData.get('manifesto') as string,
        category: parseInt(formData.get('category') as string),
      });

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        await adminApi.uploadCandidateImage(candidate.id, imageFile);
      }
      
      toast({ title: "Success", description: "Candidate created successfully" });
      setShowCandidateDialog(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create candidate",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCandidate) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await adminApi.updateCandidate(editingCandidate.id, {
        name: formData.get('name') as string,
        bio: formData.get('bio') as string,
        manifesto: formData.get('manifesto') as string,
      });

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        await adminApi.uploadCandidateImage(editingCandidate.id, imageFile);
      }
      
      toast({ title: "Success", description: "Candidate updated successfully" });
      setEditingCandidate(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update candidate",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deleteCandidateId) return;
    
    try {
      await adminApi.deleteCandidate(deleteCandidateId);
      toast({ title: "Success", description: "Candidate deleted successfully" });
      setDeleteCandidateId(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete candidate",
        variant: "destructive",
      });
    }
  };

  // Election lifecycle handlers
  const handleStartElection = async (electionId: number) => {
    try {
      await adminApi.startElection(electionId);
      toast({ title: "Success", description: "Election started successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start election",
        variant: "destructive",
      });
    }
  };

  const handleEndElection = async (electionId: number) => {
    try {
      await adminApi.endElection(electionId);
      toast({ title: "Success", description: "Election ended successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to end election",
        variant: "destructive",
      });
    }
  };

  const handleReleaseResults = async (electionId: number) => {
    try {
      await adminApi.releaseResults(electionId);
      toast({ title: "Success", description: "Results released successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to release results",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage elections, categories, and candidates
          </p>
        </div>

        <Tabs defaultValue="elections" className="space-y-6">
          <TabsList>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Elections</h2>
              <Button onClick={() => setShowElectionDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {elections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <CardTitle>{election.title}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={
                        election.status === 'active' ? 'default' :
                        election.status === 'ended' ? 'secondary' : 'outline'
                      }>
                        {election.status}
                      </Badge>
                      {election.results_released && (
                        <Badge variant="default">Results Released</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {election.status === 'draft' && (
                        <Button size="sm" onClick={() => handleStartElection(election.id)}>
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                      {election.status === 'active' && (
                        <Button size="sm" variant="destructive" onClick={() => handleEndElection(election.id)}>
                          <StopCircle className="h-3 w-3 mr-1" />
                          End
                        </Button>
                      )}
                      {election.status === 'ended' && !election.results_released && (
                        <Button size="sm" variant="secondary" onClick={() => handleReleaseResults(election.id)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Release Results
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setEditingElection(election)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteElectionId(election.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Button onClick={() => setShowCategoryDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const election = elections.find(e => e.id === category.election);
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge variant="outline">{election?.title}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingCategory(category)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteCategoryId(category.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Candidates</h2>
              <Button onClick={() => setShowCandidateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => {
                const category = categories.find(c => c.id === candidate.category);
                return (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <CardTitle>{candidate.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {candidate.bio}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {candidate.image && (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      <Badge variant="secondary">{category?.name}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingCandidate(candidate)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteCandidateId(candidate.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Election Dialog */}
      <Dialog open={showElectionDialog} onOpenChange={setShowElectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
            <DialogDescription>Set up a new election</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateElection}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Election Dialog */}
      <Dialog open={!!editingElection} onOpenChange={() => setEditingElection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Election</DialogTitle>
            <DialogDescription>Update election details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateElection}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" name="title" defaultValue={editingElection?.title} required />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingElection?.description} />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Add a category to an election</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCategory}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Name</Label>
                <Input id="category-name" name="name" required />
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea id="category-description" name="description" />
              </div>
              <div>
                <Label htmlFor="category-election">Election</Label>
                <Select name="election" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id.toString()}>
                        {election.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Name</Label>
                <Input id="edit-category-name" name="name" defaultValue={editingCategory?.name} required />
              </div>
              <div>
                <Label htmlFor="edit-category-description">Description</Label>
                <Textarea id="edit-category-description" name="description" defaultValue={editingCategory?.description} />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Candidate Dialog */}
      <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>Create a candidate profile</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCandidate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="candidate-name">Name</Label>
                <Input id="candidate-name" name="name" required />
              </div>
              <div>
                <Label htmlFor="candidate-bio">Bio</Label>
                <Textarea id="candidate-bio" name="bio" required />
              </div>
              <div>
                <Label htmlFor="candidate-manifesto">Manifesto</Label>
                <Textarea id="candidate-manifesto" name="manifesto" />
              </div>
              <div>
                <Label htmlFor="candidate-category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="candidate-image">Image</Label>
                <Input id="candidate-image" name="image" type="file" accept="image/*" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={!!editingCandidate} onOpenChange={() => setEditingCandidate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Update candidate details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCandidate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-candidate-name">Name</Label>
                <Input id="edit-candidate-name" name="name" defaultValue={editingCandidate?.name} required />
              </div>
              <div>
                <Label htmlFor="edit-candidate-bio">Bio</Label>
                <Textarea id="edit-candidate-bio" name="bio" defaultValue={editingCandidate?.bio} required />
              </div>
              <div>
                <Label htmlFor="edit-candidate-manifesto">Manifesto</Label>
                <Textarea id="edit-candidate-manifesto" name="manifesto" defaultValue={editingCandidate?.manifesto} />
              </div>
              <div>
                <Label htmlFor="edit-candidate-image">Image (optional, leave empty to keep current)</Label>
                <Input id="edit-candidate-image" name="image" type="file" accept="image/*" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Election Confirmation */}
      <AlertDialog open={!!deleteElectionId} onOpenChange={() => setDeleteElectionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Election?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the election and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteElection}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category and all associated candidates. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Candidate Confirmation */}
      <AlertDialog open={!!deleteCandidateId} onOpenChange={() => setDeleteCandidateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this candidate. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCandidate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
