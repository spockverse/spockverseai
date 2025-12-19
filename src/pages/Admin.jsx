import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save, ArrowLeft, Music, Zap, Youtube, Link, Image, GripVertical, ChevronDown, ChevronUp, MessageSquare, Upload, Copy, CheckCircle, Type } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link as RouterLink } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ADMIN_EMAIL = 'sigzerzz@gmail.com';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Release Manager State
  const [releaseOpen, setReleaseOpen] = useState(true);
  const [editingRelease, setEditingRelease] = useState(null);
  const [releaseFormData, setReleaseFormData] = useState({
    title: '',
    type: 'song',
    description: '',
    release_date: '',
    cover_image: '',
    spotify_url: '',
    suno_url: '',
    youtube_url: '',
    patreon_url: '',
    url: ''
  });

  // Comment Highlights Manager State
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [highlightFormData, setHighlightFormData] = useState({
    image_url: '',
    title: '',
    source: ''
  });

  // Audio Upload State
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Font Upload State
  const [fontOpen, setFontOpen] = useState(false);
  const [fontUploading, setFontUploading] = useState(false);
  const [uploadedFontUrl, setUploadedFontUrl] = useState('');
  const [fontCopied, setFontCopied] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('sort_order'),
    enabled: user?.email === ADMIN_EMAIL
  });

  const { data: highlights = [] } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => base44.entities.CommentHighlight.list('sort_order'),
    enabled: user?.email === ADMIN_EMAIL
  });

  useQuery({
    queryKey: ['customFont'],
    queryFn: async () => {
      const settings = await base44.entities.SiteSettings.filter({ setting_key: 'custom_font_url' });
      if (settings.length > 0) {
        setUploadedFontUrl(settings[0].setting_value);
      }
      return settings;
    },
    enabled: user?.email === ADMIN_EMAIL
  });

  // Separate releases by type for drag and drop
  const songReleases = releases.filter(r => r.type === 'song' || r.type === 'video');
  const patreonReleases = releases.filter(r => r.type === 'patreon_post');

  const handleReleaseDragEnd = async (result, type) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    
    const items = type === 'songs' ? [...songReleases] : [...patreonReleases];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updates = [];
    items.forEach((item, index) => {
      if (item.sort_order !== index) {
        updates.push(base44.entities.Release.update(item.id, { sort_order: index }));
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    }
  };

  const handleHighlightDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    
    const items = [...highlights];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updates = [];
    items.forEach((item, index) => {
      if (item.sort_order !== index) {
        updates.push(base44.entities.CommentHighlight.update(item.id, { sort_order: index }));
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
    }
  };

  const createReleaseMutation = useMutation({
    mutationFn: (data) => base44.entities.Release.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      resetReleaseForm();
    }
  });

  const updateReleaseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Release.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      resetReleaseForm();
    }
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: (id) => base44.entities.Release.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['releases'] })
  });

  const createHighlightMutation = useMutation({
    mutationFn: (data) => base44.entities.CommentHighlight.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      resetHighlightForm();
    }
  });

  const updateHighlightMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CommentHighlight.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      resetHighlightForm();
    }
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: (id) => base44.entities.CommentHighlight.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights'] })
  });

  const resetReleaseForm = () => {
    setEditingRelease(null);
    setReleaseFormData({
      title: '', type: 'song', description: '', release_date: '',
      cover_image: '', spotify_url: '', suno_url: '', youtube_url: '', patreon_url: '', url: ''
    });
  };

  const resetHighlightForm = () => {
    setEditingHighlight(null);
    setHighlightFormData({
      image_url: '',
      title: '',
      source: ''
    });
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudioUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setUploadedAudioUrl(result.file_url);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setAudioUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedAudioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFontUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      
      const existingSettings = await base44.entities.SiteSettings.filter({ setting_key: 'custom_font_url' });
      if (existingSettings.length > 0) {
        await base44.entities.SiteSettings.update(existingSettings[0].id, { setting_value: result.file_url });
      } else {
        await base44.entities.SiteSettings.create({ setting_key: 'custom_font_url', setting_value: result.file_url });
      }
      
      setUploadedFontUrl(result.file_url);
      alert('Font uploaded! Refresh the page to see it applied.');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setFontUploading(false);
    }
  };

  const copyFontToClipboard = () => {
    navigator.clipboard.writeText(uploadedFontUrl);
    setFontCopied(true);
    setTimeout(() => setFontCopied(false), 2000);
  };

  const handleEditRelease = (release) => {
    setEditingRelease(release.id);
    setReleaseFormData({
      title: release.title || '',
      type: release.type || 'song',
      description: release.description || '',
      release_date: release.release_date || '',
      cover_image: release.cover_image || '',
      spotify_url: release.spotify_url || '',
      suno_url: release.suno_url || '',
      youtube_url: release.youtube_url || '',
      patreon_url: release.patreon_url || '',
      url: release.url || ''
    });
  };

  const handleEditHighlight = (highlight) => {
    setEditingHighlight(highlight.id);
    setHighlightFormData({
      image_url: highlight.image_url || '',
      title: highlight.title || '',
      source: highlight.source || ''
    });
  };

  const handleReleaseSubmit = (e) => {
    e.preventDefault();
    if (editingRelease) {
      updateReleaseMutation.mutate({ id: editingRelease, data: releaseFormData });
    } else {
      createReleaseMutation.mutate(releaseFormData);
    }
  };

  const handleHighlightSubmit = (e) => {
    e.preventDefault();
    if (editingHighlight) {
      updateHighlightMutation.mutate({ id: editingHighlight, data: highlightFormData });
    } else {
      createHighlightMutation.mutate(highlightFormData);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh] text-zinc-500">Loading...</div>;
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold text-purple-500 mb-4">ACCESS DENIED</h1>
        <p className="text-zinc-500 mb-6">You do not have permission to view this page.</p>
        <RouterLink to={createPageUrl('Home')}>
          <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Button>
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <RouterLink to={createPageUrl('Home')}>
          <Button variant="ghost" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </RouterLink>
      </div>

      {/* Release Manager Section */}
      <Collapsible open={releaseOpen} onOpenChange={setReleaseOpen}>
        <Card className="bg-zinc-900 border-zinc-800">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-500" />
                  Release Manager
                </div>
                {releaseOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Add/Edit Form */}
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/30">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  {editingRelease ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingRelease ? 'Edit Release' : 'Add New Release'}
                </h3>
                <form onSubmit={handleReleaseSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Title *</Label>
                      <Input
                        value={releaseFormData.title}
                        onChange={(e) => setReleaseFormData({ ...releaseFormData, title: e.target.value })}
                        required
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Track title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Type</Label>
                      <Select value={releaseFormData.type} onValueChange={(v) => setReleaseFormData({ ...releaseFormData, type: v })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="song">Song</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="patreon_post">Patreon Post</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Release Date</Label>
                      <Input
                        type="date"
                        value={releaseFormData.release_date}
                        onChange={(e) => setReleaseFormData({ ...releaseFormData, release_date: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 flex items-center gap-1"><Image className="w-3 h-3" /> Cover Art URL</Label>
                      <Input
                        value={releaseFormData.cover_image}
                        onChange={(e) => setReleaseFormData({ ...releaseFormData, cover_image: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Description</Label>
                    <Textarea
                      value={releaseFormData.description}
                      onChange={(e) => setReleaseFormData({ ...releaseFormData, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white h-20"
                      placeholder="Brief description of the release..."
                    />
                  </div>

                  <div className="border-t border-zinc-700 pt-4">
                    <Label className="text-zinc-500 text-sm mb-3 block">Platform Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-green-400 flex items-center gap-1"><Music className="w-3 h-3" /> Spotify URL</Label>
                        <Input
                          value={releaseFormData.spotify_url}
                          onChange={(e) => setReleaseFormData({ ...releaseFormData, spotify_url: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://open.spotify.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-purple-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Suno URL</Label>
                        <Input
                          value={releaseFormData.suno_url}
                          onChange={(e) => setReleaseFormData({ ...releaseFormData, suno_url: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://suno.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-red-400 flex items-center gap-1"><Youtube className="w-3 h-3" /> YouTube URL</Label>
                        <Input
                          value={releaseFormData.youtube_url}
                          onChange={(e) => setReleaseFormData({ ...releaseFormData, youtube_url: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-orange-400 flex items-center gap-1"><Link className="w-3 h-3" /> Patreon URL</Label>
                        <Input
                          value={releaseFormData.patreon_url}
                          onChange={(e) => setReleaseFormData({ ...releaseFormData, patreon_url: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://patreon.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingRelease ? 'Update Release' : 'Add Release'}
                    </Button>
                    {editingRelease && (
                      <Button type="button" variant="outline" onClick={resetReleaseForm} className="border-zinc-700">
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Songs/Videos */}
              <div>
                <h3 className="text-white font-semibold mb-3">Songs & Videos ({songReleases.length})</h3>
                <DragDropContext onDragEnd={(result) => handleReleaseDragEnd(result, 'songs')}>
                  <Droppable droppableId="songs">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {songReleases.length === 0 ? (
                          <p className="text-zinc-500 italic">No songs yet.</p>
                        ) : (
                          songReleases.map((release, index) => (
                            <Draggable key={release.id} draggableId={release.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors ${snapshot.isDragging ? 'shadow-lg border-purple-500' : ''}`}
                                >
                                  <div {...provided.dragHandleProps} className="cursor-grab text-zinc-500 hover:text-white">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <img
                                    src={release.cover_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100'}
                                    alt={release.title}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{release.title}</h3>
                                    <p className="text-xs text-zinc-500">{release.type} • {release.release_date || 'No date'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEditRelease(release)} className="text-zinc-400 hover:text-white">
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteReleaseMutation.mutate(release.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* Patreon Posts */}
              <div>
                <h3 className="text-white font-semibold mb-3">Patreon Posts ({patreonReleases.length})</h3>
                <DragDropContext onDragEnd={(result) => handleReleaseDragEnd(result, 'patreon')}>
                  <Droppable droppableId="patreon">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {patreonReleases.length === 0 ? (
                          <p className="text-zinc-500 italic">No Patreon posts yet.</p>
                        ) : (
                          patreonReleases.map((release, index) => (
                            <Draggable key={release.id} draggableId={release.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors ${snapshot.isDragging ? 'shadow-lg border-orange-500' : ''}`}
                                >
                                  <div {...provided.dragHandleProps} className="cursor-grab text-zinc-500 hover:text-white">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <img
                                    src={release.cover_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100'}
                                    alt={release.title}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{release.title}</h3>
                                    <p className="text-xs text-zinc-500">{release.release_date || 'No date'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEditRelease(release)} className="text-zinc-400 hover:text-white">
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteReleaseMutation.mutate(release.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Font Upload Section */}
      <Collapsible open={fontOpen} onOpenChange={setFontOpen}>
        <Card className="bg-zinc-900 border-zinc-800">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-500" />
                  Custom Font Uploader
                </div>
                {fontOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">Upload a custom font file (.ttf, .woff, .woff2, .otf) to use on your site.</p>
              
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/30">
                <Label className="text-zinc-400 mb-3 block">Select Font File</Label>
                <input
                  type="file"
                  accept=".ttf,.woff,.woff2,.otf"
                  onChange={handleFontUpload}
                  disabled={fontUploading}
                  className="block w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer disabled:opacity-50"
                />
                {fontUploading && (
                  <p className="text-purple-400 text-sm mt-2 animate-pulse">Uploading font...</p>
                )}
              </div>

              {uploadedFontUrl && (
                <div className="border border-green-900/50 bg-green-950/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Font Applied! (Refresh page to see changes)
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs">Font URL:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={uploadedFontUrl}
                        readOnly
                        className="bg-zinc-800 border-zinc-700 text-white font-mono text-xs"
                      />
                      <Button
                        onClick={copyFontToClipboard}
                        variant="outline"
                        className="shrink-0"
                      >
                        {fontCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Audio Upload Section */}
      <Collapsible open={audioOpen} onOpenChange={setAudioOpen}>
        <Card className="bg-zinc-900 border-zinc-800">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-500" />
                  Audio Uploader (SFX, Music)
                </div>
                {audioOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">Upload audio files to get a hosted URL for use in your site.</p>
              
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/30">
                <Label className="text-zinc-400 mb-3 block">Select Audio File</Label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  disabled={audioUploading}
                  className="block w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer disabled:opacity-50"
                />
                {audioUploading && (
                  <p className="text-purple-400 text-sm mt-2 animate-pulse">Uploading...</p>
                )}
              </div>

              {uploadedAudioUrl && (
                <div className="border border-green-900/50 bg-green-950/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Upload Successful!
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs">File URL:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={uploadedAudioUrl}
                        readOnly
                        className="bg-zinc-800 border-zinc-700 text-white font-mono text-xs"
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="shrink-0"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Comment Highlights Manager Section */}
      <Collapsible open={highlightOpen} onOpenChange={setHighlightOpen}>
        <Card className="bg-zinc-900 border-zinc-800">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Comment Highlights Manager
                </div>
                {highlightOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Add/Edit Form */}
              <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/30">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  {editingHighlight ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingHighlight ? 'Edit Highlight' : 'Add New Highlight'}
                </h3>
                <form onSubmit={handleHighlightSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 flex items-center gap-1">
                      <Image className="w-3 h-3" /> Image URL * <span className="text-xs text-zinc-600">(476×98 recommended)</span>
                    </Label>
                    <Input
                      value={highlightFormData.image_url}
                      onChange={(e) => setHighlightFormData({ ...highlightFormData, image_url: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Title (Optional)</Label>
                      <Input
                        value={highlightFormData.title}
                        onChange={(e) => setHighlightFormData({ ...highlightFormData, title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Contest Win, Fan Comment, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Source (Optional)</Label>
                      <Input
                        value={highlightFormData.source}
                        onChange={(e) => setHighlightFormData({ ...highlightFormData, source: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Patreon, Instagram, Suno Contest, etc."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingHighlight ? 'Update Highlight' : 'Add Highlight'}
                    </Button>
                    {editingHighlight && (
                      <Button type="button" variant="outline" onClick={resetHighlightForm} className="border-zinc-700">
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Highlights List */}
              <div>
                <h3 className="text-white font-semibold mb-3">Highlights ({highlights.length})</h3>
                <DragDropContext onDragEnd={handleHighlightDragEnd}>
                  <Droppable droppableId="highlights">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {highlights.length === 0 ? (
                          <p className="text-zinc-500 italic">No highlights yet.</p>
                        ) : (
                          highlights.map((highlight, index) => (
                            <Draggable key={highlight.id} draggableId={highlight.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors ${snapshot.isDragging ? 'shadow-lg border-purple-500' : ''}`}
                                >
                                  <div {...provided.dragHandleProps} className="cursor-grab text-zinc-500 hover:text-white">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <img
                                    src={highlight.image_url}
                                    alt={highlight.title || 'Highlight'}
                                    className="h-12 w-auto rounded object-contain bg-zinc-900"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{highlight.title || 'Untitled'}</h3>
                                    <p className="text-xs text-zinc-500">{highlight.source || 'No source'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEditHighlight(highlight)} className="text-zinc-400 hover:text-white">
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteHighlightMutation.mutate(highlight.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}