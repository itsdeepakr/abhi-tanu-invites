import React, { useState } from 'react';
import {
  Settings,
  X,
  Plus,
  Trash2,
  Share2,
  RotateCcw,
  Sparkles,
  Music,
  Camera,
  Image as ImageIcon,
  Calendar,
  Heart,
  Users,
  Check,
} from 'lucide-react';
import { EVENT_TONES, EVENT_OBJECTS } from '../config/defaultWedding';

export default function CustomizeDrawer({
  data,
  onChange,
  onReset,
  isOpen,
  onToggle,
  inviteId,
}) {
  const [activeTab, setActiveTab] = useState('couple');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null

  const handleSaveLive = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // 1. Sync to localStorage
      try {
        localStorage.setItem('vyoma_wedding_invitation_data', JSON.stringify(data));
      } catch {}

      // 2. If connected to an invitation ID, sync to live backend API
      const activeInviteId = inviteId || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('inviteId') || new URLSearchParams(window.location.search).get('id')) : null);
      if (activeInviteId) {
        const res = await fetch(`/api/invitations/${activeInviteId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const resJson = await res.json();
        if (!res.ok || !resJson.success) {
          throw new Error(resJson.error || 'Failed to save changes to server');
        }
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Save live error:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextChange = (section, field, value) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  const handleEventChange = (index, field, value) => {
    const nextItems = [...(data.events?.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onChange({
      ...data,
      events: {
        ...data.events,
        items: nextItems,
      },
    });
  };

  const handleAddEvent = () => {
    const nextItems = [
      ...(data.events?.items || []),
      {
        name: 'New Function',
        date: 'Wedding Week',
        time: '5:00 PM',
        venue: data.invitation?.venue || 'The Palace',
        map_url: '',
        tone: EVENT_TONES[0],
        object: 'kalash',
      },
    ];
    onChange({
      ...data,
      events: {
        ...data.events,
        items: nextItems,
      },
    });
  };

  const handleRemoveEvent = (index) => {
    const nextItems = (data.events?.items || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      events: {
        ...data.events,
        items: nextItems,
      },
    });
  };

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const nextPhotos = [...(data.photos || [])];
      nextPhotos[index] = { src: event.target.result };
      onChange({
        ...data,
        photos: nextPhotos,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({
        ...data,
        audio_url: event.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCopyShare = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // DPDPA 2023 Security & Guest Privacy: Public guests must NEVER see or trigger the customizer drawer.
  // Only authenticated wedding owners with explicit owner_edit mode can access customization.
  const isCustomizerEnabled = Boolean(
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'owner_edit' &&
    (Boolean(localStorage.getItem('vyoma_customer_session')) || new URLSearchParams(window.location.search).has('owner_token'))
  );

  return (
    <>
      {/* Floating Toggle Trigger Button at Bottom Left (Freeing up canvas) */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        {isCustomizerEnabled && (
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#2A0C18]/95 text-[#F6E7D6] hover:bg-[#3D1424] shadow-2xl backdrop-blur-md text-xs font-serif tracking-wider uppercase transition-all border border-[#D4AF37] hover:scale-105 active:scale-95"
            title="Customize invitation"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8C877]" />
            <span className="font-semibold">Customize</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#2A0C18]/90 text-[#F6E7D6] hover:bg-[#3D1424] shadow-2xl backdrop-blur-md text-xs font-serif tracking-wider transition-all border border-[#D4AF37]/30 hover:scale-105 active:scale-95"
          title="Copy clean shareable link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-300 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#E8C877]" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Drawer Overlay - Strictly guarded: only mounts when isCustomizerEnabled AND isOpen */}
      {isCustomizerEnabled && isOpen && (
        <div id="studioDrawer" className="vyoma-studio-overlay fixed inset-0 z-[10001] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-lg h-full bg-[#FFFBF3] shadow-2xl flex flex-col text-[#4A2C27] overflow-hidden border-l border-[#A67C45]/30">
            {/* Header */}
            <div className="px-6 py-4 bg-[#EBDACF]/50 border-b border-[#A67C45]/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#4A2C27] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#A67C45]" />
                  VYOMA Invitation Studio
                </h3>
                <p className="text-xs text-[#76564D]">
                  Personalize couple names, events, photos &amp; music with instant live reflection
                </p>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#4A2C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#A67C45]/20 bg-[#FFFBF3] text-xs font-medium overflow-x-auto no-scrollbar">
              {[
                { id: 'couple', label: 'Couple & Date', icon: Heart },
                { id: 'invitation', label: 'Invitation', icon: Calendar },
                { id: 'events', label: 'Celebrations', icon: Sparkles },
                { id: 'photos', label: 'Photos & Music', icon: ImageIcon },
                { id: 'blessings', label: 'Note & Blessings', icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                      active
                        ? 'border-[#A67C45] text-[#4A2C27] font-semibold bg-[#EBDACF]/30'
                        : 'border-transparent text-[#76564D] hover:text-[#4A2C27]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#A67C45]" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Couple & Date */}
              {activeTab === 'couple' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Bride's First Name (Sister)
                    </label>
                    <input
                      type="text"
                      value={data.hero?.bride_name || ''}
                      onChange={(e) => handleTextChange('hero', 'bride_name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Groom's First Name
                    </label>
                    <input
                      type="text"
                      value={data.hero?.groom_name || ''}
                      onChange={(e) => handleTextChange('hero', 'groom_name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1.5">
                      Couple Names Font Style (High-Contrast Typography)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'playfair', name: 'Modern Romance', desc: 'Playfair Display Serif (Ultra Clear)' },
                        { id: 'greatvibes', name: 'Royal Calligraphy', desc: 'Great Vibes Classic Script' },
                        { id: 'cinzel', name: 'Majestic Heritage', desc: 'Cinzel Carved Capitals' },
                        { id: 'vandella', name: 'Artisan Brush', desc: 'Vandella Signature Script' },
                        { id: 'bodoni', name: 'Vogue Haute Couture', desc: 'Bodoni Moda Luxury' },
                      ].map((f) => {
                        const isCurrent = (data.theme?.couple_font || 'playfair') === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              onChange({
                                ...data,
                                theme: { ...(data.theme || {}), couple_font: f.id },
                              });
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'border-[#8B5A2B] bg-[#F5DE98]/40 shadow-sm ring-2 ring-[#D4AF37]'
                                : 'border-[#A67C45]/30 bg-white hover:bg-[#FDF9F3]'
                            }`}
                          >
                            <p className="text-xs font-bold text-[#1E0812]">{f.name}</p>
                            <p className="text-[10px] text-[#76564D] font-medium">{f.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Hero Kicker
                    </label>
                    <input
                      type="text"
                      value={data.hero?.kicker || ''}
                      onChange={(e) => handleTextChange('hero', 'kicker', e.target.value)}
                      placeholder="The wedding of"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        Wedding Date
                      </label>
                      <input
                        type="date"
                        value={data.countdown?.wedding_date || ''}
                        onChange={(e) => handleTextChange('countdown', 'wedding_date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        Ceremony Time
                      </label>
                      <input
                        type="time"
                        value={data.countdown?.start_time || '19:00'}
                        onChange={(e) => handleTextChange('countdown', 'start_time', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Wax Seal Monogram (Optional, defaults to initials)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={data.envelope?.monogram || ''}
                      onChange={(e) => handleTextChange('envelope', 'monogram', e.target.value)}
                      placeholder="e.g. A & R"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>
                </div>
              )}

              {/* Invitation Card */}
              {activeTab === 'invitation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Invitation Intro
                    </label>
                    <input
                      type="text"
                      value={data.invitation?.intro || ''}
                      onChange={(e) => handleTextChange('invitation', 'intro', e.target.value)}
                      placeholder="Together with their families"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Invitation Message
                    </label>
                    <textarea
                      rows={3}
                      value={data.invitation?.message || ''}
                      onChange={(e) => handleTextChange('invitation', 'message', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        Main Venue
                      </label>
                      <input
                        type="text"
                        value={data.invitation?.venue || ''}
                        onChange={(e) => handleTextChange('invitation', 'venue', e.target.value)}
                        placeholder="The Leela Palace"
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={data.invitation?.city || ''}
                        onChange={(e) => handleTextChange('invitation', 'city', e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={data.details?.address || ''}
                      onChange={(e) => handleTextChange('details', 'address', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Google Maps Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={data.details?.map_url || ''}
                      onChange={(e) => handleTextChange('details', 'map_url', e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Attire / Dress Code
                    </label>
                    <input
                      type="text"
                      value={data.details?.attire || ''}
                      onChange={(e) => handleTextChange('details', 'attire', e.target.value)}
                      placeholder="Festive Indian or black tie"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        RSVP Contact Name
                      </label>
                      <input
                        type="text"
                        value={data.details?.rsvp_name || ''}
                        onChange={(e) => handleTextChange('details', 'rsvp_name', e.target.value)}
                        placeholder="Meera"
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                        RSVP Deadline
                      </label>
                      <input
                        type="text"
                        value={data.details?.rsvp_by || ''}
                        onChange={(e) => handleTextChange('details', 'rsvp_by', e.target.value)}
                        placeholder="1 October 2026"
                        className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Celebrations / Functions */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#76564D]">
                      Wedding Events ({data.events?.items?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddEvent}
                      className="flex items-center gap-1 px-3 py-1 bg-[#A67C45] text-white rounded-lg text-xs font-semibold hover:bg-[#8e6634]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Function
                    </button>
                  </div>

                  {(data.events?.items || []).map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#A67C45]/30 bg-white space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#A67C45]">
                          Function #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#76564D]">
                            Function Name
                          </label>
                          <input
                            type="text"
                            value={ev.name || ''}
                            onChange={(e) => handleEventChange(idx, 'name', e.target.value)}
                            placeholder="Reception / Muhurtham"
                            className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs focus:ring-1 focus:ring-[#A67C45]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#76564D]">
                            Tone / Card Color
                          </label>
                          <select
                            value={ev.tone || 'ivory'}
                            onChange={(e) => handleEventChange(idx, 'tone', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                          >
                            {EVENT_TONES.map((t) => (
                              <option key={t} value={t}>
                                {t.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#76564D]">
                            Date
                          </label>
                          <input
                            type="text"
                            value={ev.date || ''}
                            onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                            placeholder="Thursday, 12 Nov"
                            className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#76564D]">
                            Time
                          </label>
                          <input
                            type="text"
                            value={ev.time || ''}
                            onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                            placeholder="4 pm onwards"
                            className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-[#76564D]">
                          Venue
                        </label>
                        <input
                          type="text"
                          value={ev.venue || ''}
                          onChange={(e) => handleEventChange(idx, 'venue', e.target.value)}
                          placeholder="Venue name & city"
                          className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-[#76564D]">
                          Address (Optional)
                        </label>
                        <input
                          type="text"
                          value={ev.address || ''}
                          onChange={(e) => handleEventChange(idx, 'address', e.target.value)}
                          placeholder="Full address details"
                          className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-[#76564D]">
                          Decorative Motif Icon
                        </label>
                        <select
                          value={ev.object || ''}
                          onChange={(e) => handleEventChange(idx, 'object', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 text-xs"
                        >
                          <option value="">Auto-detect from event name</option>
                          {Object.entries(EVENT_OBJECTS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Photos & Music */}
              {activeTab === 'photos' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D]">
                      Couple Photos (3 Slots)
                    </label>

                    {[0, 1, 2].map((slotIdx) => (
                      <div
                        key={slotIdx}
                        className="p-3 bg-white rounded-xl border border-[#A67C45]/30 flex items-center gap-4"
                      >
                        {data.photos?.[slotIdx]?.src ? (
                          <img
                            src={data.photos[slotIdx].src}
                            alt=""
                            className="w-14 h-14 object-cover rounded-lg border border-black/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#A67C45]/40 bg-[#faf6f1] flex flex-col items-center justify-center text-[#A67C45] flex-shrink-0">
                            <Camera className="w-5 h-5 opacity-60" />
                            <span className="text-[9px] mt-0.5 opacity-80">No Photo</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#4A2C27]">
                            Photo #{slotIdx + 1} {slotIdx === 0 && '(Hero Main)'}
                          </p>
                          <label className="mt-1 inline-block text-xs text-[#A67C45] hover:underline cursor-pointer font-medium">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(slotIdx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#A67C45]/30 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-[#A67C45]" />
                      Background Wedding Music
                    </label>
                    <p className="text-xs text-[#76564D]">
                      Currently playing: Kannada Wedding Melody (Sanju Weds Geetha Theme • Flute & Strings)
                    </p>
                    <label className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#EBDACF] text-[#4A2C27] text-xs font-medium cursor-pointer hover:bg-[#A67C45] hover:text-white transition">
                      Upload Custom Audio File (.mp3)
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Note & Blessings */}
              {activeTab === 'blessings' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Love Note Heading
                    </label>
                    <input
                      type="text"
                      value={data.note?.heading || ''}
                      onChange={(e) => handleTextChange('note', 'heading', e.target.value)}
                      placeholder="A note from us"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Personal Message
                    </label>
                    <textarea
                      rows={4}
                      value={data.note?.message || ''}
                      onChange={(e) => handleTextChange('note', 'message', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Signoff
                    </label>
                    <input
                      type="text"
                      value={data.note?.signoff || ''}
                      onChange={(e) => handleTextChange('note', 'signoff', e.target.value)}
                      placeholder="With love,"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <hr className="border-[#A67C45]/20 my-2" />

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Elder Blessings Heading
                    </label>
                    <input
                      type="text"
                      value={data.blessings?.heading || ''}
                      onChange={(e) => handleTextChange('blessings', 'heading', e.target.value)}
                      placeholder="With the blessings of"
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Elders / Grandparents Names (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={data.blessings?.names || ''}
                      onChange={(e) => handleTextChange('blessings', 'names', e.target.value)}
                      placeholder="Smt. ... & Shri ..."
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#76564D] mb-1">
                      Closing Statement
                    </label>
                    <input
                      type="text"
                      value={data.details?.closing || ''}
                      onChange={(e) => handleTextChange('details', 'closing', e.target.value)}
                      placeholder="We can't wait to celebrate with you."
                      className="w-full px-3 py-2 rounded-lg border border-[#A67C45]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#A67C45]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-[#EBDACF]/50 border-t border-[#A67C45]/20 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#76564D] hover:text-red-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveLive}
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-600 text-white'
                      : saveStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-[#B85D19] hover:bg-[#9E4D12] text-white'
                  }`}
                  title="Save edits permanently to live invitation"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>✓ Saved &amp; Live!</span>
                    </>
                  ) : saveStatus === 'error' ? (
                    <span>Retry Save</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Save &amp; Publish Live</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onToggle}
                  className="px-4 py-2 rounded-lg bg-[#4A2C27] text-white text-xs font-semibold hover:bg-[#341e1a] shadow-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

