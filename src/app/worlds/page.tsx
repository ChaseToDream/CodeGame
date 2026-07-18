"use client";

import { useState, useMemo } from "react";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";

const SKIN_TONES = ["#7C5CFC", "#FF6B9D", "#4ECDC4", "#F0A04B", "#6bcf7f", "#264DE4"];

/** 等级解锁配置：每个物品定义解锁所需的最低等级 */
interface Unlockable {
  value: string;
  minLevel: number;
}

const HAIRSTYLES: Unlockable[] = [
  { value: "💇", minLevel: 1 },
  { value: "👨‍🦱", minLevel: 1 },
  { value: "👩‍🦰", minLevel: 2 },
  { value: "🧑‍🦲", minLevel: 3 },
  { value: "👨‍🦳", minLevel: 5 },
  { value: "🧕", minLevel: 7 },
  { value: "👲", minLevel: 10 },
  { value: "👑", minLevel: 15 },
];

const OUTFITS: Unlockable[] = [
  { value: "👕", minLevel: 1 },
  { value: "👚", minLevel: 1 },
  { value: "🥼", minLevel: 3 },
  { value: "🦺", minLevel: 4 },
  { value: "👔", minLevel: 6 },
  { value: "🧥", minLevel: 8 },
  { value: "🎭", minLevel: 12 },
  { value: "🦸", minLevel: 20 },
];

const ACCESSORIES: Unlockable[] = [
  { value: "👓", minLevel: 1 },
  { value: "🕶️", minLevel: 2 },
  { value: "🎩", minLevel: 4 },
  { value: "🧢", minLevel: 5 },
  { value: "⭐", minLevel: 8 },
  { value: "🌙", minLevel: 10 },
  { value: "🔥", minLevel: 15 },
  { value: "💎", minLevel: 25 },
];

export default function WorldsPage() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const currentLevel = user.level;

  // 计算已解锁的物品
  const unlockedHair = useMemo(() => HAIRSTYLES.filter((h) => h.minLevel <= currentLevel), [currentLevel]);
  const unlockedOutfits = useMemo(() => OUTFITS.filter((o) => o.minLevel <= currentLevel), [currentLevel]);
  const unlockedAccessories = useMemo(() => ACCESSORIES.filter((a) => a.minLevel <= currentLevel), [currentLevel]);

  const [skin, setSkin] = useState(user.character?.skin ?? SKIN_TONES[0]);
  const [hair, setHair] = useState(user.character?.hair ?? HAIRSTYLES[0].value);
  const [outfit, setOutfit] = useState(user.character?.outfit ?? OUTFITS[0].value);
  const [accessory, setAccessory] = useState(user.character?.accessory ?? ACCESSORIES[0].value);
  const [name, setName] = useState(user.username);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🗺️</div>
        <h1 className="font-outfit text-3xl font-bold">
          <span className="gradient-text">世界</span>
        </h1>
        <p className="text-muted mt-2">
          自定义你的像素英雄。随着等级提升，将解锁更多物品。
          <span className="block text-accent2 text-xs mt-1">
            当前等级 Lv.{currentLevel} — 已解锁 {unlockedHair.length + unlockedOutfits.length + unlockedAccessories.length} / {HAIRSTYLES.length + OUTFITS.length + ACCESSORIES.length} 件物品
          </span>
        </p>
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

          <Section label={`发型（${unlockedHair.length}/${HAIRSTYLES.length}）`}>
            <div className="flex flex-wrap gap-2">
              {HAIRSTYLES.map((h) => {
                const isUnlocked = h.minLevel <= currentLevel;
                const isSelected = hair === h.value;
                return (
                  <button
                    key={h.value}
                    onClick={() => isUnlocked && setHair(h.value)}
                    disabled={!isUnlocked}
                    title={isUnlocked ? h.value : `Lv.${h.minLevel} 解锁`}
                    className={cn(
                      "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition relative",
                      !isUnlocked && "opacity-30 cursor-not-allowed",
                      isSelected && isUnlocked && "border-accent bg-bg3 scale-110",
                      !isSelected && isUnlocked && "border-rule bg-bg2 hover:border-accent/50",
                    )}
                  >
                    {isUnlocked ? h.value : "🔒"}
                    {!isUnlocked && (
                      <span className="absolute -bottom-1 right-0 text-[8px] text-muted font-bold bg-bg2 px-0.5 rounded">
                        Lv{h.minLevel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section label={`服装（${unlockedOutfits.length}/${OUTFITS.length}）`}>
            <div className="flex flex-wrap gap-2">
              {OUTFITS.map((o) => {
                const isUnlocked = o.minLevel <= currentLevel;
                const isSelected = outfit === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => isUnlocked && setOutfit(o.value)}
                    disabled={!isUnlocked}
                    title={isUnlocked ? o.value : `Lv.${o.minLevel} 解锁`}
                    className={cn(
                      "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition relative",
                      !isUnlocked && "opacity-30 cursor-not-allowed",
                      isSelected && isUnlocked && "border-accent bg-bg3 scale-110",
                      !isSelected && isUnlocked && "border-rule bg-bg2 hover:border-accent/50",
                    )}
                  >
                    {isUnlocked ? o.value : "🔒"}
                    {!isUnlocked && (
                      <span className="absolute -bottom-1 right-0 text-[8px] text-muted font-bold bg-bg2 px-0.5 rounded">
                        Lv{o.minLevel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section label={`配饰（${unlockedAccessories.length}/${ACCESSORIES.length}）`}>
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((a) => {
                const isUnlocked = a.minLevel <= currentLevel;
                const isSelected = accessory === a.value;
                return (
                  <button
                    key={a.value}
                    onClick={() => isUnlocked && setAccessory(a.value)}
                    disabled={!isUnlocked}
                    title={isUnlocked ? a.value : `Lv.${a.minLevel} 解锁`}
                    className={cn(
                      "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition relative",
                      !isUnlocked && "opacity-30 cursor-not-allowed",
                      isSelected && isUnlocked && "border-accent bg-bg3 scale-110",
                      !isSelected && isUnlocked && "border-rule bg-bg2 hover:border-accent/50",
                    )}
                  >
                    {isUnlocked ? a.value : "🔒"}
                    {!isUnlocked && (
                      <span className="absolute -bottom-1 right-0 text-[8px] text-muted font-bold bg-bg2 px-0.5 rounded">
                        Lv{a.minLevel}
                      </span>
                    )}
                  </button>
                );
              })}
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
