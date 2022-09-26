
const circularSegment = (frac) => {
    let h = frac;
    if (h > 0 && h < 1) {
      let t0, t1 = Math.pow(12 * h * Math.PI, 1 / 3);
      for (let i = 0; i < 10; ++i) {
        t0 = t1;
        t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * h * Math.PI) / (1 - Math.cos(t0));
      }
      h = (1 - Math.cos(t1 / 2)) / 2;
    }
    return h;

}

export default circularSegment