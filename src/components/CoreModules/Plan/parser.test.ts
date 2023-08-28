import {PlanService} from "./parser";

test('parser', () => {
    const l = new PlanService().fromSource(faultyPlan);
    console.log(l)
});

const faultyPlan = `Append  (cost=1392.21..358759.64 rows=158910 width=30) (actual time=72.460..6505.406 rows=153522 loops=1)
  Buffers: shared hit=5611 read=73829
  I/O Timings: read=3390.153
Planning:
  Buffers: shared hit=741 read=173
  I/O Timings: read=335.116
Planning Time: 363.845 ms
Execution Time: 6523.606 ms`
