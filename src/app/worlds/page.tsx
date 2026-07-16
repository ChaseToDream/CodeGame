"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";

const SKIN_TONES = ["#7C5CFC", "#FF6B9D", "#4ECDC4", "#F0A04B", "#6bcf7f", "#264DE4"];
const HAIRSTYLES = ["💇", "👨‍🦱", "👩‍🦰", "🧑‍🦲", "👨‍🦳", "🧕", "👲", "👑"];
const OUTFITS = ["👕", "👚", "🥼", "🦺", "👔", "🧥", "🎭", "🦸"];
const ACCESSORIES = ["👓", "🕶️", "🎩", "🧢", "⭐", "🌙", "🔥", "💎"];

export default function WorldsPage() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const [skin, setSkin] = useState(user.character?.skin ?? SKIN_TONES[0]);
  const [hair, setHair] = useState(user.character?.hair ?? HAIRSTYLES[0]);
  const [outfit, setOutfit] = useState(user.character?.outfit ?? OUTFITS[0]);
  const [accessory, setAccessory] = useState(user.character?.accessory ?? ACCESSORIES[0]);
  const [name, setName] = useState(user.username);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🗺️</div>
        <h1 className="font-outfit text-3xl font-bold">
          <span className="gradient-text">世界</span>
        </h1>
        <p className="text-muted mt-2">自定义你的像素英雄。随着等级提升，将解锁更多物品。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="rounded-2xl border border-rule bg-gradient-to-br from-bg2 to-bg3 p-8 flex flex-col items-center justify-center">
          <div className="text-xs text-muted mb-3 uppercase tracking-wider">预览</div>
          <div
            className="h-40 w-40 rounded-2xl flex items-center justify-center text-7xl relative"
            style={{ background: `linear-gradient(135deg, ${skin}, ${skin}aa)` }}
          >
            <span className="absolute -top-4 text-4xl">{accessory}</span>
            <span>{hair}</span>
            <span className="absolute -bottom-2 text-4xl">{outfit}</span>
          </div>
          <div className="mt-5 font-pixel text-xl text-ink">{name}</div>
          <div className="text-xs text-accent2 mt-1">等级 {user.level} · {user.xpTotal} XP</div>
          <div className="mt-3 text-[11px] text-muted text-center max-w-xs">
            你的角色将伴随你穿梭于每门课程和社区帖子之间。
          </div>
        </div>

        {/* Customizer */}
        <div className="space-y-5">
          <Section label="名称">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink focus:border-accent focus:outline-none transition"
            />
          </Section>

          <Section label="肤色">
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSkin(c)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition",
                    skin === c ? "border-ink scale-110" : "border-transparent hover:scale-105",
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Section>

          <Section label="发型">
            <div className="flex flex-wrap gap-2">
              {HAIRSTYLES.map((h) => (
                <button
                  key={h}
                  onClick={() => setHair(h)}
                  className={cn(
                    "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition",
                    hair === h ? "border-accent bg-bg3 scale-110" : "border-rule bg-bg2 hover:border-accent/50",
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </Section>

          <Section label="服装">
            <div className="flex flex-wrap gap-2">
              {OUTFITS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOutfit(o)}
                  className={cn(
                    "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition",
                    outfit === o ? "border-accent bg-bg3 scale-110" : "border-rule bg-bg2 hover:border-accent/50",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </Section>

          <Section label="配饰">
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAccessory(a)}
                  className={cn(
                    "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition",
                    accessory === a ? "border-accent bg-bg3 scale-110" : "border-rule bg-bg2 hover:border-accent/50",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </Section>

          <button
            onClick={() => {
              const trimmedName = name.trim();
              updateUser({
                username: trimmedName || user.username,
                character: { skin, hair, outfit, accessory },
              });
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
          >
            {saved ? "✓ 已保存" : "保存角色"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">{label}</label>
      {children}
    </div>
  );
}
