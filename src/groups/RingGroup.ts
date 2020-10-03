import { Ring } from "../gameobjects/Ring";

export type Intersection = { ring: Ring; point: Phaser.Geom.Point };
export type IntersectionResult = {
  ring: Ring;
  point: Phaser.Geom.Point;
  distanceSq: number;
};
type Intersections = Map<Ring, Array<Intersection>>;

export class RingGroup extends Phaser.GameObjects.Group {
  private intersections: Intersections = new Map();
  readonly rings: Ring[];

  constructor(scene: Phaser.Scene, rings: Ring[]) {
    super(scene, undefined, {runChildUpdate: true});

    this.rings = rings;
    rings.forEach((from) => {
      const points = rings.flatMap((to) => {
        if (to === from) return [];
        return Phaser.Geom.Intersects.GetCircleToCircle(
          to.circle,
          from.circle
        ).map((point) => ({ ring: to, point }));
      });
      this.intersections.set(from, points);
      this.add(from);
      scene.add.existing(from);
    });
  }

  findCloseIntersections(
    ring: Ring,
    point: Point,
    closeDistance: number
  ): IntersectionResult[] {
    const sqDistance = closeDistance ** 2;
    const is = this.intersections.get(ring);
    if (!is) return [];
    const results = is
      .map(({ ring, point: p }) => ({
        ring,
        point: p,
        distanceSq: Phaser.Math.Distance.BetweenPointsSquared(p, point),
      }))
      .filter(({ distanceSq }) => distanceSq < sqDistance);
    results.sort((a, b) => a.distanceSq - b.distanceSq);
    return results;
  }

  update() {
    this.rings.forEach(ring => ring.update());
  }
}
