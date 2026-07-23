import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api, { formatApiError, API } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Mail, Phone } from "lucide-react";

export default function Admin() {
  const { user, logout } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "visa" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
                      <TableHead>Location</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Type / Field</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        No submissions yet.
                      </TableCell></TableRow>
                    )}
                    {surveys.map((s) => (
                      <TableRow key={s.id} data-testid={`submission-row-${s.id}`}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</div>
                          <div className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{s.phone}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{s.location}</Badge></TableCell>
                        <TableCell><Badge className="bg-[#C5A059] text-white">{s.intent}</Badge></TableCell>
                        <TableCell className="text-xs">{s.budget || "—"}</TableCell>
                        <TableCell className="text-xs">{s.field_or_type || "—"}</TableCell>
                        <TableCell className="text-xs max-w-[240px] truncate">{s.notes || "—"}</TableCell>
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
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="update-title" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger data-testid="update-category"><SelectValue /></SelectTrigger>
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
                    <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="update-description" />
                  </div>
                  <div>
                    <Label>Media (image or video)</Label>
                    <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} data-testid="update-file" />
                  </div>
                  <Button type="submit" disabled={uploading} className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none" data-testid="update-submit">
                    <Upload className="w-4 h-4 mr-2" /> {uploading ? "Publishing…" : "Publish"}
                  </Button>
                </form>
              </Card>

              <div className="md:col-span-3 space-y-4">
                {updates.length === 0 && (
                  <p className="text-muted-foreground text-sm">No updates yet.</p>
                )}
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
                    <Button variant="ghost" size="icon" onClick={() => removeUpdate(u.id)} data-testid={`delete-${u.id}`}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
