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
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Mail, Phone, Eye, Plus, Pencil, ListChecks } from "lucide-react";

// ---------- Questions Tab ----------
function QuestionsTab() {
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = () => {
    api.get("/questions/all").then((r) => setQuestions(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditing({
      label: "", help_text: "", type: "text", options: [], required: false, order: (questions[questions.length - 1]?.order || 0) + 10, is_active: true,
    });
    setDialogOpen(true);
  };
  const startEdit = (q) => { setEditing({ ...q }); setDialogOpen(true); };

  const save = async () => {
    try {
      const payload = { ...editing };
      if (payload.type !== "select") payload.options = [];
      if (editing.id) {
        await api.put(`/questions/${editing.id}`, payload);
      } else {
        await api.post("/questions", payload);
      }
      toast.success("Saved");
      setDialogOpen(false);
      setEditing(null);
      load();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif-display text-2xl">Counselling Questions</h3>
          <p className="text-xs text-muted-foreground mt-1">Add, edit or remove the questions shown in the Free Consultation modal. Free-text or dropdown only.</p>
        </div>
        <Button onClick={startNew} className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none" data-testid="question-add-btn">
          <Plus className="w-4 h-4 mr-2" /> Add question
        </Button>
      </div>

      <Card className="rounded-none border hairline">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No questions yet — add your first.</TableCell></TableRow>
            )}
            {questions.map((q) => (
              <TableRow key={q.id} data-testid={`question-row-${q.id}`}>
                <TableCell>{q.order}</TableCell>
                <TableCell className="font-medium max-w-[280px]">{q.label}</TableCell>
                <TableCell><Badge variant="outline" className="rounded-none capitalize">{q.type}</Badge></TableCell>
                <TableCell className="text-xs max-w-[260px] truncate">{(q.options || []).join(", ") || "—"}</TableCell>
                <TableCell>{q.required ? <Badge className="bg-[#C5A059] text-white">required</Badge> : <span className="text-muted-foreground text-xs">optional</span>}</TableCell>
                <TableCell>{q.is_active ? <Badge variant="outline" className="border-emerald-500 text-emerald-700">on</Badge> : <Badge variant="outline">off</Badge>}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(q)} data-testid={`question-edit-${q.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(q.id)} data-testid={`question-delete-${q.id}`}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl">
              {editing?.id ? "Edit question" : "Add question"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Question label <span className="text-destructive">*</span></Label>
                <Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} data-testid="question-label-input" placeholder="e.g. What is your last education?" />
              </div>
              <div>
                <Label>Help text <span className="text-muted-foreground">(optional)</span></Label>
                <Input value={editing.help_text} onChange={(e) => setEditing({ ...editing, help_text: e.target.value })} data-testid="question-help-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                    <SelectTrigger data-testid="question-type-select" className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Free text (single line)</SelectItem>
                      <SelectItem value="textarea">Free text (multi-line)</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Order</Label>
                  <Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value, 10) || 0 })} data-testid="question-order-input" className="mt-2" />
                </div>
              </div>
              {editing.type === "select" && (
                <div>
                  <Label>Dropdown options — one per line</Label>
                  <Textarea
                    rows={5}
                    value={(editing.options || []).join("\n")}
                    onChange={(e) => setEditing({ ...editing, options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    data-testid="question-options-input"
                    placeholder="Yes\nNo"
                  />
                </div>
              )}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editing.required} onCheckedChange={(v) => setEditing({ ...editing, required: v })} data-testid="question-required-switch" /> Required
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} data-testid="question-active-switch" /> Active
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Cancel</Button>
                <Button
                  onClick={save}
                  disabled={!editing.label.trim()}
                  className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none"
                  data-testid="question-save-btn"
                >Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------- Main Admin ----------
export default function Admin() {
  const { user, logout } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadAll = () => {
    api.get("/survey/list").then((r) => setSurveys(r.data || [])).catch(() => {});
    api.get("/updates/list").then((r) => setUpdates(r.data || [])).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const submitUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", "video");
      if (file) fd.append("media", file);
      await api.post("/updates", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Published");
      setForm({ title: "", description: "" });
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b hairline bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Resonate Dubai LLC</p>
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
            <TabsTrigger value="questions" data-testid="tab-questions" className="rounded-none">
              <ListChecks className="w-3.5 h-3.5 mr-1.5" /> Questions
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
                      <TableHead>Answers</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No submissions yet.</TableCell></TableRow>
                    )}
                    {surveys.map((s) => (
                      <TableRow key={s.id} data-testid={`submission-row-${s.id}`}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</div>
                          {s.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{s.email}</div>}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge className="bg-[#2C303A] text-white">{(s.answers || []).length} answers</Badge>
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
                <p className="text-xs text-muted-foreground mb-6">Category: <strong>Video / Testimonial</strong>. Upload a video or a photo.</p>
                <form onSubmit={submitUpdate} className="space-y-4" data-testid="update-form">
                  <div>
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="update-title-input" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="update-description-input" />
                  </div>
                  <div>
                    <Label>Media — video or photo</Label>
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
                        <Badge variant="outline" className="text-[10px]">Video / Testimonial</Badge>
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

          <TabsContent value="questions" className="mt-8">
            <QuestionsTab />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl">{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone</p>
                  <p className="mt-1">{detail.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-1">{detail.email || "—"}</p>
                </div>
              </div>
              <div className="pt-4 border-t hairline">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Answers</p>
                {(detail.answers || []).length === 0 && <p className="text-muted-foreground text-xs">No answers.</p>}
                <div className="space-y-3">
                  {(detail.answers || []).map((a, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-muted-foreground">{a.label}</p>
                      <p className="font-medium">{a.value || <span className="text-muted-foreground">—</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
