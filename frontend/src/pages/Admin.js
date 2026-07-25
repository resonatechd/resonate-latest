import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api, { formatApiError, API } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Mail, Phone, Eye, Plus, Briefcase } from "lucide-react";

export default function Admin() {
  const { user, logout } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "visa" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newVac, setNewVac] = useState({ title: "", description: "" });
  const [detail, setDetail] = useState(null);

  const loadAll = () => {
    api.get("/survey/list").then((r) => setSurveys(r.data || [])).catch(() => {});
    api.get("/updates/list").then((r) => setUpdates(r.data || [])).catch(() => {});
    api.get("/vacancies/all").then((r) => setVacancies(r.data || [])).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const submitUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (file) fd.append("media", file);
      await api.post("/updates", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Update published");
      setForm({ title: "", description: "", category: "visa" });
      setFile(null);
      loadAll();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const removeUpdate = async (id) => {
    try {
      await api.delete(`/updates/${id}`);
      toast.success("Deleted");
      loadAll();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const addVacancy = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vacancies", { ...newVac, is_active: true });
      setNewVac({ title: "", description: "" });
      toast.success("Vacancy added");
      loadAll();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const removeVacancy = async (id) => {
    try {
      await api.delete(`/vacancies/${id}`);
      toast.success("Removed");
      loadAll();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b hairline bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Resonate.Dubai</p>
            <h1 className="font-serif-display text-2xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <Button variant="outline" onClick={logout} data-testid="admin-logout-btn" className="rounded-none">
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="rounded-none bg-accent">
            <TabsTrigger value="submissions" data-testid="tab-submissions" className="rounded-none">
              Submissions <Badge className="ml-2 bg-[#C5A059] text-white">{surveys.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="updates" data-testid="tab-updates" className="rounded-none">
              Dynamic Updates <Badge className="ml-2 bg-[#2C303A] text-white">{updates.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="vacancies" data-testid="tab-vacancies" className="rounded-none">
              Vacancies <Badge className="ml-2 bg-[#2C303A] text-white">{vacancies.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="mt-8">
            <Card className="rounded-none border hairline overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Industry / Vacancy</TableHead>
                      <TableHead>Passport</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.length === 0 && (
                      <TableRow><TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                        No submissions yet.
                      </TableCell></TableRow>
                    )}
                    {surveys.map((s) => (
                      <TableRow key={s.id} data-testid={`submission-row-${s.id}`}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</div>
                          {s.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{s.email}</div>}
                        </TableCell>
                        <TableCell className="text-xs">{s.age || "—"}</TableCell>
                        <TableCell className="text-xs">{s.state || "—"}</TableCell>
                        <TableCell><Badge className="bg-[#C5A059] text-white">{s.intent}</Badge></TableCell>
                        <TableCell className="text-xs">
                          {s.education || "—"}{s.education_detail ? ` · ${s.education_detail}` : ""}
                        </TableCell>
                        <TableCell className="text-xs">
                          {s.vacancy && <div>{s.vacancy}</div>}
                          {s.industry && <div className="text-muted-foreground">{s.industry}</div>}
                          {!s.vacancy && !s.industry && "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {s.has_passport === "yes" ? (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-700">yes</Badge>
                          ) : s.has_passport === "no" ? (
                            <Badge variant="outline">no</Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setDetail(s)} data-testid={`view-${s.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="mt-8">
            <div className="grid md:grid-cols-5 gap-8">
              <Card className="md:col-span-2 p-6 rounded-none border hairline">
                <h3 className="font-serif-display text-2xl mb-1">Publish an update</h3>
                <p className="text-xs text-muted-foreground mb-6">Success story, new company, or promotional video.</p>
                <form onSubmit={submitUpdate} className="space-y-4" data-testid="update-form">
                  <div>
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="update-title-input" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger data-testid="update-category-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa issued</SelectItem>
                        <SelectItem value="company">New company opened</SelectItem>
                        <SelectItem value="video">Video / Testimonial</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="update-description-input" />
                  </div>
                  <div>
                    <Label>Media (image or video)</Label>
                    <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} data-testid="update-file-input" />
                  </div>
                  <Button type="submit" disabled={uploading} className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none" data-testid="update-publish-btn">
                    <Upload className="w-4 h-4 mr-2" /> {uploading ? "Publishing…" : "Publish"}
                  </Button>
                </form>
              </Card>

              <div className="md:col-span-3 space-y-4">
                {updates.length === 0 && (<p className="text-muted-foreground text-sm">No updates yet.</p>)}
                {updates.map((u) => (
                  <Card key={u.id} className="p-5 rounded-none border hairline flex gap-4" data-testid={`update-card-${u.id}`}>
                    {u.media_path && u.media_type?.startsWith("image/") && (
                      <img src={`${API}/files/${u.media_path}`} alt="" className="w-28 h-28 object-cover" />
                    )}
                    {u.media_path && u.media_type?.startsWith("video/") && (
                      <video src={`${API}/files/${u.media_path}`} className="w-28 h-28 object-cover" muted />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{u.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif-display text-xl">{u.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{u.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeUpdate(u.id)} data-testid={`update-delete-${u.id}`}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vacancies" className="mt-8">
            <div className="grid md:grid-cols-5 gap-8">
              <Card className="md:col-span-2 p-6 rounded-none border hairline">
                <h3 className="font-serif-display text-2xl mb-1">Add a vacancy</h3>
                <p className="text-xs text-muted-foreground mb-6">Vacancies appear in the counselling survey (job intent).</p>
                <form onSubmit={addVacancy} className="space-y-4" data-testid="vacancy-form">
                  <div>
                    <Label>Title</Label>
                    <Input value={newVac.title} onChange={(e) => setNewVac({ ...newVac, title: e.target.value })} required data-testid="vacancy-title-input" placeholder="e.g. Sharjah Taxi Driver" />
                  </div>
                  <div>
                    <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                    <Textarea rows={3} value={newVac.description} onChange={(e) => setNewVac({ ...newVac, description: e.target.value })} data-testid="vacancy-description-input" />
                  </div>
                  <Button type="submit" className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none" data-testid="vacancy-add-btn">
                    <Plus className="w-4 h-4 mr-2" /> Add vacancy
                  </Button>
                </form>
              </Card>

              <div className="md:col-span-3">
                <Card className="rounded-none border hairline">
                  <Table>
                    <TableHeader className="bg-accent">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vacancies.length === 0 && (
                        <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No vacancies.</TableCell></TableRow>
                      )}
                      {vacancies.map((v) => (
                        <TableRow key={v.id} data-testid={`vacancy-row-${v.id}`}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#C5A059]" /> {v.title}
                          </TableCell>
                          <TableCell className="text-xs max-w-[300px] truncate">{v.description || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeVacancy(v.id)} data-testid={`vacancy-delete-${v.id}`}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl">{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Phone", detail.phone],
                ["Email", detail.email],
                ["Age", detail.age],
                ["State", detail.state],
                ["Intent", detail.intent],
                ["Passport", detail.has_passport],
                ["Education", detail.education],
                ["Field / Stream", detail.education_detail],
                ["Has experience", detail.has_experience],
                ["Industry", detail.industry],
                ["Vacancy interest", detail.vacancy],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
                  <p className="mt-1">{v || "—"}</p>
                </div>
              ))}
              {detail.notes && (
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap">{detail.notes}</p>
                </div>
              )}
              {(detail.passport_front_path || detail.passport_back_path) && (
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  {detail.passport_front_path && (
                    <a href={`${API}/files/${detail.passport_front_path}`} target="_blank" rel="noreferrer" className="border hairline p-3 text-xs hover:border-[#C5A059]">
                      View passport front ↗
                    </a>
                  )}
                  {detail.passport_back_path && (
                    <a href={`${API}/files/${detail.passport_back_path}`} target="_blank" rel="noreferrer" className="border hairline p-3 text-xs hover:border-[#C5A059]">
                      View passport back ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
