function _1(md){return(
md`# Workout Consistency Heatmap

Strength training is one of the best activities for improving one's overall health and well-being. Its main principle is simple: if you train regularly, you slowly build strength & muscle; otherwise you slowly loose them. Consistency is considered way more important than the choice of program.

As a geek with short attention span who's terrible at establishing habits, I always spent way more time on reading & research about strength training than actually training in the gym, so despite the best choice of programming & exercise technique, I failed miserably on the most important part — consistent training. At times I could blame injuries, haphazard travel, or overload on work & family commitments, but for the most part, I'm just terrible at organizing myself and following a routine. I want to change that. To visualize how terrible I'd been and how well I'll be doing going forward, I made the chart below.

_Edit_: a few months after publishing this, the pandemic started. Welp, there goes my workout routine... Still, I'm hoping for the best and trying to get at least some workouts in to maintain strength until everything goes back to normal.
`
)}

function _2(dates,width,DOM,days,dayMs,colors)
{
  const startDate = Date.parse(dates[0]);
  const startYear = new Date(startDate).getYear();
  const numYears = new Date(dates[dates.length - 1]).getYear() - startYear + 1;

  const maxWeeks = 53;
  const size = Math.floor(width / maxWeeks);
  const margin = Math.max(1, Math.round(size / 4));
  const ctx = DOM.context2d(size * maxWeeks, (numYears * 7) * size + (numYears - 1) * margin);
  
  ctx.lineWidth = 2;
  
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const date = new Date(startDate + i * dayMs);
    const yearStart = new Date(date);
    yearStart.setMonth(0);
    yearStart.setDate(1);
    
    ctx.fillStyle = colors[d];
    const x = Math.floor((yearStart.getDay() + Math.round((date - yearStart) / dayMs)) / 7) * size;
    const y = (date.getYear() - startYear) * (7 * size + margin) + date.getDay() * size;
    ctx.fillRect(x, y, size, size);

    if (d === 0) {
      const r = Math.max(1, size / 7);
      const c = size / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(x + c, y + c, r, 0, 2 * Math.PI, false);
      ctx.fill();
    }
    const day = date.getDate();
    if (day <= 7 && date.getMonth() > 0) {
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x, y);
      if (day === 1 && date.getDay() > 0) {
        ctx.lineTo(x + size, y);
      }
      ctx.stroke();
    }
  }
  return ctx.canvas;
}


function _3(md,colors){return(
md`
The chart visualizes the last few years of my training (2017—2022), where: 
- Light dots are the days I did a workout (full-body: push, pull, legs).
- <strong style="color: ${colors[0]}">Green</strong> cells are the days I gained strength & muscle.
- <strong style="color: ${colors[colors.length - 1]}">Red</strong> cells are the days I lost them.

For the general population (not advanced athletes), experts agree on a 2–3 days interval (~3 times per week) as an optimal timing for training a muscle group; 1 per week is considered maintenance level, with the negative trend taking over as the interval increases. Hence the colors.

Data is taken from [StrengthLevel.com](https://strengthlevel.com/11405-vladimiragafonkin), where I track my workouts — it helpfully has a CSV export and is a nice tool overall.

If you want to start or learn more about strength training, I highly recommend [The Fitness Wiki](https://thefitness.wiki/).

## Appendix
`
)}

function _data(FileAttachment){return(
FileAttachment("agafonkin 2022-11-20 224354.csv")
)}

async function _dates(data)
{
  const lines = (await data.text()).split('\n').slice(1);
  const set = new Set();
  for (const line of lines) set.add(line.split(',')[0]);
  return [...set.keys()].sort();
}


function _days(dates,dayMs)
{
  const days = [];
  for (let i = 0; i < dates.length; i++) {
    const current = Date.parse(dates[i]);
    const next = i === dates.length - 1 ? Date.now() : Date.parse(dates[i + 1]);
    for (let k = 0, len = Math.round((next - current) / dayMs); k < len; k++) days.push(k);
  }
  return days;
}


function _colors(){return(
['#1a9850', '#1a9850', '#91cf60', '#d9ef8b', '#ffffbf', '#fee08b', '#fc8d59', '#d73027']
)}

function _dayMs(){return(
1000 * 24 * 60 * 60
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["agafonkin 2022-11-20 224354.csv", {url: new URL("./files/b93f4a300fa943f4f173eb55b63625074635d6019490236e455f00b97c5465d3fa716dc662b0455cc1e37a4e8d775cc2296b3d7f24fcad6ee4cfecd983799a9c.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["dates","width","DOM","days","dayMs","colors"], _2);
  main.variable(observer()).define(["md","colors"], _3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("dates")).define("dates", ["data"], _dates);
  main.variable(observer("days")).define("days", ["dates","dayMs"], _days);
  main.variable(observer("colors")).define("colors", _colors);
  main.variable(observer("dayMs")).define("dayMs", _dayMs);
  return main;
}
