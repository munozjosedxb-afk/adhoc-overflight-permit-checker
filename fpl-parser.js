// ICAO FPL extraction helpers. Kept separate from the main UI so each change can be verified safely.
function parseCoreFpl(raw){
  // Full OFPs contain route summaries and waypoint/NOTAM text before the
  // embedded ICAO FPL. Isolate the parenthesized FPL first so earlier text
  // cannot satisfy any of the route-field regexes.
  const rawText=String(raw||'');
  const start=rawText.search(/\(FPL-/i);
  if(start<0) return {valid:false};
  const end=rawText.indexOf(')',start);
  const block=(end>=0?rawText.slice(start,end+1):rawText.slice(start)).replace(/\s+/g,' ').trim();
  const m=block.match(/\(FPL-([A-Z0-9\/]+).*?-([A-Z]{4})(\d{4}).*?-([A-Z])(\d{3,4})((?:F|S)\d{3,4}).*?-([A-Z]{4})(\d{4})/i);
  if(!m) return {valid:false};
  const date=(block.match(/DOF\/(\d{6})/i)||[])[1]||'';
  const reg=(block.match(/REG\/([A-Z0-9-]+)/i)||[])[1]||'';
  return {valid:true,callsign:m[1],origin:m[2],eobt:m[3],speed:m[5],level:m[6],destination:m[7],eetTotal:m[8],eta:m[8],date,reg};
}


function parseEetAnchors(eet){
  return String(eet||'').split(/\s+/).map(x=>{
    const m=x.match(/^([A-Z0-9]{3,5})(\d{4})$/);
    return m?{fir:m[1],time:m[2]}:null;
  }).filter(Boolean);
}


function interpolateEetTime(anchorA, anchorB, fraction){
  if(!anchorA || !anchorB) return 'REVIEW';
  const toMin=t=>parseInt(t.slice(0,2),10)*60+parseInt(t.slice(2),10);
  const a=toMin(anchorA.time), b=toMin(anchorB.time);
  let delta=b-a; if(delta<0) delta+=1440;
  const f=Math.max(0,Math.min(1,Number(fraction)||0));
  const total=(a+delta*f)%1440;
  return String(Math.floor(total/60)).padStart(2,'0')+String(Math.round(total%60)).padStart(2,'0');
}
