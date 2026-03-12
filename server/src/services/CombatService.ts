import { Room } from "colyseus";
import { MyRoomState } from "../rooms/schema/MyRoomState.js";

export interface AttackHitEvent {
  attackerId: string;
  targetId: string;
  damage: number;
  targetHp: number;
}

interface CombatEntry {
  targetId: string;
  room: Room;
  timer: ReturnType<typeof setInterval>;
}

const ATTACK_INTERVAL_MS = 2000;
const BASE_DAMAGE = 10;
const ATTACK_RANGE = 1.0; // meters

class CombatService {
  private combatants = new Map<string, CombatEntry>();

  startAttack(attackerId: string, targetId: string, room: Room): void {
    // Stop any existing attack first
    this.stopAttack(attackerId);

    const timer = setInterval(() => {
      this.processHit(attackerId);
    }, ATTACK_INTERVAL_MS);

    this.combatants.set(attackerId, { targetId, room, timer });

    console.log(`[CombatService] ${attackerId} started attacking ${targetId}`);
  }

  stopAttack(attackerId: string): void {
    const entry = this.combatants.get(attackerId);
    if (!entry) return;

    clearInterval(entry.timer);
    this.combatants.delete(attackerId);

    console.log(`[CombatService] ${attackerId} stopped attacking`);
  }

  private processHit(attackerId: string): void {
    const entry = this.combatants.get(attackerId);
    if (!entry) return;

    const { targetId, room } = entry;

    // Verify both players are still in the room
    const state = room.state as MyRoomState;
    const attacker = state.players.get(attackerId);
    const target = state.players.get(targetId);

    if (!attacker || !target) {
      console.log(
        `[CombatService] ${attackerId} or ${targetId} left room — stopping combat`
      );
      this.stopAttack(attackerId);
      return;
    }

    // Range check
    const dx = attacker.px - target.px;
    const dy = attacker.py - target.py;
    const dz = attacker.pz - target.pz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > ATTACK_RANGE) {
      console.log(
        `[CombatService] ${attackerId} out of range (${dist.toFixed(2)}m) — skipping`
      );
      return;
    }

    // Apply damage
    target.hp = Math.max(0, target.hp - BASE_DAMAGE);

    const event: AttackHitEvent = {
      attackerId,
      targetId,
      damage: BASE_DAMAGE,
      targetHp: target.hp,
    };

    room.broadcast("attack_hit", event);

    console.log(
      `[CombatService] HIT — ${attackerId} → ${targetId} for ${BASE_DAMAGE} dmg (hp: ${target.hp})`
    );
  }

  /** Call when a player disconnects to clean up their active combat */
  onPlayerLeave(sessionId: string): void {
    // Stop this player attacking anyone
    this.stopAttack(sessionId);

    // Stop anyone who was attacking this player
    for (const [attackerId, entry] of this.combatants) {
      if (entry.targetId === sessionId) {
        this.stopAttack(attackerId);
      }
    }
  }
}

export const combatService = new CombatService();
